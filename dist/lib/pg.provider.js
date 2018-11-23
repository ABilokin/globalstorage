'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var common = require('@metarhia/common');

var metasync = require('metasync');

var pg = require('pg');

var _require = require('./errors'),
    GSError = _require.GSError,
    errorCodes = _require.codes;

var _require2 = require('./provider'),
    StorageProvider = _require2.StorageProvider;

var _require3 = require('./pg.utils'),
    generateQueryParams = _require3.generateQueryParams,
    escapeIdentifier = _require3.escapeIdentifier,
    buildWhere = _require3.buildWhere;

var _require4 = require('./pg.cursor'),
    PostgresCursor = _require4.PostgresCursor;

var _require5 = require('./schema.utils'),
    isGlobalCategory = _require5.isGlobalCategory,
    isIgnoredCategory = _require5.isIgnoredCategory,
    getCategoryRealm = _require5.getCategoryRealm,
    getCategoryFamily = _require5.getCategoryFamily,
    getCategoryActions = _require5.getCategoryActions;

var recreateIdTrigger = Symbol('recreateIdTrigger');
var uploadCategoriesAndActions = Symbol('uploadCategoriesAndActions');
var selectWithId = Symbol('selectWithId');

var PostgresProvider =
/*#__PURE__*/
function (_StorageProvider) {
  _inherits(PostgresProvider, _StorageProvider);

  // Create PostgresProvider
  //   gs - globalstorage instance
  function PostgresProvider(gs) {
    var _this;

    _classCallCheck(this, PostgresProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PostgresProvider).call(this, gs));
    _this.pool = null;
    return _this;
  } // Open PostgresProvider
  //   options - object, passed to pg
  //   callback - function(err, StorageProvider)


  _createClass(PostgresProvider, [{
    key: "open",
    value: function open(options, callback) {
      this.pool = new pg.Pool(options);
      callback(null, this);
    } // Close PostgresProvider
    //   callback - function(err)

  }, {
    key: "close",
    value: function close(callback) {
      var _this2 = this;

      if (!this.pool) {
        callback();
        return;
      }

      this.pool.end(function () {
        _this2.pool = null;
        callback();
      });
    }
  }, {
    key: recreateIdTrigger,
    value: function value(maxIdCount, refillPercent, callback) {
      var _this3 = this;

      this.pool.query('DROP TRIGGER IF EXISTS idgen ON "Identifier"', function (err) {
        if (err) {
          callback(err);
        }

        _this3.pool.query('SELECT trigger_creator($1, $2, $3, $4)', [maxIdCount, refillPercent, _this3.gs.serverId, _this3.gs.serverIdBitCount], function (err) {
          callback(err);
        });
      });
    }
  }, {
    key: uploadCategoriesAndActions,
    value: function value(callback) {
      var _this4 = this;

      var categories = common.iter(this.gs.schema.categories).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            value = _ref2[1].definition;

        return !isIgnoredCategory(value);
      }).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            Name = _ref4[0],
            value = _ref4[1].definition;

        return {
          Name: Name,
          Realm: getCategoryRealm(value),
          Family: getCategoryFamily(value),
          // TODO: remove Version when metaschema will be able to work with the
          // default values
          Version: 0
        };
      }).toArray();

      var _categories$splice = categories.splice(categories.findIndex(function (c) {
        return c.Name === 'Category';
      }), 1),
          _categories$splice2 = _slicedToArray(_categories$splice, 1),
          Category = _categories$splice2[0];

      metasync.sequential([function (ctx, callback) {
        _this4.create('Category', Category, function (err, id) {
          Category.Id = id;
          callback(err);
        });
      }, function (ctx, callback) {
        _this4.update('Identifier', {
          Id: Category.Id
        }, {
          Category: Category.Id
        }, function (err) {
          callback(err);
        });
      }, function (ctx, callback) {
        metasync.series(categories, function (value, callback) {
          _this4.create('Category', value, function (err, id) {
            value.Id = id;
            callback(err);
          });
        }, function (err) {
          callback(err);
        });
      }, function (ctx, callback) {
        metasync.series(common.iter(categories).flatMap(function (c) {
          var actions = getCategoryActions(_this4.gs.schema.categories.get(c.Name).definition);
          actions.forEach(function (a) {
            a.Category = c.Id;
          });
          return actions;
        }).toArray(), function (value, callback) {
          _this4.create('Action', value, function (err) {
            callback(err);
          });
        }, function (err) {
          callback(err);
        });
      }], function (err) {
        callback(err);
      });
    }
  }, {
    key: selectWithId,
    value: function value(categories, callback) {
      var _this5 = this;

      var results = {};
      metasync.each(categories, function (cat, callback) {
        _this5.select(cat, {}).fetch(function (err, rows) {
          if (err) {
            callback(err);
          } else {
            results[cat] = rows;
            callback();
          }
        });
      }, function (err) {
        if (err) callback(err);else callback(null, results);
      });
    } // Generate globally unique id
    //   client - pg.Pool or pg.Client instance
    //   callback - function(err, id)

  }, {
    key: "takeId",
    value: function takeId(client, callback) {
      var takeIdQuery = 'UPDATE "Identifier"' + ' SET "Status" = \'Init\', "Change" = CURRENT_TIMESTAMP' + ' WHERE "Id" = (SELECT min("Id")' + ' FROM "Identifier"' + ' WHERE "Status" = \'Prealloc\' AND "StorageKind" = \'Master\'' + ') RETURNING "Id"';
      client.query(takeIdQuery, function (err, res) {
        if (err) {
          callback(err);
          return;
        }

        if (res.rowCount === 0) {
          callback(new GSError(errorCodes.NOT_FOUND, 'Cannot get Id to use for object creation'));
          return;
        }

        callback(null, res.rows[0].Id);
      });
    }
  }, {
    key: "getCategoryById",
    value: function getCategoryById(id, callback) {
      var categoryQuery = 'SELECT "Category"."Name"' + ' FROM "Identifier", "Category"' + ' WHERE "Identifier"."Category" = "Category"."Id" AND' + ' "Identifier"."Id" = $1';
      this.pool.query(categoryQuery, [id], function (err, res) {
        if (err) {
          callback(err);
          return;
        }

        if (res.rowCount === 0) {
          callback(new GSError(errorCodes.NOT_FOUND, "No object with Id ".concat(id, " available")));
          return;
        }

        var Name = res.rows[0].Name;
        callback(null, Name);
      });
    } // Get object from GlobalStorage
    //   id - globally unique object id
    //   callback - function(err, obj)

  }, {
    key: "get",
    value: function get(id, callback) {
      var _this6 = this;

      this.getCategoryById(id, function (err, category) {
        if (err) {
          callback(err);
          return;
        }

        var objectQuery = "SELECT * FROM ".concat(escapeIdentifier(category)) + ' WHERE "Id" = $1';

        _this6.pool.query(objectQuery, [id], function (err, res) {
          if (err) {
            callback(err);
            return;
          }

          if (res.rowCount === 0) {
            callback(new GSError(errorCodes.NOT_FOUND, "No object with Id ".concat(id, " available")));
            return;
          }

          callback(null, res.rows[0]);
        });
      });
    } // Set object in GlobalStorage
    //   obj - object to be stored
    //   callback - function(err)

  }, {
    key: "set",
    value: function set(obj, callback) {
      var _this7 = this;

      if (!obj.Id) {
        throw new TypeError('Id is not provided');
      }

      this.getCategoryById(obj.Id, function (err, category) {
        if (err) {
          callback(err);
          return;
        } // TODO: get rid of the next copying and field deletion, when validation
        // will allow for fields that are not present in schemas to be present in
        // the object being validated


        var toValidate = Object.assign({}, obj);
        delete toValidate.Id;

        var error = _this7.gs.schema.validateCategory(category, toValidate);

        if (error) {
          callback(new GSError(errorCodes.INVALID_SCHEMA, "Invalid schema provided: ".concat(error.toString())));
          return;
        }

        var fields = Object.keys(obj).filter(function (key) {
          return key !== 'Id';
        });
        var values = fields.map(function (key) {
          return obj[key];
        });
        fields = fields.map(escapeIdentifier);
        var setQuery = "UPDATE ".concat(escapeIdentifier(category)) + " SET (".concat(fields.join(', '), ") =") + " ROW (".concat(generateQueryParams(fields.length), ")");

        _this7.pool.query(setQuery, values, function (err) {
          callback(err);
        });
      });
    } // Create object in GlobalStorage
    //   category - string, category to store the object in
    //   obj - object to be stored
    //   callback - function(err, id)

  }, {
    key: "create",
    value: function create(category, obj, callback) {
      var _this8 = this;

      var error = this.gs.schema.validateCategory(category, obj);

      if (error) {
        process.nextTick(callback, new GSError(errorCodes.INVALID_SCHEMA, "Invalid schema provided: ".concat(error.toString())));
        return;
      }

      var categoryDefinition = this.gs.schema.categories.get(category).definition;

      if (isIgnoredCategory(categoryDefinition)) {
        process.nextTick(callback, new GSError(errorCodes.INVALID_CATEGORY_TYPE, "Record creation in ignored category: ".concat(category)));
        return;
      }

      if (isGlobalCategory(categoryDefinition)) {
        this.pool.connect(function (err, client, done) {
          if (err) {
            callback(err);
            return;
          }

          metasync.sequential([function (ctx, cb) {
            _this8.takeId(client, function (err, id) {
              ctx.id = id;
              cb(err);
            });
          }, function (ctx, cb) {
            createRecord(client, ctx.id, function (err) {
              cb(err);
            });
          }, function (ctx, cb) {
            client.query('UPDATE "Identifier"' + ' SET "Status" = \'Actual\', "Change" = CURRENT_TIMESTAMP,' + ' "Category" = (SELECT "Id" FROM "Category" WHERE "Name" = $1),' + ' "Checksum" = (SELECT get_checksum($1, $2, \'sha512\'))' + ' WHERE "Id" = $2', [category, ctx.id], function (err) {
              cb(err);
            });
          }], function (err, ctx) {
            if (err) {
              client.query('ROLLBACK', function (rollbackError) {
                if (rollbackError) {
                  callback(rollbackError);
                } else {
                  callback(err);
                }

                done();
              });
              return;
            }

            client.query('COMMIT', function (err) {
              if (err) {
                callback(err);
              } else {
                callback(null, ctx.id);
              }

              done();
            });
          });
        });
      } else {
        createRecord(this.pool, null, callback);
      }

      function createRecord(client, id, done) {
        var fields = Object.keys(obj).filter(function (key) {
          return key !== 'Id';
        });
        var values = fields.map(function (key) {
          return obj[key];
        });

        if (id) {
          fields.push('Id');
          values.push(id.toString());
        }

        fields = fields.map(escapeIdentifier);
        var createQuery = "INSERT INTO ".concat(escapeIdentifier(category), " ") + "(".concat(fields.join(', '), ")") + " VALUES (".concat(generateQueryParams(fields.length), ")") + ' RETURNING "Id"';
        client.query(createQuery, values, function (err, res) {
          if (err) {
            done(err);
            return;
          }

          done(null, res.rows.length > 0 && res.rows[0].Id);
        });
      }
    } // Update object in GlobalStorage
    //   category - string, category to update the records in
    //   query - object, example: { Id }
    //   patch - object, fields to update
    //   callback - function(err, count)

  }, {
    key: "update",
    value: function update(category, query, patch, callback) {
      var error = this.gs.schema.validateCategory(category, patch, true);

      if (error) {
        process.nextTick(callback, new GSError(errorCodes.INVALID_SCHEMA, "Invalid schema provided: ".concat(error.toString())));
        return;
      }

      var fields = Object.keys(patch);
      var values = fields.map(function (key) {
        return patch[key];
      });
      fields = fields.map(escapeIdentifier);

      var _buildWhere = buildWhere(query),
          _buildWhere2 = _slicedToArray(_buildWhere, 2),
          where = _buildWhere2[0],
          whereParams = _buildWhere2[1];

      var updateQuery = "UPDATE ".concat(escapeIdentifier(category), " SET ") + "(".concat(fields.join(', '), ") = ") + "ROW (".concat(generateQueryParams(fields.length, whereParams.length + 1), ")") + where;
      this.pool.query(updateQuery, whereParams.concat(values), function (err, res) {
        callback(err, res && res.rowCount);
      });
    } // Delete object in GlobalStorage
    //   category - string, category to delete the records from
    //   query - object, example: { Id }
    //   callback - function(err, count)

  }, {
    key: "delete",
    value: function _delete(category, query, callback) {
      var _buildWhere3 = buildWhere(query),
          _buildWhere4 = _slicedToArray(_buildWhere3, 2),
          where = _buildWhere4[0],
          whereParams = _buildWhere4[1];

      var deleteQuery = "DELETE FROM ".concat(escapeIdentifier(category), " ") + where;
      this.pool.query(deleteQuery, whereParams, function (err, res) {
        callback(err, res && res.rowCount);
      });
    } // Select objects from GlobalStorage
    //   category - string, category to select the records from
    //   query - fields conditions
    // Returns: Cursor

  }, {
    key: "select",
    value: function select(category, query) {
      return new PostgresCursor(this.pool, {
        category: category
      }).select(query);
    }
  }]);

  return PostgresProvider;
}(StorageProvider);

module.exports = {
  PostgresProvider: PostgresProvider,
  recreateIdTrigger: recreateIdTrigger,
  uploadCategoriesAndActions: uploadCategoriesAndActions,
  selectWithId: selectWithId
};
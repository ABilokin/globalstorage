'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var jstp = require('@metarhia/jstp');

var _require = require('./provider'),
    StorageProvider = _require.StorageProvider;

var _require2 = require('./remote.cursor'),
    RemoteCursor = _require2.RemoteCursor;

var RemoteProvider =
/*#__PURE__*/
function (_StorageProvider) {
  _inherits(RemoteProvider, _StorageProvider);

  function RemoteProvider(gs) {
    var _this;

    _classCallCheck(this, RemoteProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RemoteProvider).call(this, gs));
    _this.connection = null;
    return _this;
  } // Open RemoteProvider
  //    options <Object> options for jstp connection
  //      transport <string> jstp transport name
  //      connectionArgs <Array> arguments to be passed to corresponding
  //          transport's connect method
  //    callback <Function>
  //      error <Error> | <null>
  //      provider <StorageProvider>


  _createClass(RemoteProvider, [{
    key: "open",
    value: function open(options, callback) {
      var _jstp$options$transpo,
          _this2 = this;

      (_jstp$options$transpo = jstp[options.transport]).connect.apply(_jstp$options$transpo, _toConsumableArray(options.connectionArgs).concat([function (error, connection) {
        if (error) {
          callback(error);
          return;
        }

        _this2.connection = connection;
        callback(null, _this2);
      }]));
    } // Close RemoteProvider
    //    callback <Function>
    //      err <Error> | <null>

  }, {
    key: "close",
    value: function close(callback) {
      if (!this.connection) {
        process.nextTick(callback);
        return;
      }

      this.connection.once('close', function () {
        callback();
      });
      this.connection.close();
      this.connection = null;
    } // Get record from GlobalStorage
    //   id <string> globally unique record id
    //   callback <Function>
    //     error <Error> | <null>
    //     record <Object>

  }, {
    key: "get",
    value: function get(id, callback) {
      this.connection.callMethod('provider', 'get', [id], callback);
    } // Set record in GlobalStorage
    //   record <Object> record to be stored
    //   callback <Function>
    //     error <Error> | <null>

  }, {
    key: "set",
    value: function set(record, callback) {
      if (!record.Id) {
        throw new TypeError('Id is not provided');
      }

      this.connection.callMethod('provider', 'set', [record], callback);
    } // Create record in GlobalStorage
    //   category <string> category of record
    //   record <Object> record to be stored
    //   callback <Function>
    //     error <Error> | <null>
    //     id <string>

  }, {
    key: "create",
    value: function create(category, record, callback) {
      this.connection.callMethod('provider', 'create', [category, record], callback);
    } // Update record in GlobalStorage
    //   category <string> category of record
    //   query <Object> record, example: { Id }
    //   patch <Object> record, fields to update
    //   callback <Function>
    //     error <Error> | <null>
    //     count <number>

  }, {
    key: "update",
    value: function update(category, query, patch, callback) {
      this.connection.callMethod('provider', 'update', [category, query, patch], callback);
    } // Delete record in GlobalStorage
    //   category <string> category of record
    //   query <Object> record, example: { Id }
    //   callback <Function>
    //     error <Error> | <null>
    //     count <number>

  }, {
    key: "delete",
    value: function _delete(category, query, callback) {
      this.connection.callMethod('provider', 'delete', [category, query], callback);
    } // Select record from GlobalStorage
    //   category <string> category of record
    //   query <Object> fields conditions
    // Returns: <gs.Cursor> cursor

  }, {
    key: "select",
    value: function select(category, query) {
      return new RemoteCursor(this.connection, {
        category: category
      }).select(query);
    } // Execute Action
    //   category - <string>, name of a category that the action is defined upon
    //   name - <string>, name of an Action to execute
    //   args - <Object>, object that contains arguments of an action
    //   callback - <Function>
    //     error - <Error>
    //     message - <string>

  }, {
    key: "execute",
    value: function execute(connection, category, name, args, callback) {
      this.connection.callMethod('provider', 'execute', [category, name, args], callback);
    }
  }]);

  return RemoteProvider;
}(StorageProvider);

module.exports = {
  RemoteProvider: RemoteProvider
};
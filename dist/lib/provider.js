'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('@metarhia/common'),
    iter = _require.iter;

var _require2 = require('./errors'),
    GSError = _require2.GSError,
    errorCodes = _require2.codes; // Abstract Storage Provider


var StorageProvider =
/*#__PURE__*/
function () {
  // Create StorageProvider
  //   gs - globalstorage instance
  function StorageProvider(gs) {
    _classCallCheck(this, StorageProvider);

    this.gs = gs;
  } // Open StorageProvider
  //   callback - function(err, StorageProvider)
  // eslint-disable-next-line no-unused-vars


  _createClass(StorageProvider, [{
    key: "open",
    value: function open(options, callback) {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    } // Close StorageProvider
    //   callback - function(err)
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "close",
    value: function close(callback) {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    } // Generate globally unique id
    //   callback - function(err, id)
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "takeId",
    value: function takeId(callback) {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    } // Get object from GlobalStorage
    //   id - globally unique object id
    //   callback - function(err, obj)
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "get",
    value: function get(id, callback) {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    } // Set object in GlobalStorage
    //   obj - object to be stored
    //   callback - function(err)
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "set",
    value: function set(obj, callback) {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    } // Create object in GlobalStorage
    //   category - string, category to store the object in
    //   obj - object to be stored
    //   callback - function(err, id)
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "create",
    value: function create(category, obj, callback) {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    } // Update object in GlobalStorage
    //   category - string, category to update the records in
    //   query - object, example: { Id }
    //   patch - object, fields to update
    //   callback - function(err, count)
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "update",
    value: function update(category, query, patch, callback) {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    } // Delete object in GlobalStorage
    //   category - string, category to delete the records from
    //   query - object, example: { Id }
    //   callback - function(err, count)
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "delete",
    value: function _delete(category, query, callback) {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    } // Select objects from GlobalStorage
    //   category - string, category to select the records from
    //   query - fields conditions
    // Returns: Cursor
    // eslint-disable-next-line no-unused-vars

  }, {
    key: "select",
    value: function select(category, query) {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    } // Links and caches Permission related categories
    //   data - <Object>, data to be cached
    //     Action - <Action[]>
    //     Category - <Category[]>
    //     Catalog - <Catalog[]>
    //     Permission - <Permission[]>
    //     PermissionActions - <PermissionActions[]>
    //     Role - <Role[]>
    //     Subdivision - <Subdivision[]>
    //     SystemUser - <SystemUser[]>
    //     SystemUserRoles - <SystemUserRoles[]>

  }, {
    key: "cachePermissions",
    value: function cachePermissions(data) {
      var Action = iter(data.Action).map(function (a) {
        return [a.Name, a];
      }).collectTo(Map);
      var Category = iter(data.Category).map(function (c) {
        return [c.Name, c];
      }).collectTo(Map);
      var Permission = new Map();
      var Role = new Map();
      var SystemUser = new Map();

      var processHierarchical = function processHierarchical(nodes) {
        var map = iter(nodes).map(function (node) {
          node.Parent = null;
          node.children = [];
          return [node.Name, node];
        }).collectTo(Map);
        nodes.forEach(function (node) {
          if (node.Parent) {
            var parent = map.get(node.Parent);
            node.Parent = parent;
            parent.children.push(node);
          }
        });
        return map;
      };

      var Catalog = processHierarchical(data.Catalog);
      var Subdivision = processHierarchical(data.Subdivision);
      data.Role.forEach(function (role) {
        role.Permissions = [];
        Role.set(role.Id, role);
      });
      data.Permission.forEach(function (permission) {
        permission.Actions = [];
        Role.get(permission.Role).Permissions.push(permission);
        Permission.set(permission.Id, permission);
      });
      data.PermissionActions.forEach(function (permissionAction) {
        return Permission.get(permissionAction.Permission).Actions.push(permissionAction.Action);
      });
      data.SystemUser.forEach(function (user) {
        user.Roles = [];
        SystemUser.set(user.Id, user);
      });
      data.SystemUserRoles.forEach(function (userRole) {
        return SystemUser.get(userRole.SystemUser).Roles.push(Role.get(userRole.Role));
      });
      this.gs.permissionCache = {
        Action: Action,
        Category: Category,
        Catalog: Catalog,
        Permission: Permission,
        Role: Role,
        Subdivision: Subdivision,
        SystemUser: SystemUser
      };
    } // Check that given user has access to execute the Action
    //   categoryId - <string>, id of a category that the Action is defined upon
    //   actionId - <string>, id of an Action to execute,
    //       this argument contradicts accessFlag
    //   accessFlag - <string>, this argument contradicts actionID
    //   userId - <string>, id of user that executes an Action
    //   args - <Object>, object that contains arguments of an action
    //     Identifier - <string>
    //     Catalog - <string>
    //     Subdivision - <string>

  }, {
    key: "checkPermission",
    value: function checkPermission(categoryId, actionId, accessFlag, userId, args) {
      var _this = this;

      if (accessFlag && actionId) {
        throw new TypeError('\'actionId\' and \'accessFlag\' arguments are contradictory');
      }

      var user = this.gs.permissionCache.SystemUser.get(userId);
      var Identifier = args.Identifier,
          Catalog = args.Catalog,
          Subdivision = args.Subdivision;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = user.Roles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var Permissions = _step.value.Permissions;
          // eslint-disable-next-line no-loop-func
          var permission = Permissions.find(function (permission) {
            if (actionId && !permission.Actions.find(function (action) {
              return action === actionId;
            })) {
              return false;
            }

            if (accessFlag && permission.Access.get(accessFlag)) {
              return false;
            }

            if (permission.Category !== categoryId) {
              return false;
            }

            if (permission.Target === Identifier) {
              return true;
            }

            var catalog = _this.gs.permissionCache.Catalog.get(permission.Catalog);

            var subdivision = _this.gs.permissionCache.Subdivision.get(permission.Subdivision);

            if (Catalog && catalog && catalog.includes(Catalog) || Subdivision && subdivision && subdivision.includes(Subdivision)) {
              return false;
            }

            return true;
          });

          if (permission) {
            return true;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return false;
    } // Execute Action
    //   category - <string>, name of a category that the action is defined upon
    //   name - <string>, name of an Action to execute
    //   session - <jstp.Session>
    //   args - <Object>, object that contains arguments of an action
    //     Identifier - <string>
    //     Catalog - <string>
    //     Subdivision - <string>
    //   callback - <Function>
    //     error - <Error>
    //     message - <string>

  }, {
    key: "execute",
    value: function execute(category, name, session, args, callback) {
      var _this2 = this;

      var categoryDefinition = this.gs.schema.actions.get(category);

      if (!categoryDefinition) {
        callback(new GSError(errorCodes.INVALID_SCHEMA, "Undefined category '".concat(category, "'")));
        return;
      }

      var action = categoryDefinition.get(name);

      if (!action) {
        callback(new GSError(errorCodes.INVALID_SCHEMA, "Undefined action '".concat(name, "'")));
        return;
      }

      var actionId = this.gs.permissionCache.Action.get(name).Id;
      var categoryId = this.gs.permissionCache.Category.get(category).Id;

      if (!action) {
        callback(new GSError(errorCodes.NO_SUCH_ACTION, "There is no such action as '".concat(name, "' in '").concat(category, "' category")));
        return;
      }

      var form = "".concat(category, ".").concat(name);

      var execute = function execute() {
        var validationError = _this2.gs.schema.validateForm(form, args);

        if (validationError) {
          callback(new GSError(errorCodes.INVALID_SIGNATURE, "Form '".concat(form, "' validation error: ").concat(validationError.toString())));
          return;
        }

        var fn = action.definition;
        fn(session, args, callback);
      };

      if (category === 'SystemUser' && (name === 'SignIn' || name === 'SignUp' || name === 'SignOut')) {
        execute();
        return;
      }

      var userId = session.get('Id');
      this.checkPermission(categoryId, actionId, null, userId, args, function (error, permitted) {
        if (error) {
          callback(error);
          return;
        }

        if (!permitted) {
          callback(new GSError(errorCodes.NOT_AUTHORIZED, "User '".concat(userId.toString(), "' is not authorized to execute '").concat(form, "'")));
          return;
        }

        execute();
      });
    }
  }]);

  return StorageProvider;
}();

module.exports = {
  StorageProvider: StorageProvider
};
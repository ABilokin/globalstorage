'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var transformations = require('./lib/transformations');

var operations = require('./lib/operations');

var submodules = ['provider', 'cursor', 'memory.provider', 'memory.cursor', 'remote.provider', 'remote.cursor', 'fs.provider', 'fs.cursor', 'pg.provider', 'pg.cursor'];
var gs = null;
var lib = {};
submodules.forEach(function (name) {
  return Object.assign(lib, require('./lib/' + name));
});

var GlobalStorage =
/*#__PURE__*/
function (_lib$StorageProvider) {
  _inherits(GlobalStorage, _lib$StorageProvider);

  function GlobalStorage() {
    var _this;

    _classCallCheck(this, GlobalStorage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GlobalStorage).call(this));
    _this.memory = new lib.MemoryProvider();
    _this.local = null;
    _this.remotes = {};
    _this.active = false;
    _this.offline = true;
    _this.nextId = 0;
    _this.categories = {};
    return _this;
  }

  _createClass(GlobalStorage, [{
    key: "open",
    value: function open( // Open database
    options, // options
    callback // callback
    ) {
      this.memory.open({
        gs: options.gs
      });
      var providerName = options.provider || 'memory';
      var Provider = gs.providers[providerName];
      this.local = new Provider();
      this.active = true;
      this.local.open(options, callback);
    }
  }, {
    key: "connect",
    value: function connect( // Connect to Global Storage server
    options, // connection parammeters
    // Example: { url: 'gs://user:password@host:port/database' }
    callback // on connect function(err, connection)
    ) {
      var connection = new gs.RemoteProvider(options);
      callback(null, connection);
    }
  }, {
    key: "get",
    value: function get( // Get object by id
    id, // object id
    callback // function(err, object)
    ) {
      var _this2 = this;

      var get = function get(id, callback) {
        _this2.local.get(id, function (err, data) {
          if (!err) {
            callback(null, data);
            return;
          }
        });
      };

      this.memoryStorageProvider.get(id, function (err, data) {
        if (err) {
          callback(err);
          return;
        }

        if (data) callback(null, data);else get(id, callback);
      });
    }
  }, {
    key: "create",
    value: function create( // Create new object
    obj, // object
    callback // function(err, id)
    ) {
      this.local.create(obj, callback);
    }
  }, {
    key: "update",
    value: function update( // Update Object
    obj, // object
    callback // function(err)
    ) {
      this.local.update(obj, callback);
    }
  }, {
    key: "delete",
    value: function _delete( // Delete object
    id, // object id
    callback // function(err)
    ) {
      this.local.delete(id, callback);
    }
  }, {
    key: "select",
    value: function select( // Select dataset
    query, // object
    options, // object
    callback // function(err, cursor)
    ) {
      return this.local.select(query, options, callback);
    }
  }, {
    key: "findServer",
    value: function findServer( // Get server for id
    id // object id
    ) {
      return id;
    }
  }, {
    key: "generateId",
    value: function generateId() // Get server for id
    // This function not used now
    {
      return this.nextId++;
    }
  }]);

  return GlobalStorage;
}(lib.StorageProvider);

gs = Object.assign(new GlobalStorage(), lib);
gs.providers = {
  fs: gs.FsProvider,
  memory: gs.MemoryProvider,
  pg: gs.PostgresProvider
};
gs.cursors = {
  fs: gs.FsCursor,
  memory: gs.MemoryCursor,
  pg: gs.PostgresCursor
};
gs.transformations = transformations;
gs.operations = operations;
module.exports = gs;
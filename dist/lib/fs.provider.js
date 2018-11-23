'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var fs = require('fs');

var mkdirp = require('mkdirp');

var common = require('@metarhia/common');

var metasync = require('metasync');

var mdsf = require('mdsf');

var _require = require('./provider'),
    StorageProvider = _require.StorageProvider;

var _require2 = require('./fs.cursor'),
    FsCursor = _require2.FsCursor;

var THROTTLE_TIMEOUT = 5000;

var FsProvider =
/*#__PURE__*/
function (_StorageProvider) {
  _inherits(FsProvider, _StorageProvider);

  function FsProvider(options // { path } where path is database location
  ) {
    var _this;

    _classCallCheck(this, FsProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FsProvider).call(this));
    _this.stat = null;
    _this.options = options;
    return _this;
  }

  _createClass(FsProvider, [{
    key: "readStat",
    value: function readStat(callback) {
      fs.readFile(this.path + '/.gs', function (err, stat) {
        if (err) {
          callback(err);
          return;
        }

        var data = mdsf.parse(stat.toString());
        data.count = data.count || 0;
        data.size = data.size || 0;
        data.next = data.next || 1;
        callback(null, data);
      });
    }
  }, {
    key: "open",
    value: function open(options, callback) {
      var _this2 = this;

      callback = common.once(callback);
      this.path = options.path;

      _get(_getPrototypeOf(FsProvider.prototype), "open", this).call(this, options, function () {
        _this2.readStat(function (err, stat) {
          if (err) {
            callback(new Error('Can not open database: ' + _this2.path));
          } else {
            _this2.stat = stat;
            callback();
          }
        });
      });
    }
  }, {
    key: "writeStat",
    value: function writeStat(callback) {
      var _this3 = this;

      callback = common.once(callback);

      var save = function save() {
        var data = mdsf.stringify(_this3.stat);
        fs.writeFile(_this3.path + '/.gs', data, callback);
      };

      this.save = this.save || metasync.throttle(THROTTLE_TIMEOUT, save);
      this.save();
    }
  }, {
    key: "close",
    value: function close(callback) {
      callback = common.once(callback);
      this.writeStat();
      callback();
    }
  }, {
    key: "takeId",
    value: function takeId(callback) {
      callback = common.once(callback);
      callback(null, this.stat.next++);
      this.stat.count++;
      this.writeStat();
    }
  }, {
    key: "get",
    value: function get(id, callback) {
      callback = common.once(callback);
      var path = common.idToPath(id);
      fs.readFile(path, function (err, data) {
        if (err) callback(err);else callback(null, mdsf.parse(data.toString()));
      });
    }
  }, {
    key: "create",
    value: function create(obj, callback) {
      var _this4 = this;

      callback = common.once(callback);
      this.takeId(function (err, id) {
        if (err) {
          callback(err);
          return;
        }

        obj.Id = id;
        var data = mdsf.stringify(obj);
        _this4.stat.size += data.length;

        _this4.writeStat();

        var place = common.idToChunks(obj.Id);
        place.path = _this4.path + place.path;
        mkdirp(place.path, function (err) {
          if (err) {
            callback(err);
            return;
          }

          var pp = place.path + '/' + place.name;
          fs.writeFile(pp, data, function (err) {
            if (err) callback(err);else callback(null, id);
          });
        });
      });
    }
  }, {
    key: "update",
    value: function update(obj, callback) {
      var _this5 = this;

      callback = common.once(callback);
      var path = common.idToPath(obj.Id);
      fs.stat(path, function (err, stat) {
        if (err) {
          callback(err);
          return;
        }

        var data = mdsf.stringify(obj);
        _this5.stat.size += data.length - stat.size;

        _this5.writeStat();

        fs.writeFile(path, data, function (err) {
          if (err) callback(err);else callback();
        });
      });
    }
  }, {
    key: "delete",
    value: function _delete(id, callback) {
      var _this6 = this;

      callback = common.once(callback);
      var path = common.idToPath(id);
      fs.stat(path, function (err, stat) {
        if (err) {
          callback(err);
          return;
        }

        fs.unlink(path, function (err) {
          if (err) {
            callback(err);
            return;
          }

          _this6.stat.count--;
          _this6.stat.size -= stat.size;

          _this6.writeStat();

          callback();
        });
      });
    }
  }, {
    key: "select",
    value: function select(query, options, callback) {
      if (callback) callback();
      return new FsCursor({
        provider: this,
        jsql: [{
          op: 'select',
          query: query,
          options: options
        }]
      });
    }
  }]);

  return FsProvider;
}(StorageProvider);

module.exports = {
  FsProvider: FsProvider
};
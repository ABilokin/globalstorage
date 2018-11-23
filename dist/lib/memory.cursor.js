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

var common = require('@metarhia/common');

var operations = require('./operations');

var _require = require('./cursor'),
    Cursor = _require.Cursor;

var MemoryCursor =
/*#__PURE__*/
function (_Cursor) {
  _inherits(MemoryCursor, _Cursor);

  function MemoryCursor(dataset, options) {
    var _this;

    _classCallCheck(this, MemoryCursor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MemoryCursor).call(this, options));
    _this.dataset = dataset;
    _this.indices = {};
    return _this;
  }

  _createClass(MemoryCursor, [{
    key: "copy",
    value: function copy() {
      var dataset = common.copy(this.dataset);
      return new MemoryCursor(dataset);
    }
  }, {
    key: "clone",
    value: function clone() {
      var dataset = common.clone(this.dataset);
      return new MemoryCursor(dataset);
    }
  }, {
    key: "empty",
    value: function empty() {
      this.dataset.length = 0;
      this.jsql.length = 0;
      return this;
    }
  }, {
    key: "from",
    value: function from(arr) {
      this.dataset = common.copy(arr);
      return this;
    }
  }, {
    key: "fetch",
    value: function fetch(callback) {
      var _this2 = this;

      var process = function process(dataset) {
        _this2.jsql.forEach(function (operation) {
          var fn = operations[operation.op];
          dataset = fn(operation, dataset);
        });

        _this2.jsql.length = 0;
        callback(null, dataset, _this2);
      };

      if (this.parents.length) {
        var parent = this.parents[0];
        parent.fetch(function (err, dataset) {
          if (err) {
            callback(err);
            return;
          }

          process(dataset);
        });
      } else {
        var dataset = common.duplicate(this.dataset);
        process(dataset);
      }

      return this;
    }
  }]);

  return MemoryCursor;
}(Cursor);

Cursor.MemoryCursor = MemoryCursor;
module.exports = {
  MemoryCursor: MemoryCursor
};
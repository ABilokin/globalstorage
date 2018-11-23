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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var transformations = require('./transformations');

var _require = require('./sqlgen'),
    SelectBuilder = _require.SelectBuilder;

var _require2 = require('./cursor'),
    Cursor = _require2.Cursor;

var jsqlToSQLConverters = {
  select: function select(op, query) {
    var constraints = transformations.constraints(op.query);
    Object.keys(constraints).forEach(function (key) {
      var _constraints$key = _slicedToArray(constraints[key], 2),
          cond = _constraints$key[0],
          value = _constraints$key[1];

      if (cond === '!') return query.where(key, '!=', value);
      return query.where(key, cond, value);
    });
  },
  distinct: function distinct(op, query) {
    return query.distinct();
  },
  limit: function limit(op, query) {
    return query.limit(op.count);
  },
  offset: function offset(op, query) {
    return query.offset(op.offset);
  },
  count: function count(op, query) {
    return query.count();
  },
  sum: function sum(op, query) {
    return query.sum(op.field);
  },
  avg: function avg(op, query) {
    return query.avg(op.field);
  },
  max: function max(op, query) {
    return query.max(op.field);
  },
  min: function min(op, query) {
    return query.min(op.field);
  },
  order: function order(op, query) {
    return op.fields.forEach(function (f) {
      return query.orderBy(f, 'ASC');
    });
  },
  desc: function desc(op, query) {
    return op.fields.forEach(function (f) {
      return query.orderBy(f, 'DESC');
    });
  }
};

var PostgresCursor =
/*#__PURE__*/
function (_Cursor) {
  _inherits(PostgresCursor, _Cursor);

  function PostgresCursor(pgConnection, options) {
    var _this;

    _classCallCheck(this, PostgresCursor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PostgresCursor).call(this, options));
    _this.pg = pgConnection;
    return _this;
  }

  _createClass(PostgresCursor, [{
    key: "fetch",
    value: function fetch(callback) {
      var _this$pg,
          _this2 = this;

      if (!this.category) {
        throw new TypeError('Category name was not specified');
      }

      var pgquery = new SelectBuilder().from(this.category);
      var i = 0;

      for (; i < this.jsql.length; ++i) {
        var op = this.jsql[i];
        var conv = jsqlToSQLConverters[op.op];

        if (!conv) {
          --i;
          break;
        }

        conv(op, pgquery, i, this);
      }

      (_this$pg = this.pg).query.apply(_this$pg, _toConsumableArray(pgquery.build()).concat([function (err, res) {
        if (err) {
          callback(err);
          return;
        }

        _this2.jsql = _this2.jsql.slice(i);
        if (_this2.jsql.length === 0) callback(null, res.rows, _this2);else _this2.continue(res.rows, callback);
      }]));
    }
  }]);

  return PostgresCursor;
}(Cursor);

module.exports = {
  PostgresCursor: PostgresCursor
};
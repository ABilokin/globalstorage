'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = require('@metarhia/common'),
    iter = _require.iter;

var _require2 = require('./pg.utils'),
    escapeIdentifier = _require2.escapeIdentifier,
    generateQueryParams = _require2.generateQueryParams;

var allowedConditions = ['=', '!=', '<', '<=', '>', '>=', 'LIKE'];
var supportedOps = {
  'select': Set,
  'selectDistinct': null,
  'count': Array,
  'avg': Array,
  'min': Array,
  'max': Array,
  'sum': Array,
  'where': Array,
  'groupBy': Set,
  'orderBy': Set,
  'from': null,
  'limit': null,
  'offset': null
};
var functionHandlers = {
  'count': function count(op) {
    return "count(".concat(op.field, ")");
  },
  'avg': function avg(op) {
    return "avg(".concat(op.field, ")");
  },
  'min': function min(op) {
    return "min(".concat(op.field, ")");
  },
  'max': function max(op) {
    return "max(".concat(op.field, ")");
  },
  'sum': function sum(op) {
    return "sum(".concat(op.field, ")");
  }
};

var checkType = function checkType(value, name, type) {
  if (_typeof(value) !== type) {
    throw new TypeError("Invalid '".concat(name, "' value (").concat(value, ") type, expected '").concat(type, "'"));
  }
};

var makeParamValue = function makeParamValue(cond, value, params) {
  if (cond === 'IN' || cond === 'NOT IN') {
    var startIndex = params.length || 1;
    params.push.apply(params, _toConsumableArray(value));
    return '(' + generateQueryParams(value.length, startIndex) + ')';
  } else {
    params.push(value);
    return "$".concat(params.length);
  }
};

var SelectBuilder =
/*#__PURE__*/
function () {
  function SelectBuilder() {
    _classCallCheck(this, SelectBuilder);

    this.operations = new Map();

    var _arr = Object.keys(supportedOps);

    for (var _i = 0; _i < _arr.length; _i++) {
      var op = _arr[_i];
      var _constructor = supportedOps[op];
      this.operations.set(op, _constructor ? new _constructor() : null);
    }
  }

  _createClass(SelectBuilder, [{
    key: "from",
    value: function from(tableName) {
      this.operations.set('from', escapeIdentifier(tableName));
      return this;
    }
  }, {
    key: "select",
    value: function select() {
      var select = this.operations.get('select');

      for (var _len = arguments.length, fields = new Array(_len), _key = 0; _key < _len; _key++) {
        fields[_key] = arguments[_key];
      }

      iter(fields).map(escapeIdentifier).forEach(function (f) {
        return select.add(f);
      });
      return this;
    }
  }, {
    key: "distinct",
    value: function distinct() {
      this.operations.set('selectDistinct', true);
      return this;
    }
  }, {
    key: "where",
    value: function where(key, cond, value) {
      cond = cond.toUpperCase();

      if (!allowedConditions.includes(cond)) {
        throw new Error("The operator \"".concat(cond, "\" is not permitted"));
      }

      this.operations.get('where').push({
        key: escapeIdentifier(key),
        value: value,
        cond: cond
      });
      return this;
    }
  }, {
    key: "whereNot",
    value: function whereNot(key, cond, value) {
      cond = cond.toUpperCase();

      if (!allowedConditions.includes(cond)) {
        throw new Error("The operator \"".concat(cond, "\" is not permitted"));
      }

      this.operations.get('where').push({
        key: escapeIdentifier(key),
        value: value,
        cond: cond,
        mod: 'NOT'
      });
      return this;
    }
  }, {
    key: "whereNull",
    value: function whereNull(key) {
      this.operations.get('where').push({
        key: escapeIdentifier(key),
        cond: 'IS',
        value: 'null'
      });
      return this;
    }
  }, {
    key: "whereNotNull",
    value: function whereNotNull(key) {
      this.operations.get('where').push({
        key: escapeIdentifier(key),
        cond: 'IS',
        value: 'null',
        mod: 'NOT'
      });
      return this;
    }
  }, {
    key: "whereIn",
    value: function whereIn(key, conds) {
      this.operations.get('where').push({
        key: escapeIdentifier(key),
        cond: 'IN',
        value: conds
      });
      return this;
    }
  }, {
    key: "whereNotIn",
    value: function whereNotIn(key, conds) {
      this.operations.get('where').push({
        key: escapeIdentifier(key),
        cond: 'NOT IN',
        value: conds
      });
      return this;
    }
  }, {
    key: "orderBy",
    value: function orderBy(field) {
      var dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ASC';
      dir = dir.toUpperCase();
      this.operations.get('orderBy').add({
        field: escapeIdentifier(field),
        dir: dir
      });
      return this;
    }
  }, {
    key: "groupBy",
    value: function groupBy() {
      var groupBy = this.operations.get('groupBy');

      for (var _len2 = arguments.length, fields = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        fields[_key2] = arguments[_key2];
      }

      iter(fields).map(escapeIdentifier).forEach(function (f) {
        return groupBy.add(f);
      });
      return this;
    }
  }, {
    key: "limit",
    value: function limit(_limit) {
      checkType(_limit, 'limit', 'number');
      this.operations.set('limit', _limit);
      return this;
    }
  }, {
    key: "offset",
    value: function offset(_offset) {
      checkType(_offset, 'offset', 'number');
      this.operations.set('offset', _offset);
      return this;
    }
  }, {
    key: "count",
    value: function count() {
      var field = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';
      if (field !== '*') field = escapeIdentifier(field);
      this.operations.get('count').push({
        field: field
      });
      return this;
    }
  }, {
    key: "avg",
    value: function avg(field) {
      this.operations.get('avg').push({
        field: escapeIdentifier(field)
      });
      return this;
    }
  }, {
    key: "min",
    value: function min(field) {
      this.operations.get('min').push({
        field: escapeIdentifier(field)
      });
      return this;
    }
  }, {
    key: "max",
    value: function max(field) {
      this.operations.get('max').push({
        field: escapeIdentifier(field)
      });
      return this;
    }
  }, {
    key: "sum",
    value: function sum(field) {
      this.operations.get('sum').push({
        field: escapeIdentifier(field)
      });
      return this;
    }
  }, {
    key: "processSelect",
    value: function processSelect(query, clauses) {
      if (clauses.size > 0) {
        return query + ' ' + iter(clauses).reduce(function (acc, id) {
          return acc + ', ' + id;
        });
      }

      return query + ' *';
    }
  }, {
    key: "processOperations",
    value: function processOperations(query, operations, functionHandlers) {
      var _arr2 = Object.keys(functionHandlers);

      var _loop = function _loop() {
        var fn = _arr2[_i2];
        var ops = operations.get(fn);
        if (ops.length === 0) return "continue";else if (query.endsWith(' *')) query = query.slice(0, -2);else query += ',';
        var handler = functionHandlers[fn]; // eslint-disable-next-line no-loop-func

        query += ops.reduce(function (acc, op) {
          return acc + handler(op, query) + ',';
        }, ' ').slice(0, -1);
      };

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var _ret = _loop();

        if (_ret === "continue") continue;
      }

      return query;
    }
  }, {
    key: "processWhere",
    value: function processWhere(query, clauses, params) {
      // TODO(lundibundi): support braces
      query += ' WHERE';

      for (var i = 0; i < clauses.length; ++i) {
        var clause = clauses[i];

        if (i !== 0) {
          if (clause.or) query += ' OR';else query += ' AND';
        }

        if (clause.mod) query += " ".concat(clause.mod);
        query += " ".concat(clause.key, " ").concat(clause.cond, " ") + makeParamValue(clause.cond, clause.value, params);
      }

      return query;
    }
  }, {
    key: "processOrder",
    value: function processOrder(query, clauses) {
      var it = iter(clauses);
      var firstClause = it.next().value;
      query += " ORDER BY ".concat(firstClause.field, " ").concat(firstClause.dir);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = it[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var order = _step.value;
          query += ", ".concat(order.field, " ").concat(order.dir);
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

      return query;
    }
  }, {
    key: "build",
    value: function build() {
      var params = [];
      var query = 'SELECT';
      if (this.operations.get('selectDistinct')) query += ' DISTINCT';
      query = this.processSelect(query, this.operations.get('select'));
      query = this.processOperations(query, this.operations, functionHandlers);
      var tableName = this.operations.get('from');

      if (!tableName) {
        throw new Error('Cannot generate SQL, tableName is not defined');
      }

      query += " FROM ".concat(tableName);
      var whereClauses = this.operations.get('where');

      if (whereClauses.length > 0) {
        query = this.processWhere(query, whereClauses, params);
      }

      var groupClauses = this.operations.get('groupBy');

      if (groupClauses.size > 0) {
        query += ' GROUP BY ' + iter(groupClauses).reduce(function (acc, field) {
          return acc + ', ' + field;
        });
      }

      var orderClauses = this.operations.get('orderBy');

      if (orderClauses.size > 0) {
        query = this.processOrder(query, orderClauses);
      }

      var limit = this.operations.get('limit');

      if (limit) {
        query += " LIMIT ".concat(makeParamValue(null, limit, params));
      }

      var offset = this.operations.get('offset');

      if (offset) {
        query += " OFFSET ".concat(makeParamValue(null, offset, params));
      }

      return [query, params];
    }
  }]);

  return SelectBuilder;
}();

module.exports = {
  SelectBuilder: SelectBuilder
};
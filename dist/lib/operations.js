'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var transformations = require('./transformations');

var select = function select(operation, dataset) {
  var query = operation.query;
  var constraints = transformations.constraints(query);
  var fields = Object.keys(query);
  var compare = transformations.compare;
  return dataset.filter(function (record) {
    var len = fields.length;

    for (var i = 0; i < len; i++) {
      var field = fields[i];
      var value = record[field];

      var _constraints$field = _slicedToArray(constraints[field], 2),
          op = _constraints$field[0],
          data = _constraints$field[1];

      var keep = compare(value, op, data);
      if (!keep) return false;
    }

    return true;
  });
};

var distinct = function distinct(operation, dataset) {
  var keys = new Set();
  var fields = operation.fields;
  if (typeof operation === 'string') fields = [fields];
  return dataset.filter(function (record) {
    var cols = fields || Object.keys(record).sort();
    var key = cols.map(function (field) {
      return record[field];
    }).join('\x00');
    var has = keys.has(key);
    keys.add(key);
    return !has;
  });
};

var order = function order(operation, dataset) {
  var fields = operation.fields;
  if (typeof operation === 'string') fields = [fields];
  dataset.sort(function (r1, r2) {
    var a1 = fields.map(function (field) {
      return r1[field];
    }).join('\x00');
    var a2 = fields.map(function (field) {
      return r2[field];
    }).join('\x00');
    if (a1 < a2) return -1;
    if (a1 > a2) return 1;
    return 0;
  });
  return dataset;
};

var desc = function desc(operation, dataset) {
  var fields = operation.fields;
  if (typeof operation === 'string') fields = [fields];
  dataset.sort(function (r1, r2) {
    var a1 = fields.map(function (field) {
      return r1[field];
    }).join('\x00');
    var a2 = fields.map(function (field) {
      return r2[field];
    }).join('\x00');
    if (a1 < a2) return 1;
    if (a1 > a2) return -1;
    return 0;
  });
  return dataset;
};

var limit = function limit(operation, dataset) {
  return dataset.slice(0, operation.count);
};

var offset = function offset(operation, dataset) {
  return dataset.slice(operation.offset);
};

var count = function count(operation, dataset) {
  var length = 0;

  if (!operation.field) {
    length = dataset.length;
  } else {
    dataset.forEach(function (item) {
      if (item.hasOwnProperty(operation.field)) length++;
    });
  }

  return [length];
};

var projection = function projection(operation, dataset) {
  return transformations.projection(operation.fields, dataset);
};

var row = function row(operation, dataset) {
  return transformations.row(dataset);
};

var col = function col(operation, dataset) {
  return transformations.col(dataset, operation.field);
};

var one = function one(operation, dataset) {
  return dataset[0];
};

var union = function union(operation, dataset) {
  return transformations.union(dataset, operation.cursor.dataset);
};

var intersection = function intersection(operation, dataset) {
  return transformations.intersection(dataset, operation.cursor.dataset);
};

var difference = function difference(operation, dataset) {
  return transformations.difference(dataset, operation.cursor.dataset);
};

var complement = function complement(operation, dataset) {
  return transformations.complement(dataset, operation.cursor.dataset);
};

module.exports = {
  select: select,
  distinct: distinct,
  order: order,
  desc: desc,
  limit: limit,
  offset: offset,
  count: count,
  projection: projection,
  row: row,
  col: col,
  one: one,
  union: union,
  intersection: intersection,
  difference: difference,
  complement: complement
};
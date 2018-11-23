'use strict'; // Get dataset row
//   ds - array of records, example: [ { Id: 1, Name: 'Marcus' } ]
// Result: result array of records, example: [1, 'Marcus']

var row = function row(ds) {
  var result = [];

  if (Array.isArray(ds) && ds.length > 0) {
    var obj = ds[0];

    for (var key in obj) {
      result.push(obj[key]);
    }
  }

  return result;
};

var col = function col( // Get dataset column
ds, // array of records, example: [ { Id: 1 }, { Id: 2 }, { Id: 3 } ]
field // optional, field name
// Result: result array of records, example: [1, 2, 3]
) {
  var result = [];

  if (Array.isArray(ds) && ds.length > 0) {
    field = field || Object.keys(ds[0])[0];
    result = ds.map(function (record) {
      return record[field];
    });
  }

  return result;
}; // Get dataset header
//   ds - array of records, example: [ { Id: 1, Name: 'Marcus' } ]
// Result: result array of records, example: 'Id', 'Name']


var header = function header(ds) {
  if (Array.isArray(ds) && ds.length > 0) {
    var obj = ds[0];
    return Object.keys(obj);
  } else {
    return [];
  }
};

var projection = function projection( // Dataset projection
meta, // projection metadata, example: ['Name'] or { toKey: [fromKey, funcs ]}
ds // array of records, example: [ { Id: 1, Name: 'Marcus' } ]
// Result: result array of records, example: [ { Name: 'Marcus' } ]
) {
  var complex = !Array.isArray(meta);
  var fields = complex ? Object.keys(meta) : meta;
  return ds.map(function (record) {
    var row = {};
    fields.forEach(function (key) {
      if (complex) {
        var data = meta[key];
        var fromKey = data[0];
        var value = record[fromKey];

        if (value !== undefined) {
          row[key] = data.slice(1).reduce(function (acc, fn) {
            return fn(acc);
          }, value);
        }
      } else {
        var _value = record[key];
        if (_value !== undefined) row[key] = record[key];
      }
    });
    return row;
  });
};

var union = function union( // Set union
ds1, // array of records #1, example: [ { Id: 1 }, { Id: 2 } ]
ds2 // array of records #2, example: [ { Id: 2 }, { Id: 3 } ]
// Result: array of records, example: [ { Id: 1 }, { Id: 2 }, { Id: 3 } ]
) {
  var ds = [];
  var ids = [];
  var l1 = ds1.length;
  var l2 = ds2.length;

  for (var i = 0; i < l1; i++) {
    var item = ds1[i];
    ids.push(item.Id);
    ds.push(item);
  }

  for (var _i = 0; _i < l2; _i++) {
    var _item = ds2[_i];

    if (!ids.includes(_item.Id)) {
      ids.push(_item.Id);
      ds.push(_item);
    }
  }

  return ds;
};

var intersection = function intersection( // Set intersection
ds1, // array of records #1, example: [ { Id: 1 }, { Id: 2 } ]
ds2 // array of records #2, example: [ { Id: 2 }, { Id: 3 } ]
// Result: result array of records, example: [ { Id: 2 } ]
) {
  var ds = [];
  var ids = [];
  var l1 = ds1.length;
  var l2 = ds2.length;

  for (var i = 0; i < l1; i++) {
    var item = ds1[i];
    ids.push(item.Id);
  }

  for (var _i2 = 0; _i2 < l2; _i2++) {
    var _item2 = ds2[_i2];

    if (ids.includes(_item2.Id)) {
      ds.push(_item2);
    }
  }

  return ds;
};

var difference = function difference( // Set difference
ds1, // array of records #1, example: [ { Id: 1 }, { Id: 2 } ]
ds2 // array of records #2, example: [ { Id: 2 }, { Id: 3 } ]
// Result: result array of records, example: [ { Id: 1 } ]
) {
  var ds = [];
  var ids = [];
  var l1 = ds1.length;
  var l2 = ds2.length;

  for (var i = 0; i < l2; i++) {
    var item = ds2[i];
    ids.push(item.Id);
  }

  for (var _i3 = 0; _i3 < l1; _i3++) {
    var _item3 = ds1[_i3];

    if (!ids.includes(_item3.Id)) {
      ds.push(_item3);
    }
  }

  return ds;
};

var complement = function complement( // Set complement
ds1, // array of records #1, example: [ { Id: 1 }, { Id: 2 } ]
ds2 // array of records #2, example: [ { Id: 2 }, { Id: 3 } ]
// Result: result array of records, example: [ { Id: 3 } ]
) {
  return difference(ds2, ds1);
};

var compare = function compare(value, op, data) {
  if (op === '=') return value === data;
  if (op === '<') return value < data;
  if (op === '>') return value > data;
  if (op === '<=') return value <= data;
  if (op === '>=') return value >= data;
  return false;
};

var condition = function condition(def) {
  var c0 = def[0];
  var eq = c0 === '=';
  var nt = c0 === '!';
  if (eq || nt) return [c0, def.substr(1).trim()];
  var c1 = def[1];
  var et = c1 === '=';
  var lt = c0 === '<';
  var gt = c0 === '>';

  if (lt || gt) {
    if (et) return [c0 + c1, def.substr(2).trim()];else return [c0, def.substr(1).trim()];
  }

  return ['=', def];
};

var constraints = function constraints(defs) {
  var prepare = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : condition;
  var keys = Object.keys(defs);
  var prepared = {};
  var len = keys.length;

  for (var i = 0; i < len; i++) {
    var key = keys[i];
    var def = defs[key];
    prepared[key] = prepare(def);
  }

  return prepared;
};

module.exports = {
  row: row,
  col: col,
  header: header,
  projection: projection,
  union: union,
  intersection: intersection,
  difference: difference,
  complement: complement,
  compare: compare,
  condition: condition,
  constraints: constraints
};
'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var transformations = require('./transformations');

var escapeString = function escapeString(value) {
  var backslash = false;
  var escaped = '\'';
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var character = _step.value;

      if (character === '\'') {
        escaped += '\'\'';
      } else if (character === '\\') {
        escaped += '\\\\';
        backslash = true;
      } else {
        escaped += character;
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

  escaped += '\'';
  return backslash ? " E".concat(escaped) : escaped;
};

var escapeIdentifier = function escapeIdentifier(name) {
  return "\"".concat(name, "\"");
};

var escapeValue = function escapeValue(value) {
  var type = _typeof(value);

  if (type === 'number') return value;
  if (type === 'string') return escapeString(value);
  if (value instanceof Date) return "'".concat(value.toISOString(), "'");
  throw new TypeError('Unsupported value (${value}) type');
};

var PREDEFINED_DOMAINS = {
  Time: 'time with time zone',
  DateDay: 'date',
  DateTime: 'timestamp with time zone',
  Id: 'bigint',
  JSON: 'jsonb',
  Money: 'money'
};
var IGNORED_DOMAINS = ['List', 'Enum', 'HashMap', 'HashSet']; // https://tools.ietf.org/html/rfc3629#section-3

var utf8bytesLastCodePoints = {
  1: 0x007F,
  2: 0x07FF,
  3: 0xFFFF
};

var utf8codePointSize = function utf8codePointSize(codePoint) {
  for (var byteCount = 1; byteCount <= 3; byteCount++) {
    if (codePoint <= utf8bytesLastCodePoints[byteCount]) {
      return byteCount;
    }
  }

  return 4;
};

var asciiCP = {
  aToZLower: ['a'.codePointAt(0), 'z'.codePointAt(0)],
  aToZUpper: ['A'.codePointAt(0), 'Z'.codePointAt(0)],
  underscore: '_'.codePointAt(0),
  numbers: ['0'.codePointAt(0), '9'.codePointAt(0)],
  dollar: '$'.codePointAt(0)
};
var classMapping = {
  Uint8Array: 'bytea',
  Date: 'timestamp with time zone'
}; // https://github.com/postgres/postgres/blob/5f6b0e6d69f1087847c8456b3f69761c950d52c6/src/backend/utils/adt/misc.c#L723

var isValidIdentifierStart = function isValidIdentifierStart(cp) {
  return cp === asciiCP.underscore || cp >= asciiCP.aToZLower[0] && cp <= asciiCP.aToZLower[1] || cp >= asciiCP.aToZUpper[0] && cp <= asciiCP.aToZUpper[1] || cp >= 0x80;
}; // https://github.com/postgres/postgres/blob/5f6b0e6d69f1087847c8456b3f69761c950d52c6/src/backend/utils/adt/misc.c#L741


var isValidIdentifierCont = function isValidIdentifierCont(cp) {
  return cp >= asciiCP.numbers[0] && cp <= asciiCP.numbers[1] || cp === asciiCP.dollar || isValidIdentifierStart(cp);
};

var singleUnitUtf16 = 1 << 16 - 1; // https://www.postgresql.org/docs/10/static/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS

var isValidIdentifier = function isValidIdentifier(name) {
  var length = 0;

  for (var i = 0; i < name.length; i++) {
    var codePoint = name.codePointAt(i);

    if (i === 0) {
      if (!isValidIdentifierStart(codePoint)) {
        return false;
      }
    } else if (!isValidIdentifierCont(codePoint)) {
      return false;
    }

    length += utf8codePointSize(codePoint);
    if (codePoint > singleUnitUtf16) i++;
  }

  return length < 64;
};

var validateIdentifier = function validateIdentifier(name, type) {
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  if (!isValidIdentifier(name)) {
    throw new Error("Cannot create ".concat(type, " ").concat(prefix).concat(name) + 'because it is not a valid identifier');
  }
};

var generateQueryParams = function generateQueryParams(count) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var params = '';

  for (var i = start; i < start + count; i++) {
    if (i !== start) {
      params += ', ';
    }

    params += "$".concat(i);
  }

  return params;
};

var buildWhere = function buildWhere(query) {
  var constraints = transformations.constraints(query);
  var constraintsKeys = Object.keys(constraints);

  if (constraintsKeys.length === 0) {
    return ['', []];
  }

  var params = new Array(constraintsKeys.length);
  return [' WHERE ' + constraintsKeys.map(function (key, i) {
    var _constraints$key = _slicedToArray(constraints[key], 2),
        cond = _constraints$key[0],
        value = _constraints$key[1];

    params[i] = value;
    return "".concat(escapeIdentifier(key), " ").concat(cond === '!' ? '!=' : cond, " $").concat(i + 1);
  }).join(' AND '), params];
};

module.exports = {
  escapeString: escapeString,
  escapeValue: escapeValue,
  escapeIdentifier: escapeIdentifier,
  PREDEFINED_DOMAINS: PREDEFINED_DOMAINS,
  IGNORED_DOMAINS: IGNORED_DOMAINS,
  isValidIdentifier: isValidIdentifier,
  validateIdentifier: validateIdentifier,
  generateQueryParams: generateQueryParams,
  buildWhere: buildWhere,
  classMapping: classMapping
};
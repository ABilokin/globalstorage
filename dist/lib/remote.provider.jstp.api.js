'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var jstp = require('@metarhia/jstp');

var validate = {
  string: function string(value) {
    return typeof value === 'string';
  },
  object: function object(value) {
    return _typeof(value) === 'object' && !Array.isArray(value);
  },
  objectArray: function objectArray(value) {
    return Array.isArray(value) && value.every(validate.object);
  }
}; // Create JSTP API that can be passed to JSTP application
//   gsProvider <StorageProvider> JSTP calls will be passed to this provider,
//                                it must be already in an `open` state
//   cursorFactory <Function> factory to be used to create new cursors
//     gsProvider <StorageProvider> provider instance to create the cursor from
//     category <string> category name to be passed to the cursor
//     jsql <Object[]> jsql to be passed to the cursor
//   Returns: <Cursor> created cursor
// Returns: <Object> JSTP API

var createRemoteProviderJstpApi = function createRemoteProviderJstpApi(gsProvider, cursorFactory) {
  return {
    provider: {
      get: function get(connection, id, callback) {
        if (!validate.string(id)) {
          callback(jstp.ERR_INVALID_SIGNATURE);
          return;
        }

        gsProvider.get(id, function (err, record) {
          callback(err && err.code, record);
        });
      },
      set: function set(connection, record, callback) {
        if (!validate.object(record)) {
          callback(jstp.ERR_INVALID_SIGNATURE);
          return;
        }

        gsProvider.set(record, function (err) {
          callback(err && err.code);
        });
      },
      create: function create(connection, category, record, callback) {
        if (!validate.string(category) || !validate.object(record)) {
          callback(jstp.ERR_INVALID_SIGNATURE);
          return;
        }

        gsProvider.create(category, record, function (err, id) {
          callback(err && err.code, id && id.toString());
        });
      },
      update: function update(connection, category, query, patch, callback) {
        if (!validate.string(category) || !validate.object(query) || !validate.object(patch)) {
          callback(jstp.ERR_INVALID_SIGNATURE);
          return;
        }

        gsProvider.update(category, query, patch, function (err, count) {
          callback(err && err.code, count);
        });
      },
      delete: function _delete(connection, category, query, callback) {
        if (!validate.string(category) || !validate.object(query)) {
          callback(jstp.ERR_INVALID_SIGNATURE);
          return;
        }

        gsProvider.delete(category, query, function (err, count) {
          callback(err && err.code, count);
        });
      },
      select: function select(connection, category, jsql, callback) {
        if (!validate.string(category) || !validate.objectArray(jsql)) {
          callback(jstp.ERR_INVALID_SIGNATURE);
          return;
        }

        var cursor = cursorFactory(gsProvider, category, jsql);
        cursor.fetch(function (err, records) {
          callback(err && err.code, records);
        });
      },
      execute: function execute(connection, category, name, args, callback) {
        if (!validate.string(category) || !validate.string(name) || !validate.object(args)) {
          callback(jstp.ERR_INVALID_SIGNATURE);
          return;
        }

        gsProvider.execute(category, name, connection.session, args, function (err, message) {
          callback(err && err.code, message);
        });
      }
    }
  };
};

module.exports = {
  createRemoteProviderJstpApi: createRemoteProviderJstpApi
};
'use strict';

const codes = {
  INTERNAL_PROVIDER_ERROR: 999,
  NOT_IMPLEMENTED: 1000,
  NOT_FOUND: 1001,
  INVALID_SCHEMA: 1002,
  INVALID_CATEGORY_TYPE: 1003,
  INVALID_DELETION_OPERATION: 1004,
  INVALID_CREATION_OPERATION: 1005,
  INSUFFICIENT_PERMISSIONS: 1006,
};

const defaultMessages = {
  [codes.NOT_IMPLEMENTED]: 'Not implemented',
};

class GSError extends Error {
  constructor(code, message) {
    super(message || defaultMessages[code]);

    this.name = 'GSError';
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GSError);
    } else {
      this.stack = new Error(message).stack;
    }
  }

  toJSON() {
    return { error: { message: this.message, code: this.code } };
  }
}

module.exports = {
  codes,
  GSError,
};

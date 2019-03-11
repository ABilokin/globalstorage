'use strict';

const { join } = require('path');
const metatests = require('metatests');
const metaschema = require('metaschema');
const {
  errors: { ValidationError },
} = metaschema;

const { StorageProvider } = require('../../../lib/provider');
const { options, config } = require('../../../lib/metaschema-config/config');
const { GSError, codes: errorCodes } = require('../../../lib/errors');

const schemasDir = join(__dirname, '../../fixtures/provider-execute');

const CATEGORY = 'Category';
const ACTION = 'Action';
const PUBLIC_ACTION = 'PublicAction';
const ACTION_ARGS = { a: 2, b: 1 };

metatests.test('provider.execute unit test', async test => {
  let schema;

  try {
    schema = await metaschema.fs.load(schemasDir, options, config);
  } catch (err) {
    test.fail(err);
    test.end();
    return;
  }

  const provider = new StorageProvider({});

  provider.open({ schema }, () => {
    test.endAfterSubtests();

    test.test('Permission denied', test => {
      const expectedError = new Error('Permission denied');

      provider.execute(
        CATEGORY,
        ACTION,
        [null, ACTION_ARGS],
        err => {
          test.isError(err, expectedError);
          test.end();
        },
        (category, action, callback) => callback(expectedError)
      );
    });

    test.test('No such category', test =>
      provider.execute('InvalidCategory', ACTION, [null, ACTION_ARGS], err => {
        test.isError(err, new GSError());
        test.strictSame(err.code, errorCodes.NOT_FOUND);
        test.end();
      })
    );

    test.test('No such category action', test =>
      provider.execute(CATEGORY, 'InvalidAction', [null, ACTION_ARGS], err => {
        test.isError(err, new GSError());
        test.strictSame(err.code, errorCodes.NOT_FOUND);
        test.end();
      })
    );

    test.test('No such public action', test =>
      provider.execute(
        null,
        'InvalidPublicAction',
        [null, ACTION_ARGS],
        err => {
          test.isError(err, new GSError());
          test.strictSame(err.code, errorCodes.NOT_FOUND);
          test.end();
        }
      )
    );

    test.test('Invalid arguments: unresolved property', test => {
      const validationError = new ValidationError(
        'unresolvedProperty',
        'unresolvedProp'
      );
      const expectedErrorMessage = `Invalid arguments provided: ${validationError}`;

      provider.execute(
        CATEGORY,
        ACTION,
        [null, { ...ACTION_ARGS, unresolvedProp: 3 }],
        err => {
          test.isError(
            err,
            new GSError(errorCodes.INVALID_SCHEMA, expectedErrorMessage)
          );
          test.strictSame(err.code, errorCodes.INVALID_SCHEMA);
          test.end();
        }
      );
    });

    test.test('Invalid arguments: missing property', test => {
      const validationError = new ValidationError('missingProperty', 'b');
      const expectedErrorMessage = `Invalid arguments provided: ${validationError}`;

      provider.execute(CATEGORY, ACTION, [null, { a: 1 }], err => {
        test.isError(
          err,
          new GSError(errorCodes.INVALID_SCHEMA, expectedErrorMessage)
        );
        test.strictSame(err.code, errorCodes.INVALID_SCHEMA);
        test.end();
      });
    });

    test.test('Invalid arguments: empty value', test => {
      const validationError = new ValidationError('emptyValue', 'b');
      const expectedErrorMessage = `Invalid arguments provided: ${validationError}`;

      provider.execute(
        CATEGORY,
        ACTION,
        [null, { ...ACTION_ARGS, b: null }],
        err => {
          test.isError(
            err,
            new GSError(errorCodes.INVALID_SCHEMA, expectedErrorMessage)
          );
          test.strictSame(err.code, errorCodes.INVALID_SCHEMA);
          test.end();
        }
      );
    });

    test.test('Invalid arguments: invalid type', test => {
      const validationError = new ValidationError('invalidType', 'b', {
        expected: 'number',
        actual: 'string',
      });
      const expectedErrorMessage = `Invalid arguments provided: ${validationError}`;

      provider.execute(
        CATEGORY,
        ACTION,
        [null, { ...ACTION_ARGS, b: '2' }],
        err => {
          test.isError(
            err,
            new GSError(errorCodes.INVALID_SCHEMA, expectedErrorMessage)
          );
          test.strictSame(err.code, errorCodes.INVALID_SCHEMA);
          test.end();
        }
      );
    });

    test.test('Successful category action', test =>
      provider.execute(CATEGORY, ACTION, [null, ACTION_ARGS], (err, res) => {
        test.error(err);
        test.strictSame(res, 3);
        test.end();
      })
    );

    test.test('Successful public action', test =>
      provider.execute(null, PUBLIC_ACTION, [null, ACTION_ARGS], (err, res) => {
        test.error(err);
        test.strictSame(res, 1);
        test.end();
      })
    );
  });
});

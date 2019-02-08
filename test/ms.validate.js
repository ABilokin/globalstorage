'use strict';

const metaschema = require('metaschema');
const metatests = require('metatests');
const { Uint64 } = require('@metarhia/common');

const { options, config } = require('../lib/metaschema-config/config');

const { ValidationError } = metaschema.errors;

metatests.test('Fully supports schemas/system', async test => {
  let errors;
  let schema;

  try {
    [errors, schema] = await metaschema.fs.load(
      'test/fixtures/validate',
      options,
      config
    );
  } catch (error) {
    console.error(error);
    test.fail(error);
    test.end();
    return;
  }

  test.strictSame(
    errors.length,
    0,
    'System schemas must be compliant with metaschema config'
  );

  test.strictSame(
    schema.validate('category', 'Person', {
      Id: '12',
      FullName: {
        FirstName: 'Name',
        LastName: 'Surname',
      },
      Citizenship: '123',
      Parents: [new Uint64(42), new Uint64(24)],
    }),
    []
  );

  test.strictSame(
    schema.validate('category', 'Person', {
      FullName: '123',
      Citizenship: 12,
      Parents: 12,
      __Unresolved__: 'property',
    }),
    [
      new ValidationError('invalidType', 'FullName', {
        expected: 'object',
        actual: 'string',
      }),
      new ValidationError('invalidClass', 'Citizenship', {
        expected: ['Uint64', 'String'],
        actual: 'Number',
      }),
      new ValidationError('invalidType', 'Parents', {
        expected: 'Array',
        actual: 'number',
      }),
      new ValidationError('unresolvedProperty', '__Unresolved__'),
    ]
  );
  test.end();
});
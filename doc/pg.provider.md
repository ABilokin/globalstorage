### Interface: pg.provider

#### PostgresProvider()



#### PostgresProvider.prototype.constructor()



#### PostgresProvider.prototype.open(options, callback)

- `options`: [`<Object>`] to be passed to pg
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `provider`: [`<this>`]

Open PostgresProvider


#### PostgresProvider.prototype.close(callback)

- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]

Close PostgresProvider


#### PostgresProvider.prototype.takeId(client, callback)

- `client`: [`<pg.Pool>`]` | `[`<pg.Client>`]
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `id`: [`<string>`]

Generate globally unique id


#### PostgresProvider.prototype.getCategoryById()



#### PostgresProvider.prototype.get(id, callback)

- `id`: [`<string>`] globally unique object id
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `obj`: [`<Object>`]

Get object from GlobalStorage


#### PostgresProvider.prototype.getDetails(id, fieldName, callback)

- `id`: [`<string>`] globally unique object id
- `fieldName`: [`<string>`] field with the Many decorator
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `details`: [`<Object[]>`][`<Object>`]

Get details for many-to-many link from GlobalStorage


#### PostgresProvider.prototype.set(obj, callback)

- `obj`: [`<Object>`] to be stored
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]

Set object in GlobalStorage


#### PostgresProvider.prototype.create(category, obj, callback)

- `category`: [`<string>`] category to store the object in
- `obj`: [`<Object>`] to be stored
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `id`: [`<string>`]

Create object in GlobalStorage


#### PostgresProvider.prototype.update(category, query, patch, callback)

- `category`: [`<string>`] category to update the records in
- `query`: [`<Object>`] example: { Id }
- `patch`: [`<Object>`] fields to update
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `count`: [`<number>`]

Update object in GlobalStorage


#### PostgresProvider.prototype.delete(category, query, callback)

- `category`: [`<string>`] category to delete the records from
- `query`: [`<Object>`] example: { Id }
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `count`: [`<number>`]

Delete object in GlobalStorage


#### PostgresProvider.prototype.linkDetails(category, field, fromId, toIds, callback)

- `category`: [`<string>`] category with field having the Many decorator
- `field`: [`<string>`] field with the Many decorator
- `fromId`: [`<Uint64>`] Id of the record in category specified in the first
      argument
- `toIds`: [`<Uint64>`]` | `[`<Uint64[]>`][`<Uint64>`] Id(s) of the record(s) in
      category specified in the Many decorator of the specified field
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]

Link records with Many relation between them


#### PostgresProvider.prototype.unlinkDetails(category, field, fromId, toIds, callback)

- `category`: [`<string>`] category with field having the Many decorator
- `field`: [`<string>`] field with the Many decorator
- `fromId`: [`<Uint64>`] Id of the record in category specified in the first
      argument
- `toIds`: [`<Uint64>`]` | `[`<Uint64[]>`][`<Uint64>`] Id(s) of the record(s) in
      category specified in the Many decorator of the specified field
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]

Unlink records with Many relation between them


#### PostgresProvider.prototype.select(category, query)

- `category`: [`<string>`] category to select the records from
- `query`: [`<Object>`] fields conditions

_Returns:_ [`<Cursor>`]

Select objects from GlobalStorage


[`<pg.Pool>`]: https://github.com/brianc/node-pg-pool
[`<pg.Client>`]: https://github.com/brianc/node-postgres
[`<Uint64>`]: https://github.com/metarhia/common/blob/master/lib/uint64.js
[`<Cursor>`]: https://github.com/metarhia/globalstorage/blob/master/lib/cursor.js
[`<Object>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[`<Function>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[`<Error>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[`<null>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type
[`<number>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[`<string>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[`<this>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this

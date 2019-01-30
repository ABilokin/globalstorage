### Interface: provider

#### StorageProvider()


Abstract Storage Provider


#### StorageProvider.prototype.constructor()


Abstract Storage Provider


#### StorageProvider.prototype.open(options, callback)

- `options`: [`<Object>`]
  - `schema`: [`<Metaschema>`]
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `provider`: [`<StorageProvider>`]

Open StorageProvider


#### StorageProvider.prototype.close(callback)

- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]

Close StorageProvider


#### StorageProvider.prototype.takeId(callback)

- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `id`: [`<string>`]

Generate globally unique id


#### StorageProvider.prototype.get(id, callback)

- `id`: [`<string>`] globally unique object id
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `obj`: [`<Object>`]

Get object from GlobalStorage


#### StorageProvider.prototype.getDetails(id, fieldName, callback)

- `id`: [`<string>`] globally unique object id
- `fieldName`: [`<string>`] field with the Many decorator
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `details`: [`<Object[]>`][`<Object>`]

Get details for many-to-many link from GlobalStorage


#### StorageProvider.prototype.set(obj, callback)

- `obj`: [`<Object>`] to be stored
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]

Set object in GlobalStorage


#### StorageProvider.prototype.create(category, obj, callback)

- `category`: [`<string>`] category to store the object in
- `obj`: [`<Object>`] to be stored
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `id`: [`<string>`]

Create object in GlobalStorage


#### StorageProvider.prototype.update(category, query, patch, callback)

- `category`: [`<string>`] category to update the records in
- `query`: [`<Object>`] example: { Id }
- `patch`: [`<Object>`] fields to update
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `count`: [`<number>`]

Update object in GlobalStorage


#### StorageProvider.prototype.delete(category, query, callback)

- `category`: [`<string>`] category to delete the records from
- `query`: [`<Object>`] example: { Id }
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `count`: [`<number>`]

Delete object in GlobalStorage


#### StorageProvider.prototype.linkDetails(category, field, fromId, toIds, callback)

- `category`: [`<string>`] category with field having the Many decorator
- `field`: [`<string>`] field with the Many decorator
- `fromId`: [`<Uint64>`] Id of the record in category specified in the first
      argument
- `toIds`: [`<Uint64>`]` | `[`<Uint64[]>`][`<Uint64>`] Id(s) of the record(s) in
      category specified in the Many decorator of the specified field
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]

Link records with Many relation between them


#### StorageProvider.prototype.unlinkDetails(category, field, fromId, toIds, callback)

- `category`: [`<string>`] category with field having the Many decorator
- `field`: [`<string>`] field with the Many decorator
- `fromId`: [`<Uint64>`] Id of the record in category specified in the first
      argument
- `toIds`: [`<Uint64>`]` | `[`<Uint64[]>`][`<Uint64>`] Id(s) of the record(s) in
      category specified in the Many decorator of the specified field
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]

Unlink records with Many relation between them


#### StorageProvider.prototype.select(category, query)

- `category`: [`<string>`] category to select the records from
- `query`: [`<Object>`] fields conditions

_Returns:_ [`<Cursor>`]

Select objects from GlobalStorage


#### StorageProvider.prototype.getSystemSuffix(id)

- `id`: [`<Uint64>`]

_Returns:_ [`<Uint64>`]

Get system suffix for given id


#### StorageProvider.prototype.curSystem(id)

- `id`: [`<Uint64>`]

_Returns:_ [`<boolean>`]

Check whether data with given id is stored on this system


#### StorageProvider.prototype.getServerSuffix(id)

- `id`: [`<Uint64>`]

_Returns:_ [`<Uint64>`]

Get server suffix for given id


#### StorageProvider.prototype.curServer(id)

- `id`: [`<Uint64>`]

_Returns:_ [`<boolean>`]

Check whether data with given id is stored on this server


#### StorageProvider.prototype.getLocalId(id)

- `id`: [`<Uint64>`]

_Returns:_ [`<Uint64>`]

Get id without system and server suffix


#### StorageProvider.prototype.parseId(id)

- `id`: [`<Uint64>`]

_Returns:_ [`<Object>`]
- `systemSuffix`: [`<Uint64>`] system suffix for given id
- `serverSuffix`: [`<Uint64>`] server suffix for given id
- `localId`: [`<Uint64>`] id without system and server suffix

Parse id


#### StorageProvider.prototype.createJstpApi()



[`<Uint64>`]: https://github.com/metarhia/common/blob/master/lib/uint64.js
[`<Metaschema>`]: https://github.com/metarhia/metaschema/blob/master/lib/schema.js
[`<StorageProvider>`]: https://github.com/metarhia/globalstorage/blob/master/lib/provider.js
[`<Cursor>`]: https://github.com/metarhia/globalstorage/blob/master/lib/cursor.js
[`<Object>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[`<Function>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[`<Error>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[`<boolean>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type
[`<null>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type
[`<number>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[`<string>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type

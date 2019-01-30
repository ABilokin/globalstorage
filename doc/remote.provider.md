### Interface: remote.provider

#### RemoteProvider()



#### RemoteProvider.prototype.constructor()



#### RemoteProvider.prototype.open()

 - `options`: [`<Object>`] options for jstp connection
   - `transport`: [`<string>`] jstp transport name
   - `connectionArgs`: [`<Array>`] arguments to be passed to corresponding
         transport's connect method
 - `callback`: [`<Function>`]
   - `error`: [`<Error>`]` | `[`<null>`]
   - `provider`: [`<StorageProvider>`]

Open RemoteProvider


#### RemoteProvider.prototype.close()

 - `callback`: [`<Function>`]
   - `err`: [`<Error>`]` | `[`<null>`]

Close RemoteProvider


#### RemoteProvider.prototype.get(id, callback)

- `id`: [`<string>`] globally unique record id
- `callback`: [`<Function>`]
  - `error`: [`<Error>`]` | `[`<null>`]
  - `record`: [`<Object>`]

Get record from GlobalStorage


#### RemoteProvider.prototype.getDetails(id, fieldName, callback)

- `id`: [`<string>`] globally unique object id
- `fieldName`: [`<string>`] field with the Many decorator
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `details`: [`<Object[]>`][`<Object>`]

Get details for many-to-many link from GlobalStorage


#### RemoteProvider.prototype.set(record, callback)

- `record`: [`<Object>`] record to be stored
- `callback`: [`<Function>`]
  - `error`: [`<Error>`]` | `[`<null>`]

Set record in GlobalStorage


#### RemoteProvider.prototype.create(category, record, callback)

- `category`: [`<string>`] category of record
- `record`: [`<Object>`] record to be stored
- `callback`: [`<Function>`]
  - `error`: [`<Error>`]` | `[`<null>`]
  - `id`: [`<string>`]

Create record in GlobalStorage


#### RemoteProvider.prototype.update(category, query, patch, callback)

- `category`: [`<string>`] category of record
- `query`: [`<Object>`] record, example: { Id }
- `patch`: [`<Object>`] record, fields to update
- `callback`: [`<Function>`]
  - `error`: [`<Error>`]` | `[`<null>`]
  - `count`: [`<number>`]

Update record in GlobalStorage


#### RemoteProvider.prototype.delete(category, query, callback)

- `category`: [`<string>`] category of record
- `query`: [`<Object>`] record, example: { Id }
- `callback`: [`<Function>`]
  - `error`: [`<Error>`]` | `[`<null>`]
  - `count`: [`<number>`]

Delete record in GlobalStorage


#### RemoteProvider.prototype.unlinkDetails(category, field, fromId, toIds, callback)

- `category`: [`<string>`] category with field having the Many decorator
- `field`: [`<string>`] field with the Many decorator
- `fromId`: [`<Uint64>`] Id of the record in category specified in the first
      argument
- `toIds`: [`<Uint64>`]` | `[`<Uint64[]>`][`<Uint64>`] Id(s) of the record(s) in
      category specified in the Many decorator of the specified field
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]

Unlink records with Many relation between them


#### RemoteProvider.prototype.linkDetails(category, field, fromId, toIds, callback)

- `category`: [`<string>`] category with field having the Many decorator
- `field`: [`<string>`] field with the Many decorator
- `fromId`: [`<Uint64>`] Id of the record in category specified in the first
      argument
- `toIds`: [`<Uint64>`]` | `[`<Uint64[]>`][`<Uint64>`] Id(s) of the record(s) in
      category specified in the Many decorator of the specified field
- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]

Link records with Many relation between them


#### RemoteProvider.prototype.select(category, query)

- `category`: [`<string>`] category of record
- `query`: [`<Object>`] fields conditions

_Returns:_ `<gs.Cursor>` cursor

Select record from GlobalStorage


[`<Uint64>`]: https://github.com/metarhia/common/blob/master/lib/uint64.js
[`<StorageProvider>`]: https://github.com/metarhia/globalstorage/blob/master/lib/provider.js
[`<Object>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[`<Function>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[`<Array>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[`<Error>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[`<null>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type
[`<number>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[`<string>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type

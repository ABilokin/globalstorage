### Interface: cursor

#### Cursor()



#### Cursor.prototype.constructor()



#### Cursor.prototype.definition(schema, category)

- `schema`: [`<Metaschema>`]
- `category`: [`<string>`] schema name

_Returns:_ [`<this>`]

Attach schema


#### Cursor.prototype.copy()


_Returns:_ [`<Cursor>`] new instance

Copy references to new dataset


#### Cursor.prototype.clone()


_Returns:_ [`<Cursor>`] new instance

Clone all dataset objects


#### Cursor.prototype.enroll(jsql)

- `jsql`: [`<Array>`] commands array

_Returns:_ [`<this>`]

Apply JSQL commands to dataset


#### Cursor.prototype.empty()


_Returns:_ [`<this>`]

Remove all instances from dataset


#### Cursor.prototype.from(arr)

- `arr`: [`<Iterable>`]

_Returns:_ [`<Cursor>`] new instance

Synchronous virtualization converts Array to Cursor


#### Cursor.prototype.map()


_Returns:_ [`<this>`]

Lazy map

fn - <Function>, map function


#### Cursor.prototype.projection(metadata)

- `metadata`: [`<string[]>`][`<string>`]` | `[`<Object>`] projection metadata
      array of field names or object with structure: { toKey: [ fromKey,
      functions... ] }

_Returns:_ [`<this>`]

Declarative lazy projection


#### Cursor.prototype.filter(fn)

- `fn`: [`<Function>`] filtering function

_Returns:_ [`<this>`]

Lazy functional filter


#### Cursor.prototype.select(query)

- `query`: [`<Function>`] filtering expression

_Returns:_ [`<Cursor>`] new instance

Declarative lazy filter


#### Cursor.prototype.distinct()


_Returns:_ [`<this>`]

Lazy functional distinct filter


#### Cursor.prototype.sort(fn)

- `fn`: [`<Function>`] comparing function

_Returns:_ [`<this>`]

Lazy functional sort


#### Cursor.prototype.order(fields)

- `fields`: [`<string>`]` | `[`<string[]>`][`<string>`]

_Returns:_ [`<this>`]

Declarative lazy ascending sort


#### Cursor.prototype.desc(fields)

- `fields`: [`<string>`]` | `[`<string[]>`][`<string>`]

_Returns:_ [`<this>`]

Declarative lazy descending sort


#### Cursor.prototype.count(field)

- `field`: [`<string>`] field to use for count, optional

_Returns:_ [`<this>`]

Calculate count


#### Cursor.prototype.sum(field)

- `field`: [`<string>`] field to use for sum

_Returns:_ [`<this>`]

Calculate sum


#### Cursor.prototype.avg(field)

- `field`: [`<string>`] field to use for avg

_Returns:_ [`<this>`]

Calculate avg


#### Cursor.prototype.max(field)

- `field`: [`<string>`] field to use for max

_Returns:_ [`<this>`]

Calculate max


#### Cursor.prototype.min(field)

- `field`: [`<string>`] field to use for min

_Returns:_ [`<this>`]

Calculate min


#### Cursor.prototype.col()


_Returns:_ [`<this>`]

Convert first column of dataset to Array


#### Cursor.prototype.row()


_Returns:_ [`<this>`]

Return first row from dataset


#### Cursor.prototype.one()


_Returns:_ [`<this>`]

Get single first record from dataset


#### Cursor.prototype.limit(count)

- `count`: [`<number>`]

_Returns:_ [`<this>`]

Get first n records from dataset


#### Cursor.prototype.offset(offset)

- `offset`: [`<number>`]

_Returns:_ [`<this>`]

Offset into the dataset


#### Cursor.prototype.union(cursor)

- `cursor`: [`<Cursor>`]

_Returns:_ [`<this>`]

Calculate union and put results to this Cursor instance


#### Cursor.prototype.intersection(cursor)

- `cursor`: [`<Cursor>`]

_Returns:_ [`<this>`]

Calculate intersection and put results to this Cursor instance


#### Cursor.prototype.difference(cursor)

- `cursor`: [`<Cursor>`]

_Returns:_ [`<this>`]

Calculate difference and put results to this Cursor instance


#### Cursor.prototype.complement(cursor)

- `cursor`: [`<Cursor>`]

_Returns:_ [`<this>`]

Calculate complement and put results to this Cursor instance


#### Cursor.prototype.selectToMemory()



#### Cursor.prototype.continue(data, callback)

- `data`: [`<Array>`] rows to date
- `callback`: [`<Function>`] to be called upon completion
  - `err`: [`<Error>`]` | `[`<null>`]
  - `dataset`: [`<Object[]>`][`<Object>`]
  - `cursor`: [`<MemoryCursor>`]

Continue computations via i.e. MemoryCursor or other cursor

to handle remaining operations unsupported by current cursor


#### Cursor.prototype.fetch(callback)

- `callback`: [`<Function>`]
  - `err`: [`<Error>`]` | `[`<null>`]
  - `dataset`: [`<Object[]>`][`<Object>`]
  - `cursor`: [`<MemoryCursor>`]

_Returns:_ [`<this>`]

Get results after applying consolidated jsql


[`<Metaschema>`]: https://github.com/metarhia/metaschema/blob/master/lib/schema.js
[`<Cursor>`]: https://github.com/metarhia/globalstorage/blob/master/lib/cursor.js
[`<MemoryCursor>`]: https://github.com/metarhia/globalstorage/blob/master/lib/memory.cursor.js
[`<Object>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[`<Function>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[`<Array>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[`<Error>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[`<null>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type
[`<number>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[`<string>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[`<Iterable>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
[`<this>`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./errors'),
    GSError = _require.GSError,
    errorCodes = _require.codes;

var defaultOptions = {
  category: null,
  schema: null,
  provider: null
};

var Cursor =
/*#__PURE__*/
function () {
  function Cursor(options) {
    _classCallCheck(this, Cursor);

    this.dataset = [];
    this.children = [];
    Object.assign(this, defaultOptions, options);
    this.jsql = options && options.jsql ? options.jsql.slice() : [];
    this.parents = options && options.parents ? options.parents.slice() : [];
  } // Attach schema
  //   schema, // object, schema
  //   category // string, schema name
  // Returns: this instance


  _createClass(Cursor, [{
    key: "definition",
    value: function definition(schema, category) {
      this.schema = schema;
      this.category = category;
      return this;
    }
  }, {
    key: "copy",
    value: function copy() // Copy references to new dataset
    // Return: new Cursor instance
    {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    }
  }, {
    key: "clone",
    value: function clone() // Clone all dataset objects
    // Return: new Cursor instance
    {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    }
  }, {
    key: "enroll",
    value: function enroll( // Apply JSQL commands to dataset
    jsql // commands array
    // Return: previous instance
    ) {
      this.jsql = this.jsql.concat(jsql);
      return this;
    }
  }, {
    key: "empty",
    value: function empty() // Remove all instances from dataset
    // Return: previous instance from chain
    {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    }
  }, {
    key: "from",
    value: function from( // Synchronous virtualization converts Array to Cursor
    // eslint-disable-next-line no-unused-vars
    arr // array or iterable
    // Return: new Cursor instance
    ) {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    }
  }, {
    key: "map",
    value: function map( // Lazy map
    fn // map function
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'map',
        fn: fn
      });
      return this;
    }
  }, {
    key: "projection",
    value: function projection( // Declarative lazy projection
    metadata // projection metadata array of field names
    // or structure: [ { toKey: [ fromKey, functions... ] } ]
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'projection',
        metadata: metadata
      });
      return this;
    }
  }, {
    key: "filter",
    value: function filter( // Lazy functional filter
    fn // filtering function
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'filter',
        fn: fn
      });
      return this;
    }
  }, {
    key: "select",
    value: function select( // Declarative lazy filter
    query // filter expression
    // Return: new Cursor instance
    ) {
      this.jsql.push({
        op: 'select',
        query: query
      });
      return this;
    }
  }, {
    key: "distinct",
    value: function distinct() // Lazy functional distinct filter
    // Return: previous instance from chain
    {
      this.jsql.push({
        op: 'distinct'
      });
      return this;
    }
  }, {
    key: "sort",
    value: function sort( // Lazy functional sort
    fn // compare function
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'sort',
        fn: fn
      });
      return this;
    }
  }, {
    key: "order",
    value: function order( // Declarative lazy ascending sort
    fields // field name or array of names
    // Return: previous instance from chain
    ) {
      if (typeof fields === 'string') fields = [fields];
      this.jsql.push({
        op: 'order',
        fields: fields
      });
      return this;
    }
  }, {
    key: "desc",
    value: function desc( // Declarative lazy descending sort
    fields // field name or array of names
    // Return: previous instance from chain
    ) {
      if (typeof fields === 'string') fields = [fields];
      this.jsql.push({
        op: 'desc',
        fields: fields
      });
      return this;
    }
  }, {
    key: "count",
    value: function count( // Calculate count
    field // string, field to use for count or 'undefined'
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'count',
        field: field
      });
      return this;
    }
  }, {
    key: "sum",
    value: function sum( // Calculate sum
    field // string, field to use for sum
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'sum',
        field: field
      });
      return this;
    }
  }, {
    key: "avg",
    value: function avg( // Calculate avg
    field // string, field to use for avg
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'avg',
        field: field
      });
      return this;
    }
  }, {
    key: "max",
    value: function max( // Calculate max
    field // string, field to use for max
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'max',
        field: field
      });
      return this;
    }
  }, {
    key: "min",
    value: function min( // Calculate min async
    field // string, field to use for min
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'min',
        field: field
      });
      return this;
    }
  }, {
    key: "col",
    value: function col() // Convert first column of dataset to Array
    // Return: previous instance from chain
    {
      this.jsql.push({
        op: 'col'
      });
      return this;
    }
  }, {
    key: "row",
    value: function row() // Return first row from dataset
    // Return: previous instance from chain
    {
      this.jsql.push({
        op: 'row'
      });
      return this;
    }
  }, {
    key: "one",
    value: function one() // Get single first record from dataset
    // Return: previous instance from chain
    {
      this.jsql.push({
        op: 'limit',
        count: 1
      });
      return this;
    }
  }, {
    key: "limit",
    value: function limit( // Get first n records from dataset
    count // Number
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'limit',
        count: count
      });
      return this;
    }
  }, {
    key: "offset",
    value: function offset( // Offset into the dataset
    _offset // Number
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'offset',
        offset: _offset
      });
      return this;
    }
  }, {
    key: "union",
    value: function union( // Calculate union and put results to this Cursor instance
    cursor // Cursor instance
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'union',
        cursor: cursor
      });
      this.parents.push(cursor);
      return this;
    }
  }, {
    key: "intersection",
    value: function intersection( // Calculate intersection and put results to this Cursor instance
    cursor // Cursor instance
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'intersection',
        cursor: cursor
      });
      this.parents.push(cursor);
      return this;
    }
  }, {
    key: "difference",
    value: function difference( // Calculate difference and put results to this Cursor instance
    cursor // Cursor instance
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'difference',
        cursor: cursor
      });
      this.parents.push(cursor);
      return this;
    }
  }, {
    key: "complement",
    value: function complement( // Calculate complement and put results to this Cursor instance
    cursor // Cursor instance
    // Return: previous instance from chain
    ) {
      this.jsql.push({
        op: 'complement',
        cursor: cursor
      });
      this.parents.push(cursor);
      return this;
    }
  }, {
    key: "selectToMemory",
    value: function selectToMemory(query) {
      return new Cursor.MemoryCursor([], {
        jsql: query ? [{
          op: 'select',
          query: query
        }] : [],
        schema: this.schema,
        parents: [this]
      });
    } // Continue computations via i.e. MemoryCursor or other cursor
    // to handle remaining operations unsupported by current cursor
    //   data - array of rows to date
    //   callback - function(err, dataset, cursor) to be called upon completion

  }, {
    key: "continue",
    value: function _continue(data, callback) {
      new Cursor.MemoryCursor(data, {
        parents: this.parents,
        category: this.category,
        schema: this.schema,
        jsql: this.jsql
      }).fetch(callback);
    } // Get results after applying consolidated jsql
    //   callback - function(err, dataset, cursor)
    // Return: this instance

  }, {
    key: "fetch",
    value: function fetch()
    /* callback */
    {
      throw new GSError(errorCodes.NOT_IMPLEMENTED);
    }
  }]);

  return Cursor;
}();

module.exports = {
  Cursor: Cursor
};
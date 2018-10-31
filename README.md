# ImpulseDB

Fast and flexible JSON database.

```js
db(key).set(property, value)
```

Each key in the `db` object **corresponds to a JSON file**.

This can also be view as:

```js
db(file).set(property, value)
```

## Install

```
$ npm install impulsedb --save
```

## Usage

```js
const db = require('impulsedb')('db');
db('money').set('sky', 10);
db('money').set('some_user', db('money').get('sky') + 10);
db('seen').set('some_user', Date.now());
db('posts').set('posts', [
  { title: 'impulsedb is awesome!', body: '...', likes: 10 },
  { title: 'flexbility ', body: '...', likes: 3 },
  { title: 'something someting something', body: '...', likes: 8 }
]);
```

In the `db` **folder**:

```json
// money.json
{
  "sky": 10
}

// seen.json
{
  "some_user": 1439674925906
}

// posts.json
{
  "posts": [
    { "title": "impulsedb is awesome!", "body": "...", "likes": 10 },
    { "title": "flexbility ", "body": "...", "likes": 3 },
    { "title": "something someting something", "body": "...", "likes": 8 }
  ]
}
```

## API

### db(databaseDirectory, options)

Create a new database.

Parameters:

- ``databaseDirectory``: _String_ -
The folder where all the json files will be stored at when using the `files`
adapter. Otherwise, it is the name of where the data will be stored at.
- ``options`` - _Object_
  - ``adapter`` - _String_ or _Function_. Defaults to `files`.

Returns: Function(key)
  - ``key``: _String_ - JSON file in the database directory
  - Returns: _Object_ - Methods of impulsedb.

Examples:

```js
const db = require('impulsedb')('userdb');
```

```js
const db = require('impulsedb')('apidb');
```

```js
const db = require('impulsedb')('mongodb://localhost:27017/myproject', {adapter: 'mongo'});
```

### save()

Saves the current data in the database to all files. Does not write to a file
if no changes were made.

Parameters: None

Returns: _undefined_

Example:

```js
// main.js
db('money').object().sky = 25;
db.save();

// money.json
{
  'sky': 25
}
```

### get(property, defaultValue)

Get a property and if it does not exist, return the default value instead.

Parameters:

- ``property``: _String_ | _Array_
- ``defaultValue``: _any_

Returns: _any_ - Depends on what is in property.

Example:

```js
// money.json
{
  'sky': 10,
  'stevo': 5
}

// main.js
db('money').get('sky'); // 10
db('money').get('jared', 0); // 0
db('money').get('stevo', 0); // 5
```

```js
// profile.json
{
  'sky': {
    'name': 'Musaddik Temkar',
    'img': {
      'width': 55,
      'height': 20
    }
  }
}

// main.js
db('profile').get(['sky', 'name']); // 'Musaddik Temkar'
db('profile').get(['sky', 'img', 'width']); // 55
db('profile').get(['sky', 'img', 'height'], 0); // 20
db('profile').get(['sky', 'img', 'resolution'], '4k'); // '4k'
db('profile').get(['sky', 'join_date']); // undefined
db('profile').get(['sky', 'img']); // { width: 55, height: 20 }
```

### has(property)

Checks to see if it has a property.

Parameters:

- ``property``: _String_ | _Array_

Returns: _Boolean_

Example:

```js
{
  'bar': 'some kind of data',
  'baz': 'some kind of data'
}

console.log(db('foo').has('bar'));
//=> true
console.log(db('foo').has('boo'));
//=> false
```

### delete(property)

Delete a property.
Shorthand for ``delete db('key').object()['prop']; db.save();``

Parameters:

- ``property``: _String_ | _Array_

Returns: _Object_ - Methods of impulsedb. This is useful for chaining methods
together.

Example:

```js
// food.json before
{
  'soup': true,
  'noodle': true
}

db('food').delete('soup');

// food.json after
{
  'noodle': true
}
```

### set(property, value)

Set a property with a value. This method automatically saves.

Parameters:

- ``property``: _String_ | _Array_
- ``value``: _any_

Returns: _Object_ - Methods of impulsedb. This is useful for chaining methods
together.

Examples:

```js
// main.js
db('money')
  .set('sky', 10)
  .set('josh', 89)
  .set('mike', db.get('mike', 0))
  .set('alex', 17);

// money.json
{
  'sky': 10,
  'josh': 89,
  'mike': 0,
  'alex': 17
}
```

```js
db('tickets').set('sky', db('tickets').get('sky').concat[generateTicket()]);
```

```js
// profile.json before
{
  'sky': {
    'name': 'Musaddik Temkar',
    'img': {
      'width': 55,
      'height': 20
    }
  }
}

// main.js
db('profile')
  .set(['sky', 'name'], 'Musaddik Temkar')
  .set(['sky', 'friends'], ['fender', 'a Gryphon'])
  .set(['sky', 'wins', 'game_format'], 9)
  .set(['sky', 'img', 'height'], 200);

// profile.json after
{
  'sky': {
    'name': 'Musaddik Temkar',
    'img': {
      'width': 55,
      'height': 200
    },
    'friends': ['fender', 'a Gryphon'],
    'wins': {
      'game_format': 9
    }
  }
}
```

### object()

Get the JSON object to directly manipulate it.

Parameters: None

Returns: _Object_

Examples:

```js
// join_date.json
{
  'sky': 1450814470721,
  'micheal': 1394814738429
}

// main.js
const name = 'sky';
console.log(db('join_date').object()[name]); // 1450814470721
console.log(db('join_date').object().micheal); // 1394814738429
db('join_date').object()[name] = new Date();
db.save();

// join_date.json
{
  'sky': 1450815256685,  
  'micheal': 1394814738429
}
```

```js
// money.js
{
  "sky": 10,
  "some_user": 20,
  "john": 10,
  "mike": 23,
}

// main.js
const users = db('money').object();
const total = Object.keys(users).reduce(function(acc, cur) {
  return acc + users[cur];
}, 0);

console.log(total); // 63
```

## Other methods

Some other methods that are provided by lodash are:
[keys](https://lodash.com/docs#keys),
[transform](https://lodash.com/docs#transform),
[values](https://lodash.com/docs#values), and
[update](https://lodash.com/docs#update).

## Adapters

impulsedb defaults to `files` adapter which just uses files in a folder to store
the data. However, impulsedb supports other ways to store data.

Current supported adapters are:

- Files
- MongoDB

### MongoDB

impulsedb stores data in MongoDB like this:

```js
// app.js
const db = require('impulsedb')('mongodb://localhost:27017/myproject', {adapter: 'mongo'});
db('money')
  .set('sky', 10)
  .set('some_user', db('money').get('sky') + 10);
db('seen').set('some_user', Date.now());
db('posts').set('posts', [
  { title: 'impulsedb is awesome!', body: '...', likes: 10 },
  { title: 'flexbility ', body: '...', likes: 3 },
  { title: 'something someting something', body: '...', likes: 8 }
]);

// MongoDB
{
	"_id" : ObjectId("567e4741b09bffce48aa98b1"),
	"name" : "money",
	"data" : "{\"sky\":10,\"some_user\":20}"
}
{
	"_id" : ObjectId("567e4741b09bffce48aa98b2"),
	"name" : "seen",
	"data" : "{\"some_user\":1451116353687}"
}
{
	"_id" : ObjectId("567e4741b09bffce48aa98b3"),
	"name" : "posts",
	"data" : "{\"posts\":[{\"title\":\"impulsedb is awesome!\",\"body\":\"...\",\"likes\":10},{\"title\":\"flexbility \",\"body\":\"...\",\"likes\":3},{\"title\":\"something someting something\",\"body\":\"...\",\"likes\":8}]}"
}
```

You can also create your own adapters. For example, a adapter that does not save
to file but instead does nothing.

```js
const db = require('impulsedb')({
  /**
   * @param {String} name - name of location of where the data will be stored.
   * @param {Object} objects - the internal in-memory cache object
   * @param {Object} checksums - every key in objects' checksums
   * @param {Object} options
   * @return {Function} save function
   */
  adapter: function(name, objects, checksums, options) {
    return function noopSave() {};
  }
});
```

## License

MIT © [PrinceSky](http://github.com/FlamePrince-PS)

icache [![License](https://img.shields.io/npm/l/icache.svg)](https://github.com/strikeentco/icache/blob/master/LICENSE)  [![npm](https://img.shields.io/npm/v/icache.svg)](https://www.npmjs.com/package/icache)
==========
[![Build Status](https://travis-ci.org/strikeentco/icache.svg)](https://travis-ci.org/strikeentco/icache) [![node](https://img.shields.io/node/v/icache.svg)](https://www.npmjs.com/package/icache) [![Test Coverage](https://codeclimate.com/github/strikeentco/icache/badges/coverage.svg)](https://codeclimate.com/github/strikeentco/icache/coverage) [![bitHound Score](https://www.bithound.io/github/strikeentco/icache/badges/score.svg)](https://www.bithound.io/github/strikeentco/icache)

**Note:** *This module stores all data in memory - remember that.*

A simple queue cache which follows FIFO strategy when size is specified.

> **FIFO** is an acronym for **first in, first out**, a method for organizing and manipulating a data buffer, where the oldest (first) entry, or 'head' of the queue, is processed first. [Wiki](https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics))

When size isn't specified it's just a cache storage.

Queue cache is perfectly fit when you need to store last `n` elements, and access to them from time to time.

# Usage

```sh
$ npm install icache --save
```

```javascript
const Cache = require('icache');

const cache = new Cache(5);

cache.put('user', 'strikeentco');
cache.has('user'); // -> true
cache.put('email', 'strikeentco@gmail.com');
cache.get('email'); // -> 'strikeentco@gmail.com'
cache.clear();
cache.keys(); // -> []
cache.all(); // -> {}

cache.put('github', { user: 'strikeentco', email: 'strikeentco@gmail.com' });
cache.keys(); // -> ['github']
cache.all(); // -> { github: { user: 'strikeentco', email: 'strikeentco@gmail.com' } }
cache.del('github');
cache.keys(); // -> []
cache.all(); // -> {}
```

# Methods

## new Cache([size])

Constructor.

### Params:

* **[size]** (*Integer*) - Maximum elements number (by default = 0, i.e. no limits)

```javascript
const cache = new Cache();
```

## .length

Returns the number of elements in a Cache.

```javascript
const cache = new Cache();
cache.length; // -> 0
cache.put('new', 'element');
cache.length; // -> 1
```

## .getSize()

Returns Cache size.

```javascript
const cache = new Cache();
cache.getSize();
```

## .setSize([size])

Sets Cache size.

### Params:

* **[size]** (*Integer*) - Maximum elements number (by default = 0, i.e. no limits)

```javascript
const cache = new Cache();
cache.setSize(10);
```

## .put(key, value, [time])

Adds a new element with a specified key and value to a Cache.

### Params:

* **key** (*String*) - The key of the element
* **value** (*Mixed*) - The value of the element
* **[time]** (*Integer|Float*) - Time in seconds after which the element will be removed

```javascript
cache.put('new', 'element');
cache.put('another', { element: null });
```

## .get(key)

Returns a specified element from a Cache.

### Params:

* **key** (*String*) - The key of the element

```javascript
cache.put('new', 'element');
cache.get('new'); // -> 'element'
```

## .has(key)

Returns a boolean indicating whether an element with the specified key exists in a Cache or not.

### Params:

* **key** (*String*) - The key of the element.

```javascript
cache.put('new', 'element');
cache.has('new'); // -> true
cache.has('old'); // -> false
```

## .keys()

Returns an array of elements keys from a Cache.

```javascript
cache.put('new', 'element');
cache.put('newer', 'element');
cache.keys(); // ['new', 'newer']
```

## .del(key)

Removes the specified element from a Cache.

### Params:

* **key** (*String*) - The key of the element.

```javascript
cache.put('new', 'element').has('new'); // -> true
cache.del('new').has('new'); // -> false
```

## .all()

Returns an object with all Cache elements.

Order is not guaranteed. For correct order, use in combination with [.keys()](#keys). [Example](#adding-new-method).

```javascript
cache.put('1', null).put('2', null);
cache.all(); // -> { 1: null, 2: null }
```

## .clear()

Removes all elements from a Cache.

```javascript
cache.put('1', null).put('2', null).all(); // -> { 1: null, 2: null }
cache.clear().all(); // -> { }
```

## .expire(key, time)

Sets timeout after which element will be removed.

To remove timeout, set time to 0.

### Params:

* **key** (*String*) - The key of the element
* **time** (*Integer|Float*) - Time in seconds after which the element will be removed

```javascript
cache.put('old', 'element');
cache.expire('old', 1); // will be removed after 1 second
cache.put('new', 'element', 5); // will be removed after 5 seconds
cache.expire('new', 0); // will cancel timeout
```

# Examples

## Adding new method

```javascript
const Cache = require('icache');

class ExtCache extends Cache {
  allInOrder() { // will return array with all Cache elements in accordance with this.keys() order
    return this.keys().map(key => ({ [key]: this.get(key) }));
  }
}

const cache = new ExtCache();
cache.put(2, 'element');
cache.put(3, 'element');
cache.put('1', 'element');

cache.all(); // -> { 1: 'element', 2: 'element', 3: 'element' }
cache.allInOrder(); // -> [{ 2: 'element' }, { 3: 'element' }, { 1: 'element' }]

cache.setSize(2);

cache.all(); // -> { 1: 'element', 3: 'element' }
cache.allInOrder(); // -> [{ 3: 'element' }, { 1: 'element' }]
```

## Caching last 5 requests

```javascript
const Cache = require('icache');
const app = require('express')();
const co = require('co');
const get = require('yarl').get;

const cache = new Cache(5);

app.get('/user/:name', (req, res) => {
  co(function* () {
    const name = req.params.name;
    if (cache.has(name)) {
      return res.json(cache.get(name));
    }
    const data = (yield get(`https://api.github.com/users/${name}`, { json: true })).body;
    cache.put(name, data);
    res.json(data);
  }).catch(e => res.status(500).json(e));
});

app.listen(3000);
```

## License

The MIT License (MIT)<br/>
Copyright (c) 2016 Alexey Bystrov

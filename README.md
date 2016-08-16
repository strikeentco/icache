icache
==========

**Note:** *This module stores all data in memory - remember that.*

A simple queue cache which follows FIFO strategy when size is specified.

> **FIFO** is an acronym for **first in, first out**, a method for organizing and manipulating a data buffer, where the oldest (first) entry, or 'head' of the queue, is processed first. [Wiki](https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)

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
cache.all(); // -> { }

cache.put('github', { user: 'strikeentco', email: 'strikeentco@gmail.com' });
cache.all(); // -> { github: { user: 'strikeentco', email: 'strikeentco@gmail.com' } }
cache.del('github');
cache.all(); // -> { }
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

```javascript
cache.put(1, null).put(2, null);
cache.all(); // -> { 1: null, 2: null }
```

## .clear()

Removes all elements from a Cache.

```javascript
cache.put(1, null).put(2, null).all(); // -> { 1: null, 2: null }
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

## License

The MIT License (MIT)<br/>
Copyright (c) 2016 Alexey Bystrov

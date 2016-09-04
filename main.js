'use strict';

function del(key) {
  delete this.store[key];
  this.expire(key, 0);
  this.length--;
}

class iCache {
  constructor(size) {
    this.setSize(size);
    this._keys = [];
    this._timers = {};
    this.store = {};
    this.length = 0;
  }

  getSize() {
    return this.size;
  }

  setSize(size) {
    const currentSize = this.getSize();
    this.size = (Number.isFinite(size) && size > 0) ? size : 0;
    if (currentSize === undefined) {
      return this;
    }
    const count = this.length - size;
    if (size !== 0 && count > 0) {
      const elements = this.keys().slice(0, count);
      elements.forEach(el => {
        this.del(el);
      });
    }
    return this;
  }

  all() {
    return this.store;
  }

  keys() {
    return this._keys;
  }

  has(key) {
    return this.all().hasOwnProperty(key);
  }

  get(key) {
    return this.all()[key];
  }

  put(key, val, time) {
    key = key.toString();
    if (this.has(key)) {
      this.del(key);
      this.put(key, val, time);
      return this;
    }

    this._keys.push(key);
    this.length++;
    if (this.getSize() !== 0 && this.length > this.getSize()) {
      del.call(this, this._keys.shift());
    }

    if (time != null) {
      this.expire(key, time);
    }
    this.store[key] = val;
    return this;
  }

  del(key) {
    const value = this.keys().indexOf(key);
    if (value !== -1) {
      this._keys.splice(value, 1);
      del.call(this, key);
    }
    return this;
  }

  clear() {
    this._keys.forEach(el => {
      this.expire(el, 0);
    });
    this._keys = [];
    this._timers = {};
    this.store = {};
    this.length = 0;
    return this;
  }

  expire(key, time) {
    if (time > 0) {
      this._timers[key] = setTimeout(() => this.del(key), time * 1000);
    } else {
      clearTimeout(this._timers[key]);
      delete this._timers[key];
    }
    return this;
  }
}

module.exports = iCache;

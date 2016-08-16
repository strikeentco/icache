'use strict';

const should = require('should/as-function');
const Cache = require('../main');

describe('iCache()', () => {
  describe('.put()', () => {
    it('should be ok', done => {
      const cache = new Cache(5);
      cache.put(1, 1);
      should(cache.get(1)).be.eql(1);
      cache.put(1, 2);
      should(cache.get(1)).be.eql(2);
      cache.put(3, 2, 0.05);
      should(cache.get(3)).be.eql(2);
      cache.put(4, 2, 0.01);
      should(cache.get(4)).be.eql(2);
      cache.expire(4, 0);
      setTimeout(() => {
        should(cache.get(3)).be.eql(2);
      }, 25);
      setTimeout(() => {
        should(cache.get(4)).be.eql(2);
        should(cache.has(3)).be.false();
        cache.put(3, 2).put(5, 6).put(6, 7).put(7, 8);
        should(cache.all()).be.eql({ 3: 2, 4: 2, 5: 6, 6: 7, 7: 8 });
        done();
      }, 50);
    });
  });

  describe('.get()', () => {
    it('should be eql 1', () => {
      const cache = new Cache(5);
      cache.put(1, 1);
      should(cache.get(1)).be.eql(1);
    });
    it('should be undefined', () => {
      const cache = new Cache(5);
      cache.put(1, 1);
      should(cache.get(2)).be.eql(undefined);
    });
  });

  describe('.has()', () => {
    it('should be true', () => {
      const cache = new Cache(5);
      cache.put(1, 1);
      should(cache.has(1)).be.true();
      cache.put(1, 2);
      should(cache.has(1)).be.true();
      cache.del(1);
      cache.put(1, 1);
      should(cache.has(1)).be.true();
    });

    it('should be false', () => {
      const cache = new Cache(3);
      cache.put(1, 1).put(2, 1).put(3, 1);
      should(cache.has(5)).be.false();
      cache.del(1);
      should(cache.has(1)).be.false();
      cache.setSize(1);
      should(cache.has(2)).be.false();
    });
  });

  describe('.del()', () => {
    it('should be ok', () => {
      const cache = new Cache(5);
      cache.put(1, 1);
      should(cache.has(1)).be.true();
      cache.del(1);
      should(cache.has(1)).be.false();
      cache.del(2);
      should(cache.has(2)).be.false();
    });
  });

  describe('.clear()', () => {
    it('should be ok', () => {
      const cache = new Cache(5);
      cache.put(1, 1).put(2, 2).put(3, 3);
      should(cache.all()).be.eql({ 1: 1, 2: 2, 3: 3 });
      cache.clear();
      should(cache.all()).be.eql({});
      should(cache.has(1)).be.false();
      should(cache.has(2)).be.false();
      should(cache.has(3)).be.false();
    });
  });

  describe('.expire()', () => {
    it('should be ok', done => {
      const cache = new Cache(5);
      cache.put(1, 2, 0.01);
      should(cache.get(1)).be.eql(2);
      cache.expire(1, 0);
      setTimeout(() => {
        should(cache.get(1)).be.eql(2);
      }, 25);
      cache.put(2, 2, 0.01);
      should(cache.get(2)).be.eql(2);
      setTimeout(() => {
        should(cache.has(2)).be.false();
        done();
      }, 50);
    });
  });

  describe('.all()', () => {
    it('should be ok', () => {
      const cache = new Cache();
      cache.put(1, 1).put(2, 2).put(3, 3);
      should(cache.all()).be.eql({ 1: 1, 2: 2, 3: 3 });
      cache.setSize(2);
      should(cache.all()).be.eql({ 2: 2, 3: 3 });
      cache.del(3);
      should(cache.all()).be.eql({ 2: 2 });
    });
  });

  describe('.getSize()', () => {
    it('should be eql 0', () => {
      should(new Cache().getSize()).be.eql(0);
      should(new Cache(0).getSize()).be.eql(0);
      should(new Cache(-1).getSize()).be.eql(0);
      should(new Cache('').getSize()).be.eql(0);
      should(new Cache('empty').getSize()).be.eql(0);
      should(new Cache(null).getSize()).be.eql(0);
      should(new Cache(undefined).getSize()).be.eql(0);
    });

    it('should be eql 5', () => {
      should(new Cache(5).getSize()).be.eql(5);
    });

    it('should be eql 25', () => {
      should(new Cache(5).setSize(25).getSize()).be.eql(25);
    });
  });

  describe('.setSize()', () => {
    it('should be ok', () => {
      const cache = new Cache();
      should(cache.setSize().getSize()).be.eql(0);
      should(cache.setSize(5).getSize()).be.eql(5);
      should(cache.setSize(5).setSize(0).getSize()).be.eql(0);
    });

    it('should be ok', () => {
      const cache = new Cache();
      cache.put(1, 1).put(2, 2).put(3, 3);
      should(cache.all()).be.eql({ 1: 1, 2: 2, 3: 3 });
      should(cache.getSize()).be.eql(0);
      should(cache.length).be.eql(3);
      cache.setSize(2);
      should(cache.getSize()).be.eql(2);
      should(cache.length).be.eql(2);
      should(cache.all()).be.eql({ 2: 2, 3: 3 });
    });
  });
});

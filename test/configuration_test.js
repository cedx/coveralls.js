'use strict';

import assert from 'assert';
import {Configuration} from '../src/index';

/**
 * @test {Configuration}
 */
describe('Configuration', () => {

  /**
   * @test {Configuration.fromEnvironment}
   */
  describe('.fromEnvironment()', () => {
    it('should return an empty configuration for an empty environment', () => {
      assert.equal(Configuration.fromEnvironment({}).length, 0);
    });

    it('TODO', () => {
    });
  });

  /**
   * @test {Configuration.fromYAML}
   */
  describe('.fromYAML()', () => {
    it('should return a null reference with a non-object value', () => {
      assert.strictEqual(Configuration.fromYAML('foo'), null);
    });

    it('TODO', () => {
    });
  });

  /**
   * @test {Configuration#length}
   */
  describe('#length', () => {
    it('should return 0 for an empty configuration', () => {
      assert.equal(new Configuration().length, 0);
    });

    it('should return the number of entries for a non-empty configuration', () => {
      assert.equal(new Configuration({bar: 'baz', foo: 'bar'}).length, 2);
    });
  });

  /**
   * @test {Configuration#[Symbol.iterator]}
   */
  describe('#[Symbol.iterator]()', () => {
    it('should return a done iterator if configuration is empty', () => {
      let config = new Configuration();
      let iterator = config[Symbol.iterator]();
      assert.ok(iterator.next().done);
    });

    it('should return a value iterator if configuration is not empty', () => {
      /* eslint-disable sort-keys */
      let config = new Configuration({foo: 'bar', bar: 'baz'});
      /* eslint-enable sort-keys */

      let iterator = config[Symbol.iterator]();
      let next = iterator.next();
      assert.ok(!next.done);
      assert.equal(next.value[0], 'foo');
      assert.equal(next.value[1], 'bar');

      next = iterator.next();
      assert.ok(!next.done);
      assert.equal(next.value[0], 'bar');
      assert.equal(next.value[1], 'baz');

      assert.ok(iterator.next().done);
    });
  });

  /**
   * @test {Configuration#containsKey}
   */
  describe('#containsKey()', () => {
    it('should return false if the specified key is not contained', () => {
      assert.ok(!new Configuration().containsKey('foo'));
    });

    it('should return true if the specified key is not contained', () => {
      assert.ok(new Configuration({foo: 'bar'}).containsKey('foo'));
    });
  });

  /**
   * @test {Configuration#get}
   */
  describe('#get()', () => {
    it('should properly get the configuration entries', () => {
      let config = new Configuration();
      assert.strictEqual(config.get('foo'), null);
      assert.equal(config.get('foo', 123), 123);

      config.set('foo', 'bar');
      assert.equal(config.get('foo'), 'bar');
    });
  });

  /**
   * @test {Configuration#merge}
   */
  describe('#merge()', () => {
    it('should have the same entries as the other configuration', () => {
      let config = new Configuration();
      assert.equal(config.length, 0);

      config.merge(new Configuration({bar: 'baz', foo: 'bar'}));
      assert.equal(config.length, 2);
      assert.equal(config.get('foo'), 'bar');
      assert.equal(config.get('bar'), 'baz');
    });
  });

  /**
   * @test {Configuration#set}
   */
  describe('#set()', () => {
    it('should properly set the configuration entries', () => {
      let config = new Configuration();
      assert.strictEqual(config.get('foo'), null);

      config.set('foo', 'bar');
      assert.equal(config.get('foo'), 'bar');
    });
  });

  /**
   * @test {Configuration#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      let map = new Configuration().toJSON();
      assert.equal(Object.keys(map).length, 0);
    });

    it('should return a non-empty map for an initialized instance', () => {
      let map = new Configuration({bar: 'baz', foo: 'bar'}).toJSON();
      assert.equal(Object.keys(map).length, 2);
      assert.equal(map.foo, 'bar');
      assert.equal(map.bar, 'baz');
    });
  });
});

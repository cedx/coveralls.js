'use strict';

import assert from 'assert';
import {GitRemote} from '../src/index';

/**
 * @test {GitRemote}
 */
describe('GitRemote', () => {

  /**
   * @test {GitRemote.fromJSON}
   */
  describe('.fromJSON()', () => {
    it('should return a null reference with a non-object value', () => {
      assert.strictEqual(GitRemote.fromJSON('foo'), null);
    });

    it('should return an instance with default values for an empty map', () => {
      let remote = GitRemote.fromJSON({});
      assert.ok(remote instanceof GitRemote);
      assert.equal(remote.name, '');
      assert.equal(remote.url, '');
    });

    it('should return an initialized instance for a non-empty map', () => {
      let remote = GitRemote.fromJSON({name: 'origin', url: 'https://github.com/cedx/coveralls.js.git'});
      assert.ok(remote instanceof GitRemote);
      assert.equal(remote.name, 'origin');
      assert.equal(remote.url, 'https://github.com/cedx/coveralls.js.git');
    });
  });

  /**
   * @test {GitRemote#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      let map = new GitRemote().toJSON();
      assert.equal(Object.keys(map).length, 2);
      assert.equal(map.name, '');
      assert.equal(map.url, '');
    });

    it('should return a non-empty map for an initialized instance', () => {
      let map = new GitRemote('origin', 'https://github.com/cedx/coveralls.js.git').toJSON();
      assert.equal(Object.keys(map).length, 2);
      assert.equal(map.name, 'origin');
      assert.equal(map.url, 'https://github.com/cedx/coveralls.js.git');
    });
  });
});

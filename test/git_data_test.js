'use strict';

import assert from 'assert';
import {GitCommit, GitData, GitRemote} from '../src/index';

/**
 * @test {GitData}
 */
describe('GitData', () => {

  /**
   * @test {GitData.fromJSON}
   */
  describe('.fromJSON()', () => {
    it('should return a null reference with a non-object value', () => {
      assert.strictEqual(GitData.fromJSON('foo'), null);
    });

    it('should return an instance with default values for an empty map', () => {
      let data = GitData.fromJSON({});
      assert.ok(data instanceof GitData);
      assert.equal(data.branch, '');
      assert.strictEqual(data.commit, null);

      assert.ok(Array.isArray(data.remotes));
      assert.equal(data.remotes.length, 0);
    });

    it('should return an initialized instance for a non-empty map', () => {
      let data = GitData.fromJSON({
        branch: 'develop',
        head: {id: '2ef7bde608ce5404e97d5f042f95f89f1c232871'},
        remotes: [{name: 'origin'}]
      });

      assert.ok(data instanceof GitData);
      assert.equal(data.branch, 'develop');

      assert.ok(data.commit instanceof GitCommit);
      assert.equal(data.commit.id, '2ef7bde608ce5404e97d5f042f95f89f1c232871');

      assert.ok(Array.isArray(data.remotes));
      assert.equal(data.remotes.length, 1);
      assert.ok(data.remotes[0] instanceof GitRemote);
      assert.equal(data.remotes[0].name, 'origin');
    });
  });

  /**
   * @test {GitData#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      let map = new GitData().toJSON();
      assert.equal(Object.keys(map).length, 3);
      assert.equal(map.branch, '');
      assert.strictEqual(map.head, null);

      assert.ok(Array.isArray(map.remotes));
      assert.equal(map.remotes.length, 0);
    });

    it('should return a non-empty map for an initialized instance', () => {
      let map = new GitData(new GitCommit('2ef7bde608ce5404e97d5f042f95f89f1c232871'), 'develop', [new GitRemote('origin')]).toJSON();
      assert.equal(Object.keys(map).length, 3);
      assert.equal(map.branch, 'develop');

      assert.ok(map.head && typeof map.head == 'object');
      assert.equal(map.head.id, '2ef7bde608ce5404e97d5f042f95f89f1c232871');

      assert.ok(Array.isArray(map.remotes));
      assert.equal(map.remotes.length, 1);
      assert.ok(map.remotes[0] && typeof map.remotes[0] == 'object');
      assert.equal(map.remotes[0].name, 'origin');
    });
  });
});
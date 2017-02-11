'use strict';

import assert from 'assert';
import {GitCommit} from '../src/index';

/**
 * @test {GitCommit}
 */
describe('GitCommit', () => {

  /**
   * @test {GitCommit.fromJSON}
   */
  describe('.fromJSON()', () => {
    it('should return a null reference with a non-object value', () => {
      assert.strictEqual(GitCommit.fromJSON('foo'), null);
    });

    it('should return an instance with default values for an empty map', () => {
      let remote = GitCommit.fromJSON({});
      assert.ok(remote instanceof GitCommit);
      assert.equal(remote.authorEmail, '');
      assert.equal(remote.authorName, '');
      assert.equal(remote.id, '');
      assert.equal(remote.message, '');
    });

    it('should return an initialized instance for a non-empty map', () => {
      let remote = GitCommit.fromJSON({
        author_email: 'anonymous@secret.com',
        author_name: 'Anonymous',
        id: '2ef7bde608ce5404e97d5f042f95f89f1c232871',
        message: 'Hello World!'
      });

      assert.ok(remote instanceof GitCommit);
      assert.equal(remote.authorEmail, 'anonymous@secret.com');
      assert.equal(remote.authorName, 'Anonymous');
      assert.equal(remote.id, '2ef7bde608ce5404e97d5f042f95f89f1c232871');
      assert.equal(remote.message, 'Hello World!');
    });
  });

  /**
   * @test {GitCommit#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      let map = new GitCommit().toJSON();
      assert.equal(Object.keys(map).length, 1);
      assert.equal(map.id, '');
    });

    it('should return a non-empty map for an initialized instance', () => {
      let commit = new GitCommit('2ef7bde608ce5404e97d5f042f95f89f1c232871', 'Hello World!');
      commit.authorEmail = 'anonymous@secret.com';
      commit.authorName = 'Anonymous';

      let map = commit.toJSON();
      assert.equal(Object.keys(map).length, 4);
      assert.equal(map.author_email, 'anonymous@secret.com');
      assert.equal(map.author_name, 'Anonymous');
      assert.equal(map.id, '2ef7bde608ce5404e97d5f042f95f89f1c232871');
      assert.equal(map.message, 'Hello World!');
    });
  });

  /**
   * @test {GitCommit#toString}
   */
  describe('#toString()', () => {
    let commit = new GitCommit('2ef7bde608ce5404e97d5f042f95f89f1c232871', 'Hello World!');
    commit.authorEmail = 'anonymous@secret.com';
    commit.authorName = 'Anonymous';

    let value = String(commit);
    it('should start with the constructor name', () => {
      assert.equal(value.indexOf('GitCommit {'), 0);
    });

    it('should contain the instance properties', () => {
      assert.ok(value.includes('"author_email":"anonymous@secret.com"'));
      assert.ok(value.includes('"author_name":"Anonymous"'));
      assert.ok(value.includes('"id":"2ef7bde608ce5404e97d5f042f95f89f1c232871"'));
      assert.ok(value.includes('"message":"Hello World!"'));
    });
  });
});

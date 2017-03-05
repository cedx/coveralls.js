'use strict';

import {expect} from 'chai';
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
      expect(GitCommit.fromJSON('foo')).to.be.null;
    });

    it('should return an instance with default values for an empty map', () => {
      let remote = GitCommit.fromJSON({});
      expect(remote).to.be.instanceof(GitCommit);

      expect(remote.authorEmail).to.be.empty;
      expect(remote.authorName).to.be.empty;
      expect(remote.id).to.be.empty;
      expect(remote.message).to.be.empty;
    });

    it('should return an initialized instance for a non-empty map', () => {
      let remote = GitCommit.fromJSON({
        author_email: 'anonymous@secret.com',
        author_name: 'Anonymous',
        id: '2ef7bde608ce5404e97d5f042f95f89f1c232871',
        message: 'Hello World!'
      });

      expect(remote).to.be.instanceof(GitCommit);
      expect(remote.authorEmail).to.equal('anonymous@secret.com');
      expect(remote.authorName).to.equal('Anonymous');
      expect(remote.id).to.equal('2ef7bde608ce5404e97d5f042f95f89f1c232871');
      expect(remote.message).to.equal('Hello World!');
    });
  });

  /**
   * @test {GitCommit#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      let map = new GitCommit().toJSON();
      expect(Object.keys(map)).to.have.lengthOf(1);
      expect(map.id).to.be.empty;
    });

    it('should return a non-empty map for an initialized instance', () => {
      let commit = new GitCommit('2ef7bde608ce5404e97d5f042f95f89f1c232871', 'Hello World!');
      commit.authorEmail = 'anonymous@secret.com';
      commit.authorName = 'Anonymous';

      let map = commit.toJSON();
      expect(Object.keys(map)).to.have.lengthOf(4);
      expect(map.author_email).to.equal('anonymous@secret.com');
      expect(map.author_name).to.equal('Anonymous');
      expect(map.id).to.equal('2ef7bde608ce5404e97d5f042f95f89f1c232871');
      expect(map.message).to.equal('Hello World!');
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
    it('should start with the class name', () => {
      expect(value.startsWith('GitCommit {')).to.be.true;
    });

    it('should contain the instance properties', () => {
      expect(value).to.contain('"author_email":"anonymous@secret.com"')
        .and.contain('"author_name":"Anonymous"')
        .and.contain('"id":"2ef7bde608ce5404e97d5f042f95f89f1c232871"')
        .and.contain('"message":"Hello World!"');
    });
  });
});

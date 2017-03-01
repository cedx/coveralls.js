'use strict';

import {expect} from 'chai';
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
      expect(GitRemote.fromJSON('foo')).to.be.null;
    });

    it('should return an instance with default values for an empty map', () => {
      let remote = GitRemote.fromJSON({});
      expect(remote).to.be.instanceof(GitRemote);
      expect(remote.name).to.be.empty;
      expect(remote.url).to.be.empty;
    });

    it('should return an initialized instance for a non-empty map', () => {
      let remote = GitRemote.fromJSON({name: 'origin', url: 'https://github.com/cedx/coveralls.js.git'});
      expect(remote).to.be.instanceof(GitRemote);
      expect(remote.name).to.equal('origin');
      expect(remote.url).to.equal('https://github.com/cedx/coveralls.js.git');
    });
  });

  /**
   * @test {GitRemote#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      let map = new GitRemote().toJSON();
      expect(Object.keys(map)).to.have.lengthOf(2);
      expect(map.name).to.be.empty;
      expect(map.url).to.be.empty;
    });

    it('should return a non-empty map for an initialized instance', () => {
      let map = new GitRemote('origin', 'https://github.com/cedx/coveralls.js.git').toJSON();
      expect(Object.keys(map)).to.have.lengthOf(2);
      expect(map.name).to.equal('origin');
      expect(map.url).to.equal('https://github.com/cedx/coveralls.js.git');
    });
  });

  /**
   * @test {GitRemote#toString}
   */
  describe('#toString()', () => {
    let remote = String(new GitRemote('origin', 'https://github.com/cedx/coveralls.js.git'));

    it('should start with the class name', () => {
      expect(remote.indexOf('GitRemote {')).to.equal(0);
    });

    it('should contain the instance properties', () => {
      expect(remote).to.contain('"name":"origin"');
      expect(remote).to.contain('"url":"https://github.com/cedx/coveralls.js.git"');
    });
  });
});

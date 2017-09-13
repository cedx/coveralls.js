'use strict';

const {expect} = require('chai');
const {URL} = require('url');
const {GitRemote} = require('../lib');

/**
 * @test {GitRemote}
 */
describe('GitRemote', () => {

  /**
   * @test {GitRemote.fromJson}
   */
  describe('.fromJson()', () => {
    it('should return a null reference with a non-object value', () => {
      expect(GitRemote.fromJson('foo')).to.be.null;
    });

    it('should return an instance with default values for an empty map', () => {
      let remote = GitRemote.fromJson({});
      expect(remote).to.be.instanceof(GitRemote);
      expect(remote.name).to.be.empty;
      expect(remote.url).to.be.null;
    });

    it('should return an initialized instance for a non-empty map', () => {
      let remote = GitRemote.fromJson({name: 'origin', url: 'https://github.com/cedx/coveralls.js.git'});
      expect(remote).to.be.instanceof(GitRemote);
      expect(remote.name).to.equal('origin');
      expect(remote.url).to.be.instanceof(URL).and.have.property('href').that.equal('https://github.com/cedx/coveralls.js.git');
    });
  });

  /**
   * @test {GitRemote#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      let map = new GitRemote('').toJSON();
      expect(Object.keys(map)).to.have.lengthOf(2);
      expect(map.name).to.be.empty;
      expect(map.url).to.be.null;
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
      expect(remote.startsWith('GitRemote {')).to.be.true;
    });

    it('should contain the instance properties', () => {
      expect(remote).to.contain('"name":"origin"').and.contain('"url":"https://github.com/cedx/coveralls.js.git"');
    });
  });
});

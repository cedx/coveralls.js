'use strict';

const {expect} = require('chai');
const {GitCommit, GitData, GitRemote} = require('../lib/index.js');

/**
 * @test {GitData}
 */
describe('GitData', () => {

  /**
   * @test {GitData.fromJson}
   */
  describe('.fromJson()', () => {
    it('should return a null reference with a non-object value', () => {
      expect(GitData.fromJson('foo')).to.be.null;
    });

    it('should return an instance with default values for an empty map', () => {
      let data = GitData.fromJson({});
      expect(data).to.be.instanceof(GitData);
      expect(data.branch).to.be.empty;
      expect(data.commit).to.be.null;
      expect(data.remotes).to.be.an('array').and.be.empty;
    });

    it('should return an initialized instance for a non-empty map', () => {
      let data = GitData.fromJson({
        branch: 'develop',
        head: {id: '2ef7bde608ce5404e97d5f042f95f89f1c232871'},
        remotes: [{name: 'origin'}]
      });

      expect(data).to.be.instanceof(GitData);
      expect(data.branch).to.equal('develop');

      expect(data.commit).to.be.instanceof(GitCommit);
      expect(data.commit.id).to.equal('2ef7bde608ce5404e97d5f042f95f89f1c232871');

      expect(data.remotes).to.be.an('array').and.have.lengthOf(1);
      expect(data.remotes[0]).to.be.instanceof(GitRemote);
      expect(data.remotes[0].name).to.equal('origin');
    });
  });

  /**
   * @test {GitData.fromRepository}
   */
  describe('.fromRepository()', () => {
    it('should retrieve the Git data from the executable output', async () => {
      let data = await GitData.fromRepository();
      expect(data.branch).to.not.be.empty;

      expect(data.commit).to.be.instanceof(GitCommit);
      expect(data.commit.id).to.match(/^[a-f\d]{40}$/);

      expect(data.remotes).to.not.be.empty;
      expect(data.remotes[0]).to.be.instanceof(GitRemote);

      let origin = data.remotes.filter(remote => remote.name == 'origin');
      expect(origin).to.have.lengthOf(1);
      expect(origin[0].url.href).to.equal('https://github.com/cedx/coveralls.js.git');
    });
  });

  /**
   * @test {GitData#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      let map = new GitData(null).toJSON();
      expect(Object.keys(map)).to.have.lengthOf(3);
      expect(map.branch).to.be.empty;
      expect(map.head).to.be.null;
      expect(map.remotes).to.be.an('array').and.be.empty;
    });

    it('should return a non-empty map for an initialized instance', () => {
      let map = new GitData(new GitCommit('2ef7bde608ce5404e97d5f042f95f89f1c232871'), {
        branch: 'develop',
        remotes: [new GitRemote('origin')]
      }).toJSON();

      expect(Object.keys(map)).to.have.lengthOf(3);
      expect(map.branch).to.equal('develop');

      expect(map.head).to.be.an('object');
      expect(map.head.id).to.equal('2ef7bde608ce5404e97d5f042f95f89f1c232871');

      expect(map.remotes).to.be.an('array').and.have.lengthOf(1);
      expect(map.remotes[0]).to.be.an('object');
      expect(map.remotes[0].name).to.equal('origin');
    });
  });

  /**
   * @test {GitData#toString}
   */
  describe('#toString()', () => {
    let data = String(new GitData(new GitCommit('2ef7bde608ce5404e97d5f042f95f89f1c232871'), {
      branch: 'develop',
      remotes: [new GitRemote('origin')]
    }));

    it('should start with the class name', () => {
      expect(data.startsWith('GitData {')).to.be.true;
    });

    it('should contain the instance properties', () => {
      expect(data).to.contain('"branch":"develop"')
        .and.contain('"head":{')
        .and.contain('"remotes":[{');
    });
  });
});

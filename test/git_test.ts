import {expect} from 'chai';
const {GitCommit, GitData, GitRemote} from '../lib';

/**
 * @test {GitCommit}
 */
describe('GitCommit', () => {

  /**
   * @test {GitCommit.fromJson}
   */
  describe('.fromJson()', () => {
    it('should return a null reference with a non-object value', () => {
      expect(GitCommit.fromJson('foo')).to.be.null;
    });

    it('should return an instance with default values for an empty map', () => {
      let remote = GitCommit.fromJson({});
      expect(remote).to.be.instanceof(GitCommit);

      expect(remote.authorEmail).to.be.empty;
      expect(remote.authorName).to.be.empty;
      expect(remote.id).to.be.empty;
      expect(remote.message).to.be.empty;
    });

    it('should return an initialized instance for a non-empty map', () => {
      let remote = GitCommit.fromJson({
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
      let map = new GitCommit('').toJSON();
      expect(Object.keys(map)).to.have.lengthOf(1);
      expect(map.id).to.be.empty;
    });

    it('should return a non-empty map for an initialized instance', () => {
      let commit = new GitCommit('2ef7bde608ce5404e97d5f042f95f89f1c232871', {
        authorEmail: 'anonymous@secret.com',
        authorName: 'Anonymous',
        message: 'Hello World!'
      });

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
    let commit = new GitCommit('2ef7bde608ce5404e97d5f042f95f89f1c232871', {
      authorEmail: 'anonymous@secret.com',
      authorName: 'Anonymous',
      message: 'Hello World!'
    });

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

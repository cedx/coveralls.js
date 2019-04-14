/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {GitCommit, GitData, GitRemote} from '../src';

/**
 * Tests the features of the [[GitCommit]] class.
 */
@suite class GitCommitTest {

  /**
   * Tests the `GitCommit.fromJson()` method.
   */
  @test testFromJson(): void {
    // It should return an instance with default values for an empty map.
    let remote = GitCommit.fromJson({});
    expect(remote).to.be.an.instanceof(GitCommit);

    expect(remote.authorEmail).to.be.empty;
    expect(remote.authorName).to.be.empty;
    expect(remote.id).to.be.empty;
    expect(remote.message).to.be.empty;

    // It should return an initialized instance for a non-empty map.
    remote = GitCommit.fromJson({
      author_email: 'anonymous@secret.com',
      author_name: 'Anonymous',
      id: '2ef7bde608ce5404e97d5f042f95f89f1c232871',
      message: 'Hello World!'
    });

    expect(remote).to.be.an.instanceof(GitCommit);
    expect(remote.authorEmail).to.equal('anonymous@secret.com');
    expect(remote.authorName).to.equal('Anonymous');
    expect(remote.id).to.equal('2ef7bde608ce5404e97d5f042f95f89f1c232871');
    expect(remote.message).to.equal('Hello World!');
  }

  /**
   * Tests the `GitCommit#toJSON()` method.
   */
  @test testToJson(): void {
    // It should return a map with default values for a newly created instance.
    let map = new GitCommit('').toJSON();
    expect(Object.keys(map)).to.have.lengthOf(1);
    expect(map.id).to.be.empty;

    // It should return a non-empty map for an initialized instance.
    const commit = new GitCommit('2ef7bde608ce5404e97d5f042f95f89f1c232871', {
      authorEmail: 'anonymous@secret.com',
      authorName: 'Anonymous',
      message: 'Hello World!'
    });

    map = commit.toJSON();
    expect(Object.keys(map)).to.have.lengthOf(4);
    expect(map.author_email).to.equal('anonymous@secret.com');
    expect(map.author_name).to.equal('Anonymous');
    expect(map.id).to.equal('2ef7bde608ce5404e97d5f042f95f89f1c232871');
    expect(map.message).to.equal('Hello World!');
  }
}

/**
 * Tests the features of the [[GitData]] class.
 */
@suite class GitDataTest {

  /**
   * Tests the `GitData.fromJson()` method.
   */
  @test testFromJson(): void {
    // It should return an instance with default values for an empty map.
    let data = GitData.fromJson({});
    expect(data).to.be.an.instanceof(GitData);
    expect(data.branch).to.be.empty;
    expect(data.commit).to.be.null;
    expect(data.remotes).to.be.an('array').and.be.empty;

    // It should return an initialized instance for a non-empty map.
    data = GitData.fromJson({
      branch: 'develop',
      head: {id: '2ef7bde608ce5404e97d5f042f95f89f1c232871'},
      remotes: [{name: 'origin'}]
    });

    expect(data).to.be.an.instanceof(GitData);
    expect(data.branch).to.equal('develop');

    expect(data.commit).to.be.an.instanceof(GitCommit);
    expect(data.commit!.id).to.equal('2ef7bde608ce5404e97d5f042f95f89f1c232871');

    expect(data.remotes).to.be.an('array').and.have.lengthOf(1);
    expect(data.remotes[0]).to.be.an.instanceof(GitRemote);
    expect(data.remotes[0].name).to.equal('origin');
  }

  /**
   * Tests the `GitData.fromRepository()` method.
   */
  @test async testFromRepository(): Promise<void> {
    // It should retrieve the Git data from the executable output.
    const data = await GitData.fromRepository();
    expect(data.branch).to.not.be.empty;

    expect(data.commit).to.be.an.instanceof(GitCommit);
    expect(data.commit!.id).to.match(/^[a-f\d]{40}$/);

    expect(data.remotes).to.not.be.empty;
    expect(data.remotes[0]).to.be.an.instanceof(GitRemote);

    const origin = data.remotes.filter(remote => remote.name == 'origin');
    expect(origin).to.have.lengthOf(1);
    expect(origin[0].url!.href).to.be.oneOf([
      'https://github.com/cedx/coveralls.js.git',
      'ssh://git@github.com/cedx/coveralls.js.git'
    ]);
  }

  /**
   * Tests the `GitData#toJSON()` method.
   */
  @test testToJson(): void {
    // It should return a map with default values for a newly created instance.
    let map = new GitData(null).toJSON();
    expect(Object.keys(map)).to.have.lengthOf(3);
    expect(map.branch).to.be.empty;
    expect(map.head).to.be.null;
    expect(map.remotes).to.be.an('array').and.be.empty;

    // It should return a non-empty map for an initialized instance.
    map = new GitData(new GitCommit('2ef7bde608ce5404e97d5f042f95f89f1c232871'), {
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
  }
}

/**
 * Tests the features of the [[GitRemote]] class.
 */
@suite class GitRemoteTest {

  /**
   * Tests the `GitRemote.fromJson()` method.
   */
  @test testFromJson(): void {
    // It should return an instance with default values for an empty map.
    let remote = GitRemote.fromJson({});
    expect(remote).to.be.an.instanceof(GitRemote);
    expect(remote.name).to.be.empty;
    expect(remote.url).to.be.null;

    // It should return an initialized instance for a non-empty map.
    remote = GitRemote.fromJson({name: 'origin', url: 'git@github.com:cedx/coveralls.js.git'});
    expect(remote).to.be.an.instanceof(GitRemote);
    expect(remote.name).to.equal('origin');
    expect(remote.url).to.be.an.instanceof(URL).and.have.property('href').that.equal('ssh://git@github.com/cedx/coveralls.js.git');

    remote = GitRemote.fromJson({name: 'origin', url: 'https://github.com/cedx/coveralls.js.git'});
    expect(remote.url).to.be.an.instanceof(URL).and.have.property('href').that.equal('https://github.com/cedx/coveralls.js.git');
  }

  /**
   * Tests the `GitRemote#toJSON()` method.
   */
  @test testToJson(): void {
    // It should return a map with default values for a newly created instance.
    let map = new GitRemote('').toJSON();
    expect(Object.keys(map)).to.have.lengthOf(2);
    expect(map.name).to.be.empty;
    expect(map.url).to.be.null;

    // It should return a non-empty map for an initialized instance.
    map = new GitRemote('origin', 'git@github.com:cedx/coveralls.js.git').toJSON();
    expect(Object.keys(map)).to.have.lengthOf(2);
    expect(map.name).to.equal('origin');
    expect(map.url).to.equal('ssh://git@github.com/cedx/coveralls.js.git');

    map = new GitRemote('origin', new URL('https://github.com/cedx/coveralls.js.git')).toJSON();
    expect(map.url).to.equal('https://github.com/cedx/coveralls.js.git');
  }
}

/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {GitData, Job, SourceFile} from '../src';

/**
 * Tests the features of the `Job` class.
 */
@suite class JobTest {

  /**
   * Tests the `Job.fromJson()` method.
   */
  @test testFromJson(): void {
    // It should return an instance with default values for an empty map.
    let job = Job.fromJson({});
    expect(job).to.be.an.instanceof(Job);

    expect(job.git).to.be.null;
    expect(job.isParallel).to.be.false;
    expect(job.repoToken).to.be.empty;
    expect(job.runAt).to.be.null;
    expect(job.sourceFiles).to.be.an('array').and.be.empty;

    // It should return an initialized instance for a non-empty map.
    job = Job.fromJson({
      git: {branch: 'develop'},
      parallel: true,
      repo_token: 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt',
      run_at: '2017-01-29T02:43:30.000Z',
      source_files: [{name: '/home/cedx/coveralls.js'}]
    });

    expect(job).to.be.an.instanceof(Job);
    expect(job.isParallel).to.be.true;
    expect(job.repoToken).to.equal('yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');

    expect(job.git).to.be.an.instanceof(GitData);
    expect(job.git!.branch).to.equal('develop');

    expect(job.runAt).to.be.an.instanceof(Date);
    expect(job.runAt!.toISOString()).to.equal('2017-01-29T02:43:30.000Z');

    expect(job.sourceFiles).to.be.an('array').and.have.lengthOf(1);
    expect(job.sourceFiles[0]).to.be.an.instanceof(SourceFile);
    expect(job.sourceFiles[0].name).to.equal('/home/cedx/coveralls.js');
  }

  /**
   * Tests the `Job#toJSON()` method.
   */
  @test testToJson(): void {
    // It should return a map with default values for a newly created instance.
    let map = (new Job).toJSON();
    expect(Object.keys(map)).to.have.lengthOf(1);
    expect(map.source_files).to.be.an('array').and.be.empty;

    // It should return a non-empty map for an initialized instance.
    const job = new Job({repoToken: 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt'});
    job.git = new GitData(null, {branch: 'develop'});
    job.isParallel = true;
    job.runAt = new Date('2017-01-29T02:43:30.000Z');
    job.sourceFiles.push(new SourceFile('/home/cedx/coveralls.js', ''));

    map = job.toJSON();
    expect(Object.keys(map)).to.have.lengthOf(5);
    expect(map.parallel).to.be.true;
    expect(map.repo_token).to.equal('yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');
    expect(map.run_at).to.equal('2017-01-29T02:43:30.000Z');

    expect(map).to.be.an('object');
    expect(map.git.branch).to.equal('develop');

    expect(map.source_files).to.be.an('array').and.have.lengthOf(1);
    expect(map.source_files[0]).to.be.an('object');
    expect(map.source_files[0].name).to.equal('/home/cedx/coveralls.js');
  }
}

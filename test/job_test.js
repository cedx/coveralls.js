'use strict';

import {expect} from 'chai';
import {GitData, Job, SourceFile} from '../src/index';

/**
 * @test {Job}
 */
describe('Job', () => {

  /**
   * @test {Job.fromJSON}
   */
  describe('.fromJSON()', () => {
    it('should return a null reference with a non-object value', () => {
      expect(Job.fromJSON('foo')).to.be.null;
    });

    it('should return an instance with default values for an empty map', () => {
      let job = Job.fromJSON({});
      expect(job).to.be.instanceof(Job);
      expect(job.git).to.be.null;
      expect(job.isParallel).to.be.false;
      expect(job.repoToken).to.be.empty;
      expect(job.runAt).to.be.null;
      expect(job.sourceFiles).to.be.an('array').and.be.empty;
    });

    it('should return an initialized instance for a non-empty map', () => {
      let job = Job.fromJSON({
        git: {branch: 'develop'},
        parallel: true,
        repo_token: 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt',
        run_at: '2017-01-29T02:43:30.000Z',
        source_files: [{name: '/home/cedx/coveralls.php'}]
      });

      expect(job).to.be.instanceof(Job);
      expect(job.isParallel).to.be.true;
      expect(job.repoToken).to.equal('yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');

      expect(job.git).to.be.instanceof(GitData);
      expect(job.git.branch).to.equal('develop');

      expect(job.runAt).to.be.instanceof(Date);
      expect(job.runAt.toISOString()).to.equal('2017-01-29T02:43:30.000Z');

      expect(job.sourceFiles).to.be.an('array').and.have.lengthOf(1);
      expect(job.sourceFiles[0]).to.be.instanceof(SourceFile);
      expect(job.sourceFiles[0].name).to.equal('/home/cedx/coveralls.php');
    });
  });

  /**
   * @test {Job#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      let map = new Job().toJSON();
      expect(Object.keys(map)).to.have.lengthOf(1);
      expect(map.source_files).to.be.an('array').and.be.empty;
    });

    it('should return a non-empty map for an initialized instance', () => {
      let job = new Job();
      job.git = new GitData(null, 'develop');
      job.isParallel = true;
      job.repoToken = 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt';
      job.runAt = new Date('2017-01-29T02:43:30.000Z');
      job.sourceFiles = [new SourceFile('/home/cedx/coveralls.php')];

      let map = job.toJSON();
      expect(Object.keys(map)).to.have.lengthOf(5);
      expect(map.parallel).to.be.true;
      expect(map.repo_token).to.equal('yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');
      expect(map.run_at).to.equal('2017-01-29T02:43:30.000Z');

      expect(map).to.be.an('object');
      expect(map.git.branch).to.equal('develop');

      expect(map.source_files).to.be.an('array').and.have.lengthOf(1);
      expect(map.source_files[0]).to.be.an('object');
      expect(map.source_files[0].name).to.equal('/home/cedx/coveralls.php');
    });
  });

  /**
   * @test {Job#toString}
   */
  describe('#toString()', () => {
    let job = new Job();
    job.git = new GitData(null, 'develop');
    job.isParallel = true;
    job.repoToken = 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt';
    job.runAt = new Date('2017-01-29T02:43:30.000Z');
    job.sourceFiles = [new SourceFile('/home/cedx/coveralls.php')];

    let value = String(job);
    it('should start with the class name', () => {
      expect(value.indexOf('Job {')).to.equal(0);
    });

    it('should contain the instance properties', () => {
      expect(value).to.contain('"git":{')
        .and.contain('"parallel":true')
        .and.contain('"repo_token":"yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt"')
        .and.contain('"run_at":"2017-01-29T02:43:30.000Z"')
        .and.contain('"source_files":[{');
    });
  });
});

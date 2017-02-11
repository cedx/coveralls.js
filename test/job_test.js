'use strict';

import assert from 'assert';
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
      assert.strictEqual(Job.fromJSON('foo'), null);
    });

    it('should return an instance with default values for an empty map', () => {
      let job = Job.fromJSON({});
      assert.ok(job instanceof Job);
      assert.equal(job.git, null);
      assert.ok(!job.isParallel);
      assert.equal(job.repoToken, '');
      assert.equal(job.runAt, null);

      assert.ok(Array.isArray(job.sourceFiles));
      assert.equal(job.sourceFiles.length, 0);
    });

    it('should return an initialized instance for a non-empty map', () => {
      let job = Job.fromJSON({
        git: {branch: 'develop'},
        parallel: true,
        repo_token: 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt',
        run_at: '2017-01-29T02:43:30.000Z',
        source_files: [{name: '/home/cedx/coveralls.php'}]
      });

      assert.ok(job instanceof Job);
      assert.ok(job.isParallel);
      assert.equal(job.repoToken, 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');

      assert.ok(job.git instanceof GitData);
      assert.equal(job.git.branch, 'develop');

      assert.ok(job.runAt instanceof Date);
      assert.equal(job.runAt.toISOString(), '2017-01-29T02:43:30.000Z');

      assert.ok(Array.isArray(job.sourceFiles));
      assert.equal(job.sourceFiles.length, 1);
      assert.ok(job.sourceFiles[0] instanceof SourceFile);
      assert.equal(job.sourceFiles[0].name, '/home/cedx/coveralls.php');
    });
  });

  /**
   * @test {Job#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      let map = new Job().toJSON();
      assert.equal(Object.keys(map).length, 1);

      assert.ok(Array.isArray(map.source_files));
      assert.equal(map.source_files.length, 0);
    });

    it('should return a non-empty map for an initialized instance', () => {
      let job = new Job();
      job.git = new GitData(null, 'develop');
      job.isParallel = true;
      job.repoToken = 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt';
      job.runAt = new Date('2017-01-29T02:43:30.000Z');
      job.sourceFiles = [new SourceFile('/home/cedx/coveralls.php')];

      let map = job.toJSON();
      assert.equal(Object.keys(map).length, 5);
      assert.ok(map.parallel);
      assert.equal(map.repo_token, 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');
      assert.equal(map.run_at, '2017-01-29T02:43:30.000Z');

      assert.ok(map && typeof map.git == 'object');
      assert.equal(map.git.branch, 'develop');

      assert.ok(Array.isArray(map.source_files));
      assert.equal(map.source_files.length, 1);
      assert.ok(map.source_files[0] && typeof map.source_files[0] == 'object');
      assert.equal(map.source_files[0].name, '/home/cedx/coveralls.php');
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
    it('should start with the constructor name', () => {
      assert.equal(value.indexOf('Job {'), 0);
    });

    it('should contain the instance properties', () => {
      assert.ok(value.includes('"git":{'));
      assert.ok(value.includes('"parallel":true'));
      assert.ok(value.includes('"repo_token":"yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt"'));
      assert.ok(value.includes('"run_at":"2017-01-29T02:43:30.000Z"'));
      assert.ok(value.includes('"source_files":[{'));
    });
  });
});

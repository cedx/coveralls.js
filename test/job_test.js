import {strict as assert} from 'assert';
import {GitData, Job, SourceFile} from '../lib/index.js';

/** Tests the features of the {@link Job} class. */
describe('Job', () => {
  describe('.fromJson()', () => {
    it('should return an instance with default values for an empty map', () => {
      const job = Job.fromJson({});
      assert.equal(job.git, undefined);
      assert.equal(job.isParallel, false);
      assert.equal(job.repoToken.length, 0);
      assert.equal(job.runAt, undefined);
      assert.equal(job.sourceFiles.length, 0);
    });

    it('should return an initialized instance for a non-empty map', () => {
      const job = Job.fromJson({
        git: {branch: 'develop'},
        parallel: true,
        repo_token: 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt',
        run_at: '2017-01-29T02:43:30.000Z',
        source_files: [{name: '/home/cedx/coveralls.js'}]
      });

      assert(job.isParallel);
      assert.equal(job.repoToken, 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');

      assert(job.git instanceof GitData);
      assert.equal(job.git.branch, 'develop');

      assert(job.runAt instanceof Date);
      assert.equal(job.runAt.toISOString(), '2017-01-29T02:43:30.000Z');

      assert.equal(job.sourceFiles.length, 1);
      assert(job.sourceFiles[0] instanceof SourceFile);
      assert.equal(job.sourceFiles[0].name, '/home/cedx/coveralls.js');
    });
  });

  describe('.toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      const map = new Job().toJSON();
      assert.equal(Object.keys(map).length, 1);
      assert(Array.isArray(map.source_files));
      assert.equal(map.source_files.length, 0);
    });

    it('should return a non-empty map for an initialized instance', () => {
      const job = new Job({repoToken: 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt'});
      job.git = new GitData(undefined, {branch: 'develop'});
      job.isParallel = true;
      job.runAt = new Date('2017-01-29T02:43:30.000Z');
      job.sourceFiles.push(new SourceFile('/home/cedx/coveralls.js', ''));

      const map = job.toJSON();
      assert.equal(Object.keys(map).length, 5);
      assert(map.parallel);
      assert.equal(map.repo_token, 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');
      assert.equal(map.run_at, '2017-01-29T02:43:30.000Z');

      assert.ok(map);
      assert.equal(typeof map, 'object');
      assert.equal(map.git.branch, 'develop');

      assert(Array.isArray(map.source_files));
      assert.equal(map.source_files.length, 1);
      assert.ok(map.source_files[0]);
      assert.equal(typeof map.source_files[0], 'object');
      assert.equal(map.source_files[0].name, '/home/cedx/coveralls.js');
    });
  });
});

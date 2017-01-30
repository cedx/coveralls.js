'use strict';

import assert from 'assert';
import {Client} from '../src/index';

/**
 * @test {Client}
 */
describe('Client', () => {

  /**
   * @test {Client#constructor}
   */
  describe('#constructor()', () => {
    /*
    it('should have the expected default values when not initialized', () => {
      let job = new Client();
      assert.strictEqual(job.git, null);
      assert.ok(!job.isParallel);
      assert.equal(job.repoToken, '');
      assert.strictEqual(job.runAt, null);

      assert.ok(Array.isArray(job.sourceFiles));
      assert.equal(job.sourceFiles.length, 0);
    });

    it('should have the expected values when initialized', () => {
      let job = new Client(new Configuration({
        parallel: 'true',
        repo_token: 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt',
        run_at: '2017-01-29T02:43:30.000Z',
        service_branch: 'develop'
      }), [new SourceFile('/home/cedx/coveralls.php')]);

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
    */
  });
});

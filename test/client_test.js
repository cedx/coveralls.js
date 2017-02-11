'use strict';

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import {Client, Configuration, GitData, Job, SourceFile} from '../src/index';

/**
 * @test {Client}
 */
describe('Client', () => {

  /**
   * @test {Client#upload}
   */
  describe('#upload()', () =>
    new Client().upload('').then(
      () => assert.fail(Promise.resolve(), Promise.reject(), 'An empty coverage should reject the promise.'),
      err => assert.ok(err instanceof Error)
    )
  );

  /**
   * @test {Client#uploadJob}
   */
  describe('#uploadJob()', () =>
    new Client().uploadJob(new Job()).then(
      () => assert.fail(Promise.resolve(), Promise.reject(), 'An empty job should reject the promise.'),
      err => assert.ok(err instanceof Error)
    )
  );

  /**
   * @test {Client#_parseReport}
   */
  describe('#_parseReport()', () =>
    /* eslint-disable no-sync */
    new Client()._parseReport(fs.readFileSync(`${__dirname}/fixtures/lcov.info`, 'utf8')).then(job => {
      assert.ok(Array.isArray(job.sourceFiles));
      assert.equal(job.sourceFiles.length, 3);

      assert.ok(job.sourceFiles[0] instanceof SourceFile);
      assert.equal(job.sourceFiles[0].name, path.join('src', 'client.js'));
      assert.ok(job.sourceFiles[0].sourceDigest.length);

      let isSubset = (set, values) => set.every(value => values.includes(value));
      let subset = [null, 2, 2, 2, 2, null];
      assert.ok(isSubset(subset, job.sourceFiles[0].coverage));

      assert.equal(job.sourceFiles[1].name, path.join('src', 'configuration.js'));
      assert.ok(job.sourceFiles[1].sourceDigest.length);

      subset = [null, 4, 4, 2, 2, 4, 2, 2, 4, 4, null];
      assert.ok(isSubset(subset, job.sourceFiles[1].coverage));

      assert.equal(job.sourceFiles[2].name, path.join('src', 'git_commit.js'));
      assert.ok(job.sourceFiles[2].sourceDigest.length);

      subset = [null, 2, 2, 2, 2, 2, 0, 0, 2, 2, null];
      assert.ok(isSubset(subset, job.sourceFiles[2].coverage));
    },
    err => assert.ifError(err))
    /* eslint-enable no-sync */
  );

  /**
   * @test {Client#_updateJob}
   */
  describe('#_updateJob()', () => {
    let client = new Client();
    let job = new Job();

    client._updateJob(job, new Configuration());
    assert.strictEqual(job.git, null);
    assert.ok(!job.isParallel);
    assert.equal(job.repoToken, '');
    assert.strictEqual(job.runAt, null);

    client._updateJob(job, new Configuration({
      parallel: 'true',
      repo_token: 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt',
      run_at: '2017-01-29T02:43:30.000Z',
      service_branch: 'develop'
    }));

    assert.ok(job.isParallel);
    assert.equal(job.repoToken, 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');

    assert.ok(job.git instanceof GitData);
    assert.equal(job.git.branch, 'develop');

    assert.ok(job.runAt instanceof Date);
    assert.equal(job.runAt.toISOString(), '2017-01-29T02:43:30.000Z');
  });
});

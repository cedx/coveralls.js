'use strict';

import assert from 'assert';
import fs from 'fs';
import {Client, Configuration, Job, SourceFile} from '../src/index';

/**
 * @test {Client}
 */
describe('Client', () => {

  /**
   * @test {Client#upload}
   */
  describe('#upload()', () => {
    new Client().upload('').then(
      () => assert.fail(true, false, 'An empty coverage should reject the promise.'),
      err => assert.ok(err instanceof Error)
    );
  });

  /**
   * @test {Client#uploadJob}
   */
  describe('#upload()', () => {
    new Client().uploadJob(new Job()).then(
      () => assert.fail(true, false, 'An empty job should reject the promise.'),
      err => assert.ok(err instanceof Error)
    );
  });

  /**
   * @test {Client#_parseReport}
   */
  describe('#_parseReport()', () => {
    new Client()._parseReport(fs.readFileSync(`${__dirname}/fixtures/lcov.info`, 'utf8')).then(job => {
      assert.ok(Array.isArray(job.sourceFiles));
      assert.equal(job.sourceFiles.length, 3);

      assert.ok(job.sourceFiles[0] instanceof SourceFile);
      assert.equal(job.sourceFiles[0].name, 'src/client.js');
      assert.ok(job.sourceFiles[0].sourceDigest.length);

      let isSubset = (set, values) => set.every(value => values.includes(value));
      let subset = [null, 2, 2, 2, 2, null];
      assert.ok(isSubset(subset, job.sourceFiles[0].coverage));

      assert.equal(job.sourceFiles[1].name, 'src/configuration.js');
      assert.ok(job.sourceFiles[1].sourceDigest.length);

      subset = [null, 4, 4, 2, 2, 4, 2, 2, 4, 4, null];
      assert.ok(isSubset(subset, job.sourceFiles[1].coverage));

      assert.equal(job.sourceFiles[2].name, 'src/git_commit.js');
      assert.ok(job.sourceFiles[2].sourceDigest.length);

      subset = [null, 2, 2, 2, 2, 2, 0, 0, 2, 2, null];
      assert.ok(isSubset(subset, job.sourceFiles[2].coverage));
    },
    err => assert.ifError(err));
  });

  /**
   * @test {Client#_updateJob}
   */
  describe('#_updateJob()', () => {
    /*
    let client = new Client();
    let job = new Job();

    updateJob.call(client, job, new Configuration());
    assert.Null(job.getGit());
    assert.False(job.isParallel());
    assert.Empty(job.getRepoToken());
    assert.Null(job.getRunAt());

    updateJob.call(client, job, new Configuration([
      'parallel' => 'true',
      'repo_token' => 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt',
      'run_at' => '2017-01-29T03:43:30+01:00',
      'service_branch' => 'develop'
    ]));

    assert.True(job.isParallel());
    assert.equal('yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt', job.getRepoToken());

    git = job.getGit();
    assert.ok(GitData::class, git);
    assert.equal('develop', git.getBranch());

    runAt = job.getRunAt();
    assert.ok(\DateTime::class, runAt);
    assert.equal('2017-01-29T03:43:30+01:00', runAt.format('c'));
    */
  });
});

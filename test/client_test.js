'use strict';

import {expect} from 'chai';
import {readFile} from 'fs';
import {describe, it} from 'mocha';
import {join} from 'path';
import {Client, Configuration, GitData, Job, SourceFile} from '../src/index';

/**
 * @test {Client}
 */
describe('Client', () => {

  /**
   * @test {Client#upload}
   */
  describe('#upload()', () => {
    it('should throw an error with an empty coverage report', async () => {
      try {
        await (new Client).upload('');
        expect(true).to.not.be.ok;
      }

      catch (err) {
        expect(true).to.be.ok;
      }
    });
  });

  /**
   * @test {Client#uploadJob}
   */
  describe('#uploadJob()', () => {
    it('should throw an error with an empty coverage job', async () => {
      try {
        await (new Client).uploadJob(new Job);
        expect(true).to.not.be.ok;
      }

      catch (err) {
        expect(true).to.be.ok;
      }
    });
  });

  /**
   * @test {Client#_parseReport}
   */
  describe('#_parseReport()', () => {
    it('should properly parse LCOV reports', async () => {
      const loadReport = file => new Promise(resolve => readFile(file, 'utf8', (err, data) => resolve(err ? '' : data)));
      let coverage = await loadReport(`${__dirname}/fixtures/lcov.info`);

      let job = await (new Client)._parseReport(coverage);
      expect(job.sourceFiles).to.be.an('array').and.have.lengthOf(3);

      expect(job.sourceFiles[0]).to.be.instanceof(SourceFile);
      expect(job.sourceFiles[0].name).to.equal(join('src', 'client.js'));
      expect(job.sourceFiles[0].sourceDigest).to.not.be.empty;

      let subset = [null, 2, 2, 2, 2, null];
      expect(job.sourceFiles[0].coverage).to.include.members(subset);

      expect(job.sourceFiles[1].name).to.equal(join('src', 'configuration.js'));
      expect(job.sourceFiles[1].sourceDigest).to.not.be.empty;

      subset = [null, 4, 4, 2, 2, 4, 2, 2, 4, 4, null];
      expect(job.sourceFiles[1].coverage).to.include.members(subset);

      expect(job.sourceFiles[2].name).to.equal(join('src', 'git_commit.js'));
      expect(job.sourceFiles[2].sourceDigest).to.not.be.empty;

      subset = [null, 2, 2, 2, 2, 2, 0, 0, 2, 2, null];
      expect(job.sourceFiles[2].coverage).to.include.members(subset);
    });
  });

  /**
   * @test {Client#_updateJob}
   */
  describe('#_updateJob()', () => {
    let client = new Client;
    let job = new Job;

    it('should not modify the job if the configuration is empty', () => {
      client._updateJob(job, new Configuration);
      expect(job.git).to.be.null;
      expect(job.isParallel).to.be.false;
      expect(job.repoToken).to.be.empty;
      expect(job.runAt).to.be.null;
    });

    it('should modify the job if the configuration is not empty', () => {
      client._updateJob(job, new Configuration({
        parallel: 'true',
        repo_token: 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt',
        run_at: '2017-01-29T02:43:30.000Z',
        service_branch: 'develop'
      }));

      expect(job.isParallel).to.be.true;
      expect(job.repoToken).to.equal('yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');

      expect(job.git).to.be.instanceof(GitData);
      expect(job.git.branch).to.equal('develop');

      expect(job.runAt).to.be.instanceof(Date);
      expect(job.runAt.toISOString()).to.equal('2017-01-29T02:43:30.000Z');
    });
  });
});

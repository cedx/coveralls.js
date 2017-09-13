'use strict';

const {expect} = require('chai');
const {readFile} = require('fs');
const {join} = require('path');
const {promisify} = require('util');
const {Client, Configuration, GitData, Job, SourceFile} = require('../lib');

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

    it('should throw an error with an invalid coverage report', async () => {
      try {
        await (new Client).upload('end_of_record');
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
      const loadReport = promisify(readFile);
      let coverage = await loadReport('test/fixtures/lcov.info', 'utf8');

      let job = await (new Client)._parseReport(coverage);
      expect(job.sourceFiles).to.be.an('array').and.have.lengthOf(3);

      expect(job.sourceFiles[0]).to.be.instanceof(SourceFile);
      expect(job.sourceFiles[0].name).to.equal(join('lib', 'client.js'));
      expect(job.sourceFiles[0].sourceDigest).to.not.be.empty;

      let subset = [null, 2, 2, 2, 2, null];
      expect(job.sourceFiles[0].coverage).to.include.members(subset);

      expect(job.sourceFiles[1].name).to.equal(join('lib', 'configuration.js'));
      expect(job.sourceFiles[1].sourceDigest).to.not.be.empty;

      subset = [null, 4, 4, 2, 2, 4, 2, 2, 4, 4, null];
      expect(job.sourceFiles[1].coverage).to.include.members(subset);

      expect(job.sourceFiles[2].name).to.equal(join('lib', 'git_commit.js'));
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

    it('should not modify the job if the configuration is empty', () => {
      let job = new Job;
      client._updateJob(job, new Configuration);
      expect(job.git).to.be.null;
      expect(job.isParallel).to.be.false;
      expect(job.repoToken).to.be.empty;
      expect(job.runAt).to.be.null;
    });

    it('should modify the job if the configuration is not empty', () => {
      let job = new Job;
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
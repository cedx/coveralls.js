'use strict';

const {expect} = require('chai');
const {Client, Configuration, GitData, Job} = require('../lib/index.js');

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
        expect.fail('Error not thrown');
      }

      catch (err) {
        expect(true).to.be.ok;
      }
    });

    it('should throw an error with an invalid coverage report', async () => {
      try {
        await (new Client).upload('end_of_record');
        expect.fail('Error not thrown');
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
        expect.fail('Error not thrown');
      }

      catch (err) {
        expect(true).to.be.ok;
      }
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

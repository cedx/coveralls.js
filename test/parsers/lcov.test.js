'use strict';

const {expect} = require('chai');
const {readFile} = require('fs');
const {join} = require('path');
const {promisify} = require('util');

const {SourceFile} = require('../../lib');
const {parseReport} = require('../../lib/parsers/lcov');

describe('Lcov', () => {

  /**
   * @test {parseReport}
   */
  describe('parseReport()', () => {
    it('should properly parse LCOV reports', async () => {
      const loadReport = promisify(readFile);

      let job = await parseReport(await loadReport('test/fixtures/lcov.info', 'utf8'));
      expect(job.sourceFiles).to.be.an('array').and.have.lengthOf(3);

      expect(job.sourceFiles[0]).to.be.instanceof(SourceFile);
      expect(job.sourceFiles[0].name).to.equal(join('lib', 'client.js'));
      expect(job.sourceFiles[0].sourceDigest).to.not.be.empty;
      expect(job.sourceFiles[0].coverage).to.include.members([null, 2, 2, 2, 2, null]);

      expect(job.sourceFiles[1].name).to.equal(join('lib', 'configuration.js'));
      expect(job.sourceFiles[1].sourceDigest).to.not.be.empty;
      expect(job.sourceFiles[1].coverage).to.include.members([null, 4, 4, 2, 2, 4, 2, 2, 4, 4, null]);

      expect(job.sourceFiles[2].name).to.equal(join('lib', 'git_commit.js'));
      expect(job.sourceFiles[2].sourceDigest).to.not.be.empty;
      expect(job.sourceFiles[2].coverage).to.include.members([null, 2, 2, 2, 2, 2, 0, 0, 2, 2, null]);
    });
  });
});
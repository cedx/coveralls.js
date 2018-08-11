import {expect} from 'chai';
const {promises} from 'fs');
const {join} from 'path');

const {SourceFile} from '../../lib';
const {parseReport} from '../../lib/parsers/lcov.js');

describe('Lcov', () => {

  /**
   * @test {parseReport}
   */
  describe('parseReport()', () => {
    it('should properly parse LCOV reports', async () => {
      const job = await parseReport(await promises.readFile('test/fixtures/lcov.info', 'utf8'));
      expect(job.sourceFiles).to.be.an('array').and.have.lengthOf(3);

      expect(job.sourceFiles[0]).to.be.instanceof(SourceFile);
      expect(job.sourceFiles[0].name).to.equal(join('lib', 'client.js'));
      expect(job.sourceFiles[0].sourceDigest).to.not.be.empty;
      expect(job.sourceFiles[0].coverage).to.include.members([null, 2, 2, 2, 2, null]);

      expect(job.sourceFiles[1].name).to.equal(join('lib', 'configuration.js'));
      expect(job.sourceFiles[1].sourceDigest).to.not.be.empty;
      expect(job.sourceFiles[1].coverage).to.include.members([null, 4, 4, 2, 2, 4, 2, 2, 4, 4, null]);

      expect(job.sourceFiles[2].name).to.equal(join('lib', 'git.js'));
      expect(job.sourceFiles[2].sourceDigest).to.not.be.empty;
      expect(job.sourceFiles[2].coverage).to.include.members([null, 2, 2, 2, 2, 2, 0, 0, 2, 2, null]);
    });
  });
});

import * as chai from 'chai';
import {promises} from 'fs';
import {join} from 'path';

import {SourceFile} from '../../src/index';
import {parseReport} from '../../src/io/parsers/lcov';

/** Tests the features of the LCOV parser. */
describe('Lcov', () => {
  const {expect} = chai;

  describe('parseReport()', () => {
    it('should properly parse LCOV reports', async () => {
      const job = await parseReport(await promises.readFile('test/fixtures/lcov.info', 'utf8'));
      expect(job.sourceFiles).to.be.an('array').and.have.lengthOf(3);

      expect(job.sourceFiles[0]).to.be.an.instanceof(SourceFile);
      expect(job.sourceFiles[0].name).to.equal(join('src', 'io', 'client.ts'));
      expect(job.sourceFiles[0].sourceDigest).to.not.be.empty;
      expect(job.sourceFiles[0].branches).to.be.empty;
      expect(job.sourceFiles[0].coverage).to.include.members([null, 2, 2, 2, 2, null]);

      expect(job.sourceFiles[1].name).to.equal(join('src', 'io', 'configuration.ts'));
      expect(job.sourceFiles[1].sourceDigest).to.not.be.empty;
      expect(job.sourceFiles[1].branches).to.include.members([8, 0, 0, 2, 8, 0, 1, 2, 11, 0, 0, 2, 11, 0, 1, 2]);
      expect(job.sourceFiles[1].coverage).to.include.members([null, 4, 4, 2, 2, 4, 2, 2, 4, 4, null]);

      expect(job.sourceFiles[2].name).to.equal(join('src', 'io', 'git.ts'));
      expect(job.sourceFiles[2].sourceDigest).to.not.be.empty;
      expect(job.sourceFiles[2].branches).to.include.members([8, 0, 0, 2, 8, 0, 1, 0, 11, 0, 0, 0, 11, 0, 1, 2]);
      expect(job.sourceFiles[2].coverage).to.include.members([null, 2, 2, 2, 2, 2, 0, 0, 2, 2, null]);
    });
  });
});

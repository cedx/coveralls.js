/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {promises} from 'fs';
import {suite, test} from 'mocha-typescript';
import {join} from 'path';

import {SourceFile} from '../../src';
import {parseReport} from '../../src/parsers/clover';

/**
 * Tests the features of the Clover parser.
 */
@suite class CloverTest {

  /**
   * @test {parseReport}
   */
  @test public async parseReport(): Promise<void> {
    // It should properly parse Clover reports.
    const job = await parseReport(await promises.readFile('test/fixtures/clover.xml', 'utf8'));
    expect(job.sourceFiles).to.be.an('array').and.have.lengthOf(3);

    expect(job.sourceFiles[0]).to.be.instanceof(SourceFile);
    expect(job.sourceFiles[0].name).to.equal(join('src', 'client.ts'));
    expect(job.sourceFiles[0].sourceDigest).to.not.be.empty;
    expect(job.sourceFiles[0].coverage).to.include.members([null, 2, 2, 2, 2, null]);

    expect(job.sourceFiles[1].name).to.equal(join('src', 'configuration.ts'));
    expect(job.sourceFiles[1].sourceDigest).to.not.be.empty;
    expect(job.sourceFiles[1].coverage).to.include.members([null, 4, 4, 2, 2, 4, 2, 2, 4, 4, null]);

    expect(job.sourceFiles[2].name).to.equal(join('src', 'git.ts'));
    expect(job.sourceFiles[2].sourceDigest).to.not.be.empty;
    expect(job.sourceFiles[2].coverage).to.include.members([null, 2, 2, 2, 2, 2, 0, 0, 2, 2, null]);

    // It should throw an excepton if the Clover report is invalid.
    try {
      await parseReport('<coverage><foo /></coverage>');
      expect.fail('Error not thrown');
    }

    catch (err) {
      expect(err).to.be.instanceof(TypeError);
    }
  }
}

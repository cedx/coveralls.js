import {strict as assert} from 'assert';
import {promises} from 'fs';
import {join} from 'path';
import {SourceFile} from '../../lib/index.js';
import {parseReport} from '../../lib/parsers/clover.js';

/** Tests the features of the Clover parser. */
describe('Clover', () => {
  function arrayIntersect(array1, array2) {
    return array1.filter(item => array2.includes(item));
  }

  describe('parseReport()', () => {
    it('should properly parse Clover reports', async () => {
      const job = await parseReport(await promises.readFile('test/fixtures/clover.xml', 'utf8'));
      assert(Array.isArray(job.sourceFiles));
      assert.equal(job.sourceFiles.length, 3);

      let subset = [null, 2, 2, 2, 2, null];
      assert(job.sourceFiles[0] instanceof SourceFile);
      assert.equal(job.sourceFiles[0].branches.length, 0);
      assert.deepEqual(arrayIntersect(subset, job.sourceFiles[0].coverage), subset);
      assert.equal(job.sourceFiles[0].name, join('src', 'client.ts'));
      assert(job.sourceFiles[0].sourceDigest.length > 0);

      subset = [null, 2, 2, 2, 2, null];
      assert(job.sourceFiles[0] instanceof SourceFile);
      assert.equal(job.sourceFiles[1].branches.length, 0);
      assert.deepEqual(arrayIntersect(subset, job.sourceFiles[1].coverage), subset);
      assert.equal(job.sourceFiles[1].name, join('src', 'configuration.ts'));
      assert(job.sourceFiles[1].sourceDigest.length > 0);

      subset = [null, 2, 2, 2, 2, null];
      assert(job.sourceFiles[0] instanceof SourceFile);
      assert.equal(job.sourceFiles[2].branches.length, 0);
      assert.deepEqual(arrayIntersect(subset, job.sourceFiles[2].coverage), subset);
      assert.equal(job.sourceFiles[2].name, join('src', 'git.ts'));
      assert(job.sourceFiles[2].sourceDigest.length > 0);
    });

    it('should reject if the Clover report is invalid', () => {
      assert.rejects(parseReport('<coverage><foo /></coverage>'), TypeError);
    });
  });
});

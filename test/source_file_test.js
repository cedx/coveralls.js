import {strict as assert} from 'assert';
import {SourceFile} from '../lib/index.js';

/** Tests the features of the {@link SourceFile} class. */
describe('SourceFile', () => {
  describe('.fromJson()', () => {
    it('should return an instance with default values for an empty map', () => {
      const file = SourceFile.fromJson({});
      assert.equal(file.coverage.length, 0);
      assert.equal(file.name.length, 0);
      assert.equal(file.source.length, 0);
      assert.equal(file.sourceDigest.length, 0);
    });

    it('should return an initialized instance for a non-empty map', () => {
      const file = SourceFile.fromJson({
        coverage: [null, 2, 0, null, 4, 15, null],
        name: 'coveralls.js',
        source: 'function main() {}',
        source_digest: 'e23fb141da9a7b438479a48eac7b7249'
      });

      assert.equal(file.coverage.length, 7);
      assert.equal(file.coverage[0], null);
      assert.equal(file.coverage[1], 2);
      assert.equal(file.name, 'coveralls.js');
      assert.equal(file.source, 'function main() {}');
      assert.equal(file.sourceDigest, 'e23fb141da9a7b438479a48eac7b7249');
    });
  });

  describe('.toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      const map = new SourceFile('', '').toJSON();
      assert.equal(Object.keys(map).length, 3);

      assert(Array.isArray(map.coverage));
      assert.equal(map.coverage.length, 0);
      assert.equal(map.name.length, 0);
      assert.equal(map.source_digest.length, 0);
    });

    it('should return a non-empty map for an initialized instance', () => {
      const map = new SourceFile('coveralls.js', 'e23fb141da9a7b438479a48eac7b7249', {
        coverage: [null, 2, 0, null, 4, 15, null],
        source: 'function main() {}'}
      ).toJSON();

      assert.equal(Object.keys(map).length, 4);

      assert(Array.isArray(map.coverage));
      assert.equal(map.coverage.length, 7);
      assert.equal(map.coverage[0], null);
      assert.equal(map.coverage[1], 2);

      assert.equal(map.name, 'coveralls.js');
      assert.equal(map.source, 'function main() {}');
      assert.equal(map.source_digest, 'e23fb141da9a7b438479a48eac7b7249');
    });
  });
});

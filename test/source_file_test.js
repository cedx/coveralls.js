'use strict';

import assert from 'assert';
import {SourceFile} from '../src/index';

/**
 * @test {SourceFile}
 */
describe('SourceFile', () => {

  /**
   * @test {SourceFile.fromJSON}
   */
  describe('.fromJSON()', () => {
    it('should return a null reference with a non-object value', () => {
      assert.strictEqual(SourceFile.fromJSON('foo'), null);
    });

    it('should return an instance with default values for an empty map', () => {
      let file = SourceFile.fromJSON({});
      assert.ok(file instanceof SourceFile);

      assert.ok(Array.isArray(file.coverage));
      assert.equal(file.coverage.length, 0);

      assert.equal(file.name, '');
      assert.equal(file.source, '');
      assert.equal(file.sourceDigest, '');
    });

    it('should return an initialized instance for a non-empty map', () => {
      let file = SourceFile.fromJSON({coverage: [null, 2, 0, null, 4, 15, null], name: 'coveralls.js', source: 'function main() {}', source_digest: 'e23fb141da9a7b438479a48eac7b7249'});
      assert.ok(file instanceof SourceFile);

      assert.ok(Array.isArray(file.coverage));
      assert.equal(file.coverage.length, 7);
      assert.strictEqual(file.coverage[0], null);
      assert.equal(file.coverage[1], 2);

      assert.equal(file.name, 'coveralls.js');
      assert.equal(file.source, 'function main() {}');
      assert.equal(file.sourceDigest, 'e23fb141da9a7b438479a48eac7b7249');
    });
  });

  /**
   * @test {SourceFile#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      let map = new SourceFile().toJSON();
      assert.equal(Object.keys(map).length, 3);

      assert.ok(Array.isArray(map.coverage));
      assert.equal(map.coverage.length, 0);

      assert.equal(map.name, '');
      assert.equal(map.source_digest, '');
    });

    it('should return a non-empty map for an initialized instance', () => {
      let map = new SourceFile('coveralls.js', 'e23fb141da9a7b438479a48eac7b7249', 'function main() {}', [null, 2, 0, null, 4, 15, null]).toJSON();
      assert.equal(Object.keys(map).length, 4);

      assert.ok(Array.isArray(map.coverage));
      assert.equal(map.coverage.length, 7);
      assert.strictEqual(map.coverage[0], null);
      assert.equal(map.coverage[1], 2);

      assert.equal(map.name, 'coveralls.js');
      assert.equal(map.source, 'function main() {}');
      assert.equal(map.source_digest, 'e23fb141da9a7b438479a48eac7b7249');
    });
  });
});

'use strict';

const {expect} = require('chai');
const {SourceFile} = require('../lib');

/**
 * @test {SourceFile}
 */
describe('SourceFile', () => {

  /**
   * @test {SourceFile.fromJson}
   */
  describe('.fromJson()', () => {
    it('should return a null reference with a non-object value', () => {
      expect(SourceFile.fromJson('foo')).to.be.null;
    });

    it('should return an instance with default values for an empty map', () => {
      let file = SourceFile.fromJson({});
      expect(file).to.be.instanceof(SourceFile);

      expect(file.coverage).to.be.an('array').and.be.empty;
      expect(file.name).to.be.empty;
      expect(file.source).to.be.empty;
      expect(file.sourceDigest).to.be.empty;
    });

    it('should return an initialized instance for a non-empty map', () => {
      let file = SourceFile.fromJson({coverage: [null, 2, 0, null, 4, 15, null], name: 'coveralls.js', source: 'function main() {}', source_digest: 'e23fb141da9a7b438479a48eac7b7249'});
      expect(file).to.be.instanceof(SourceFile);

      expect(file.coverage).to.be.an('array').and.have.lengthOf(7);
      expect(file.coverage[0]).to.be.null;
      expect(file.coverage[1]).to.equal(2);

      expect(file.name).to.equal('coveralls.js');
      expect(file.source).to.equal('function main() {}');
      expect(file.sourceDigest).to.equal('e23fb141da9a7b438479a48eac7b7249');
    });
  });

  /**
   * @test {SourceFile#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      let map = new SourceFile('', '').toJSON();
      expect(Object.keys(map)).to.have.lengthOf(3);

      expect(map.coverage).to.be.an('array').and.be.empty;
      expect(map.name).to.be.empty;
      expect(map.source_digest).to.be.empty;
    });

    it('should return a non-empty map for an initialized instance', () => {
      let map = new SourceFile('coveralls.js', 'e23fb141da9a7b438479a48eac7b7249', 'function main() {}', [null, 2, 0, null, 4, 15, null]).toJSON();
      expect(Object.keys(map)).to.have.lengthOf(4);

      expect(map.coverage).to.be.an('array').and.have.lengthOf(7);
      expect(map.coverage[0]).to.be.null;
      expect(map.coverage[1]).to.equal(2);

      expect(map.name).to.equal('coveralls.js');
      expect(map.source).to.equal('function main() {}');
      expect(map.source_digest).to.equal('e23fb141da9a7b438479a48eac7b7249');
    });
  });

  /**
   * @test {SourceFile#toString}
   */
  describe('#toString()', () => {
    let file = String(new SourceFile('coveralls.js', 'e23fb141da9a7b438479a48eac7b7249', 'function main() {}', [null, 2, 0, null, 4, 15, null]));

    it('should start with the class name', () => {
      expect(file.startsWith('SourceFile {')).to.be.true;
    });

    it('should contain the instance properties', () => {
      expect(file).to.contain('"name":"coveralls.js"')
        .and.contain('"source":"function main() {}"')
        .and.contain('"source_digest":"e23fb141da9a7b438479a48eac7b7249"');
    });
  });
});
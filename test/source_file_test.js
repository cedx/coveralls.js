import {expect} from 'chai';
import {SourceFile} from '../lib/index.js';

/** Tests the features of the `SourceFile` class. */
describe('SourceFile', () => {
  describe('.fromJson()', () => {
    it('should return an instance with default values for an empty map', () => {
      const file = SourceFile.fromJson({});
      expect(file).to.be.an.instanceof(SourceFile);
      expect(file.coverage).to.be.an('array').and.be.empty;
      expect(file.name).to.be.empty;
      expect(file.source).to.be.empty;
      expect(file.sourceDigest).to.be.empty;
    });

    it('should return an initialized instance for a non-empty map', () => {
      const file = SourceFile.fromJson({coverage: [null, 2, 0, null, 4, 15, null], name: 'coveralls.js', source: 'function main() {}', source_digest: 'e23fb141da9a7b438479a48eac7b7249'});
      expect(file).to.be.an.instanceof(SourceFile);

      expect(file.coverage).to.be.an('array').and.have.lengthOf(7);
      expect(file.coverage[0]).to.be.null;
      expect(file.coverage[1]).to.equal(2);

      expect(file.name).to.equal('coveralls.js');
      expect(file.source).to.equal('function main() {}');
      expect(file.sourceDigest).to.equal('e23fb141da9a7b438479a48eac7b7249');
    });
  });

  describe('#toJSON()', () => {
    it('should return a map with default values for a newly created instance', () => {
      const map = new SourceFile('', '').toJSON();
      expect(Object.keys(map)).to.have.lengthOf(3);

      expect(map.coverage).to.be.an('array').and.be.empty;
      expect(map.name).to.be.empty;
      expect(map.source_digest).to.be.empty;
    });

    it('should return a non-empty map for an initialized instance', () => {
      const map = new SourceFile('coveralls.js', 'e23fb141da9a7b438479a48eac7b7249', {
        coverage: [null, 2, 0, null, 4, 15, null],
        source: 'function main() {}'}
      ).toJSON();

      expect(Object.keys(map)).to.have.lengthOf(4);

      expect(map.coverage).to.be.an('array').and.have.lengthOf(7);
      expect(map.coverage[0]).to.be.null;
      expect(map.coverage[1]).to.equal(2);

      expect(map.name).to.equal('coveralls.js');
      expect(map.source).to.equal('function main() {}');
      expect(map.source_digest).to.equal('e23fb141da9a7b438479a48eac7b7249');
    });
  });
});

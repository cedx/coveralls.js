/**
 * Defines the options of a {@link SourceFile} instance.
 * @typedef {object} SourceFileOptions
 * @property {Array<?number>} [coverage] The coverage data for this file's job.
 * @property {string} [source] The contents of this source file.
 */

/** Represents a source code file and its coverage data for a single job. */
export class SourceFile {

  /**
   * Creates a new source file.
   * @param {string} name The file path of this source file.
   * @param {string} sourceDigest The MD5 digest of the full source code of this file.
   * @param {SourceFileOptions} [options] An object specifying values used to initialize this instance.
   */
  constructor(name, sourceDigest, options = {}) {
    const {coverage = [], source = ''} = options;

    /**
     * The coverage data for this file's job.
     * @type {Array<?number>}
     */
    this.coverage = coverage;

    /**
     * The file path of this source file.
     * @type {string}
     */
    this.name = name;

    /**
     * The contents of this source file.
     * @type {string}
     */
    this.source = source;

    /**
     * The MD5 digest of the full source code of this file.
     * @type {string}
     */
    this.sourceDigest = sourceDigest;
  }

  /**
   * Creates a new source file from the specified JSON map.
   * @param {Object<string, *>} map A JSON map representing a source file.
   * @return {SourceFile} The instance corresponding to the specified JSON map.
   */
  static fromJson(map) {
    const options = {
      coverage: Array.isArray(map.coverage) ? map.coverage : [],
      source: typeof map.source == 'string' ? map.source : ''
    };

    return new SourceFile(
      typeof map.name == 'string' ? map.name : '',
      typeof map.source_digest == 'string' ? map.source_digest : '',
      options
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {Object<string, *>} The map in JSON format corresponding to this object.
   */
  toJSON() {
    const map = {
      coverage: this.coverage,
      name: this.name,
      source_digest: this.sourceDigest
    };

    if (this.source.length) map.source = this.source;
    return map;
  }
}

/**
 * Represents a source code file and its coverage data for a single job.
 */
export class SourceFile {

  /**
   * Initializes a new instance of the class.
   * @param {string} [name] The file path of this source file.
   * @param {string} [sourceDigest] The MD5 digest of the full source code of this file.
   * @param {int[]} [coverage] The coverage data for this file's job.
   * @param {string} [source] The contents of this source file.
   */
  constructor(name = '', sourceDigest = '', coverage = [], source = '') {

    /**
     * The coverage data for this file's job.
     * @type {int[]}
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
   * @param {object} map A JSON map representing a branch data.
   * @return {SourceFile} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJSON(map) {
    return !map || typeof map != 'object' ? null : new SourceFile(
      typeof map.name == 'string' ? map.name : '',
      typeof map.source_digest == 'string' ? map.source_digest : '',
      Array.isArray(map.coverage) ? map.coverage : [],
      typeof map.source == 'string' ? map.source : ''
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = {
      name: this.name,
      source_digest: this.sourceDigest,
      coverage: this.coverage
    };

    if (this.source.length) map.source = this.source;
    return map;
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this.constructor.name} ${JSON.stringify(this)}`;
  }
}

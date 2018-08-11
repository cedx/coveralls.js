/**
 * Represents a source code file and its coverage data for a single job.
 */
class SourceFile {

  /**
   * Initializes a new instance of the class.
   * @param {string} name The file path of this source file.
   * @param {string} sourceDigest The MD5 digest of the full source code of this file.
   * @param {Object} [options] An object specifying values used to initialize this instance.
   */
  constructor(name, sourceDigest, {coverage = [], source = ''} = {}) {

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
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag](): string {
    return 'SourceFile';
  }

  /**
   * Creates a new source file from the specified JSON map.
   * @param {Object} map A JSON map representing a source file.
   * @return {SourceFile} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  public static fromJson(map: {[key: string]: any}) {
    if (!map || typeof map != 'object') return null;

    const options = {
      coverage: Array.isArray(map.coverage) ? map.coverage : [],
      source: typeof map.source == 'string' ? map.source : ''
    };

    return new this(
      typeof map.name == 'string' ? map.name : '',
      typeof map.source_digest == 'string' ? map.source_digest : '',
      options
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  public toJSON(): {[key: string]: any} {
    const map = {
      name: this.name,
      source_digest: this.sourceDigest,
      coverage: this.coverage
    };

    if (this.source.length) map.source = this.source;
    return map;
  }

  /**
   * Returns a string representation of this object.
   * @return The string representation of this object.
   */
  public toString(): string {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
}

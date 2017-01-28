/**
 * Represents a Git remote repository.
 */
export class GitRemote {

  /**
   * Initializes a new instance of the class.
   * @param {string} [name] The remote's name.
   * @param {string} [url] The remote's URL.
   */
  constructor(name = '', url = '') {

    /**
     * The remote's name.
     * @type {string}
     */
    this.name = name;

    /**
     * The remote's URL.
     * @type {string}
     */
    this.url = url;
  }

  /**
   * Creates a new source file from the specified JSON map.
   * @param {object} map A JSON map representing a branch data.
   * @return {SourceFile} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJSON(map) {
    return !map || typeof map != 'object' ? null : new GitRemote(
      typeof map.name == 'string' ? map.name : '',
      typeof map.url == 'string' ? map.url : ''
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return {
      name: this.name,
      url: this.url
    };
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this.constructor.name} ${JSON.stringify(this)}`;
  }
}

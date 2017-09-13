'use strict';
const {URL} = require('url');

/**
 * Represents a Git remote repository.
 */
exports.GitRemote = class GitRemote {

  /**
   * Initializes a new instance of the class.
   * @param {string} name The remote's name.
   * @param {string|URL} [url] The remote's URL.
   */
  constructor(name, url = null) {

    /**
     * The remote's name.
     * @type {string}
     */
    this.name = name;

    /**
     * The remote's URL.
     * @type {URL}
     */
    this.url = typeof url == 'string' ? new URL(url) : url;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'GitRemote';
  }

  /**
   * Creates a new remote repository from the specified JSON map.
   * @param {object} map A JSON map representing a remote repository.
   * @return {GitRemote} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJson(map) {
    return !map || typeof map != 'object' ? null : new GitRemote(
      typeof map.name == 'string' ? map.name : '',
      typeof map.url == 'string' ? map.url : null
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return {
      name: this.name,
      url: this.url ? this.url.href : null
    };
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
};

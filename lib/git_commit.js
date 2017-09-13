'use strict';

/**
 * Represents a Git remote repository.
 */
exports.GitCommit = class GitCommit {

  /**
   * Initializes a new instance of the class.
   * @param {string} id The commit identifier.
   * @param {object} [options] An object specifying values used to initialize this instance.
   */
  constructor(id, {authorEmail = '', authorName = '', committerEmail = '', committerName = '', message = ''} = {}) {

    /**
     * The author mail address.
     * @type {string}
     */
    this.authorEmail = authorEmail;

    /**
     * The author name.
     * @type {string}
     */
    this.authorName = authorName;

    /**
     * The committer mail address.
     * @type {string}
     */
    this.committerEmail = committerEmail;

    /**
     * The committer name.
     * @type {string}
     */
    this.committerName = committerName;

    /**
     * The commit identifier.
     * @type {string}
     */
    this.id = id;

    /**
     * The commit message.
     * @type {string}
     */
    this.message = message;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'GitCommit';
  }

  /**
   * Creates a new Git commit from the specified JSON map.
   * @param {object} map A JSON map representing a Git commit.
   * @return {GitCommit} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJson(map) {
    return !map || typeof map != 'object' ? null : new GitCommit(typeof map.id == 'string' ? map.id : '', {
      authorEmail: typeof map.author_email == 'string' ? map.author_email : '',
      authorName: typeof map.author_name == 'string' ? map.author_name : '',
      committerEmail: typeof map.committer_email == 'string' ? map.committer_email : '',
      committerName: typeof map.committer_name == 'string' ? map.committer_name : '',
      message: typeof map.message == 'string' ? map.message : ''
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = {id: this.id};
    if (this.authorEmail.length) map.author_email = this.authorEmail;
    if (this.authorName.length) map.author_name = this.authorName;
    if (this.committerEmail.length) map.committer_email = this.committerEmail;
    if (this.committerName.length) map.committer_name = this.committerName;
    if (this.message.length) map.message = this.message;
    return map;
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
};

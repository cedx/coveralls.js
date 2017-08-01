'use strict';

/**
 * Represents a Git remote repository.
 */
exports.GitCommit = class GitCommit {

  /**
   * Initializes a new instance of the class.
   * @param {string} [id] The commit identifier.
   * @param {string} [message] The commit message.
   */
  constructor(id = '', message = '') {

    /**
     * The author mail address.
     * @type {string}
     */
    this.authorEmail = '';

    /**
     * The author name.
     * @type {string}
     */
    this.authorName = '';

    /**
     * The committer mail address.
     * @type {string}
     */
    this.committerEmail = '';

    /**
     * The committer name.
     * @type {string}
     */
    this.committerName = '';

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
   * Creates a new Git commit from the specified JSON map.
   * @param {object} map A JSON map representing a Git commit.
   * @return {GitCommit} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJson(map) {
    if (!map || typeof map != 'object') return null;

    let commit = new GitCommit(
      typeof map.id == 'string' ? map.id : '',
      typeof map.message == 'string' ? map.message : ''
    );

    if (typeof map.author_email == 'string') commit.authorEmail = map.author_email;
    if (typeof map.author_name == 'string') commit.authorName = map.author_name;
    if (typeof map.committer_email == 'string') commit.committerEmail = map.committer_email;
    if (typeof map.committer_name == 'string') commit.committerName = map.committer_name;
    return commit;
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
    return `${this.constructor.name} ${JSON.stringify(this)}`;
  }
};

'use strict';

const {exec} = require('child_process');
const {promisify} = require('util');

/**
 * Represents a Git remote repository.
 */
class GitCommit {

  /**
   * Initializes a new instance of the class.
   * @param {string} id The commit identifier.
   * @param {Object} [options] An object specifying values used to initialize this instance.
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
   * @param {Object} map A JSON map representing a Git commit.
   * @return {GitCommit} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJson(map) {
    return !map || typeof map != 'object' ? null : new this(typeof map.id == 'string' ? map.id : '', {
      authorEmail: typeof map.author_email == 'string' ? map.author_email : '',
      authorName: typeof map.author_name == 'string' ? map.author_name : '',
      committerEmail: typeof map.committer_email == 'string' ? map.committer_email : '',
      committerName: typeof map.committer_name == 'string' ? map.committer_name : '',
      message: typeof map.message == 'string' ? map.message : ''
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {Object} The map in JSON format corresponding to this object.
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
}

/**
 * Represents a Git remote repository.
 */
class GitRemote {

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
   * @param {Object} map A JSON map representing a remote repository.
   * @return {GitRemote} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJson(map) {
    return !map || typeof map != 'object' ? null : new this(
      typeof map.name == 'string' ? map.name : '',
      typeof map.url == 'string' ? map.url : null
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {Object} The map in JSON format corresponding to this object.
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
}

/**
 * Represents a Git remote repository.
 */
class GitData {

  /**
   * Initializes a new instance of the class.
   * @param {GitCommit} [commit] The remote's name.
   * @param {Object} [options] An object specifying values used to initialize this instance.
   */
  constructor(commit, {branch = '', remotes = []} = {}) {

    /**
     * The branch name.
     * @type {string}
     */
    this.branch = branch;

    /**
     * The Git commit.
     * @type {GitCommit}
     */
    this.commit = commit;

    /**
     * The remote repositories.
     * @type {GitRemote[]}
     */
    this.remotes = remotes;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'GitData';
  }

  /**
   * Creates a new Git data from the specified JSON map.
   * @param {Object} map A JSON map representing a Git data.
   * @return {GitData} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJson(map) {
    return !map || typeof map != 'object' ? null : new this(GitCommit.fromJson(map.head), {
      branch: typeof map.branch == 'string' ? map.branch : '',
      remotes: Array.isArray(map.remotes) ? map.remotes.map(item => GitRemote.fromJson(item)).filter(item => item != null) : []
    });
  }

  /**
   * Creates a new Git data from a local repository.
   * This method relies on the availability of the Git executable in the system path.
   * @param {string} [path] The path to the repository folder. Defaults to the current working directory.
   * @return {Promise<GitData>} The newly created data.
   */
  static async fromRepository(path = process.cwd()) {
    let commands = {
      author_email: 'log -1 --pretty=format:%ae',
      author_name: 'log -1 --pretty=format:%aN',
      branch: 'rev-parse --abbrev-ref HEAD',
      committer_email: 'log -1 --pretty=format:%ce',
      committer_name: 'log -1 --pretty=format:%cN',
      id: 'log -1 --pretty=format:%H',
      message: 'log -1 --pretty=format:%s',
      remotes: 'remote -v'
    };

    const execCommand = promisify(exec);
    for (let [key, value] of Object.entries(commands)) {
      let {stdout} = await execCommand(`git ${value}`, {cwd: path});
      commands[key] = stdout.trim();
    }

    let remotes = {};
    for (let remote of commands.remotes.split(/\r?\n/g)) {
      let parts = remote.replace(/\s+/g, ' ').split(' ');
      if (!(parts[0] in remotes)) remotes[parts[0]] = new GitRemote(parts[0], parts.length > 1 ? parts[1] : null);
    }

    return new this(GitCommit.fromJson(commands), {branch: commands.branch, remotes: Object.values(remotes)});
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {Object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return {
      branch: this.branch,
      head: this.commit ? this.commit.toJSON() : null,
      remotes: this.remotes.map(item => item.toJSON())
    };
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
}

// Module exports.
exports.GitCommit = GitCommit;
exports.GitData = GitData;
exports.GitRemote = GitRemote;

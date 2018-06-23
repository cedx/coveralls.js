'use strict';

const {exec} = require('child_process');
const {promisify} = require('util');
const {GitCommit} = require('./git_commit.js');
const {GitRemote} = require('./git_remote.js');

/**
 * Represents a Git remote repository.
 */
exports.GitData = class GitData {

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
      remotes: Array.isArray(map.remotes) ? map.remotes.map(item => GitRemote.fromJson(item)).filter(item => item) : []
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
};

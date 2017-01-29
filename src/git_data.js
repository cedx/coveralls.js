import {GitCommit} from './git_commit';
import {GitRemote} from './git_remote';

/**
 * Represents a Git remote repository.
 */
export class GitData {

  /**
   * Initializes a new instance of the class.
   * @param {GitCommit} [commit] The remote's name.
   * @param {string} [branch] The remote's URL.
   * @param {GitRemote[]} [remotes] The remote's URL.
   */
  constructor(commit = null, branch = '', remotes = []) {

    /**
     * The remote's URL.
     * @type {string}
     */
    this.branch = branch;

    /**
     * The remote's name.
     * @type {GitCommit}
     */
    this.commit = commit;

    /**
     * The remote's URL.
     * @type {GitRemote[]}
     */
    this.remotes = remotes;
  }

  /**
   * Creates a new Git data from the specified JSON map.
   * @param {object} map A JSON map representing a Git data.
   * @return {SourceFile} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJSON(map) {
    return !map || typeof map != 'object' ? null : new GitData(
      GitCommit.fromJSON(map.head),
      typeof map.branch == 'string' ? map.branch : '',
      Array.isArray(map.remotes) ? map.remotes.map(item => GitRemote.fromJSON(item)).filter(item => item) : []
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
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
    return `${this.constructor.name} ${JSON.stringify(this)}`;
  }
}

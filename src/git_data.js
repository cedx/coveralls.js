import child_process from 'child_process';
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
   * Creates a new Git data from a local repository.
   * This method relies on the availability of the Git executable in the system path.
   * @param {string} [path] The path to the repository folder. Defaults to the current working directory.
   * @return {Promise<GitData>} The newly created data.
   */
  static fromRepository(path = '') {
    if (!path.length) path = process.cwd();

    let commands = {
      /* eslint-disable quotes */
      authorEmail: "git log -1 --pretty=format:'%ae'",
      authorName: "git log -1 --pretty=format:'%aN'",
      branch: 'git rev-parse --abbrev-ref HEAD',
      committerEmail: "git log -1 --pretty=format:'%ce'",
      committerName: "git log -1 --pretty=format:'%cN'",
      id: "git log -1 --pretty=format:'%H'",
      message: "git log -1 --pretty=format:'%s'",
      remotes: 'git remote -v'
      /* eslint-enable quotes */
    };

    let promises = Object.keys(commands).map(key => new Promise((resolve, reject) =>
      child_process.exec(commands[key], {cwd: path}, (err, stdout) => {
        if (err) reject(err);
        else resolve(stdout.trim().replace(/^'+|'+$/g, ''));
      })
    ));

    return Promise.all(promises).then(results => {
      let index = 0;
      for (let key in commands) {
        commands[key] = results[index];
        index++;
      }

      let commit = new GitCommit(commands.id, commands.message);
      commit.authorEmail = commands.authorEmail;
      commit.authorName = commands.authorName;
      commit.committerEmail = commands.committerEmail;
      commit.committerName = commands.committerName;

      let names = [];
      let remotes = [];
      for (let remote of commands.remotes.split(/\r?\n/g)) {
        let parts = remote.replace(/\s+/g, ' ').split(' ');
        if (!names.includes(parts[0])) {
          names.push(parts[0]);
          remotes.push(new GitRemote(parts[0], parts.length > 1 ? parts[1] : ''));
        }
      }

      return new GitData(commit, commands.branch, remotes);
    });
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
    return `{this.constructor.name} {JSON.stringify(this)}`;
  }
}

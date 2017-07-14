import {exec} from 'child_process';
import {Observable} from 'rxjs';
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
   * @return {GitData} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
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
   * @return {Observable<GitData>} The newly created data.
   */
  static fromRepository(path = '') {
    if (!path.length) path = process.cwd();

    let commands = {
      /* eslint-disable quotes */
      author_email: "log -1 --pretty=format:'%ae'",
      author_name: "log -1 --pretty=format:'%aN'",
      branch: 'rev-parse --abbrev-ref HEAD',
      committer_email: "log -1 --pretty=format:'%ce'",
      committer_name: "log -1 --pretty=format:'%cN'",
      id: "log -1 --pretty=format:'%H'",
      message: "log -1 --pretty=format:'%s'",
      remotes: 'remote -v'
      /* eslint-enable quotes */
    };

    const execCommand = Observable.bindNodeCallback(exec, stdout => stdout.trim().replace(/^'+|'+$/g, ''));
    let observables = Object.values(commands).map(value => execCommand(`git ${value}`, {cwd: path}));

    return Observable.zip(...observables)
      .do(results => {
        let index = 0;
        for (let key in commands) commands[key] = results[index++];
      })
      .map(() => {
        let remotes = {};
        for (let remote of commands.remotes.split(/\r?\n/g)) {
          let parts = remote.replace(/\s+/g, ' ').split(' ');
          if (!(parts[0] in remotes)) remotes[parts[0]] = new GitRemote(parts[0], parts.length > 1 ? parts[1] : null);
        }

        return new GitData(GitCommit.fromJSON(commands), commands.branch, Object.values(remotes));
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
    return `${this.constructor.name} ${JSON.stringify(this)}`;
  }
}

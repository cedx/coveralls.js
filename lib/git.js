import {exec} from 'child_process';
import {promisify} from 'util';

/**
 * Defines the options of a {@link GitCommit} instance.
 * @typedef {object} GitCommitOptions
 * @property {string} [authorEmail] The author mail address.
 * @property {string} [authorName] The author name.
 * @property {string} [committerEmail] The committer mail address.
 * @property {string} [committerName] The committer name.
 * @property {string} [message] The commit message.
 */

/**
 * Defines the options of a {@link GitData} instance.
 * @typedef {object} GitDataOptions
 * @property {string} [branch] The branch name.
 * @property {GitRemote[]} [remotes] The remote repositories.
 */

/** Represents a Git remote repository. */
export class GitCommit {

  /**
   * Creates a new Git commit.
   * @param {string} id The commit identifier.
   * @param {GitCommitOptions} [options] An object specifying values used to initialize this instance.
   */
  constructor(id, options = {}) {
    const {authorEmail = '', authorName = '', committerEmail = '', committerName = '', message = ''} = options;

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
     * @readonly
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
   * @return {GitCommit} The instance corresponding to the specified JSON map.
   */
  static fromJson(map) {
    return new GitCommit(typeof map.id == 'string' ? map.id : '', {
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
    const map = {id: this.id};
    if (this.authorEmail.length) map.author_email = this.authorEmail;
    if (this.authorName.length) map.author_name = this.authorName;
    if (this.committerEmail.length) map.committer_email = this.committerEmail;
    if (this.committerName.length) map.committer_name = this.committerName;
    if (this.message.length) map.message = this.message;
    return map;
  }
}

/** Represents a Git remote repository. */
export class GitData {

  /**
   * Creates a new Git data.
   * @param {?GitCommit} commit The Git commit.
   * @param {GitDataOptions} [options] An object specifying values used to initialize this instance.
   */
  constructor(commit, options = {}) {
    const {branch = '', remotes = []} = options;

    /**
     * The branch name.
     * @type {string}
     */
    this.branch = branch;

    /**
     * The Git commit.
     * @type {?GitCommit}
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
   * @return {GitData} The instance corresponding to the specified JSON map.
   */
  static fromJson(map) {
    return new GitData(typeof map.head == 'object' && map.head ? GitCommit.fromJson(map.head) : null, {
      branch: typeof map.branch == 'string' ? map.branch : '',
      remotes: Array.isArray(map.remotes) ? map.remotes.map(GitRemote.fromJson) : []
    });
  }

  /**
   * Creates a new Git data from a local repository.
   * This method relies on the availability of the Git executable in the system path.
   * @param {string} [path] The path to the repository folder.
   * @return {Promise<GitData>} The newly created data.
   */
  static async fromRepository(path = process.cwd()) {
    const commands = {
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
    for (const [key, value] of Object.entries(commands)) {
      const {stdout} = await execCommand(`git ${value}`, {cwd: path});
      commands[key] = stdout.trim();
    }

    const remotes = new Map;
    for (const remote of commands.remotes.split(/\r?\n/g)) {
      const parts = remote.replace(/\s+/g, ' ').split(' ');
      if (!remotes.has(parts[0])) remotes.set(parts[0], new GitRemote(parts[0], parts.length > 1 ? parts[1] : null));
    }

    return new GitData(GitCommit.fromJson(commands), {
      branch: commands.branch,
      remotes: [...remotes.values()]
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
}

/** Represents a Git remote repository. */
export class GitRemote {

  /**
   * Creates a new Git remote repository.
   * @param {string} name The remote's name.
   * @param {?(URL|string)} [url] The remote's URL.
   */
  constructor(name, url = null) {

    /**
     * The remote's name.
     * @type {string}
     */
    this.name = name;

    /**
     * The remote's URL.
     * @type {?URL}
     */
    this.url = typeof url != 'string' ? url : new URL(/^\w+:\/\//.test(url) ? url : url.replace(/^([^@]+@)?([^:]+):(.+)$/, 'ssh://$1$2/$3'));
  }

  /**
   * Creates a new remote repository from the specified JSON map.
   * @param {object} map A JSON map representing a remote repository.
   * @return {GitRemote} The instance corresponding to the specified JSON map.
   */
  static fromJson(map) {
    return new GitRemote(
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
}

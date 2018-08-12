import {exec} from 'child_process';
import {promisify} from 'util';
import {JsonMap} from './map';

/**
 * Represents a Git remote repository.
 */
export class GitCommit {

  /**
   * The author mail address.
   */
  public authorEmail: string;

  /**
   * The author name.
   */
  public authorName: string;

  /**
   * The committer mail address.
   */
  public committerEmail: string;

  /**
   * The committer name.
   */
  public committerName: string;

  /**
   * The commit message.
   */
  public message: string;

  /**
   * Initializes a new instance of the class.
   * @param id The commit identifier.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(public id: string, options: Partial<GitCommitOptions> = {}) {
    const {authorEmail = '', authorName = '', committerEmail = '', committerName = '', message = ''} = options;
    this.authorEmail = authorEmail;
    this.authorName = authorName;
    this.committerEmail = committerEmail;
    this.committerName = committerName;
    this.message = message;
  }

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'GitCommit';
  }

  /**
   * Creates a new Git commit from the specified JSON map.
   * @param map A JSON map representing a Git commit.
   * @return The instance corresponding to the specified JSON map.
   */
  public static fromJson(map: JsonMap): GitCommit {
    return new this(typeof map.id == 'string' ? map.id : '', {
      authorEmail: typeof map.author_email == 'string' ? map.author_email : '',
      authorName: typeof map.author_name == 'string' ? map.author_name : '',
      committerEmail: typeof map.committer_email == 'string' ? map.committer_email : '',
      committerName: typeof map.committer_name == 'string' ? map.committer_name : '',
      message: typeof map.message == 'string' ? map.message : ''
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  public toJSON(): JsonMap {
    const map: JsonMap = {id: this.id};
    if (this.authorEmail.length) map.author_email = this.authorEmail;
    if (this.authorName.length) map.author_name = this.authorName;
    if (this.committerEmail.length) map.committer_email = this.committerEmail;
    if (this.committerName.length) map.committer_name = this.committerName;
    if (this.message.length) map.message = this.message;
    return map;
  }

  /**
   * Returns a string representation of this object.
   * @return The string representation of this object.
   */
  public toString(): string {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
}

/**
 * Defines the options of a `GitCommit` instance.
 */
export interface GitCommitOptions {

  /**
   * The author mail address.
   */
  authorEmail: string;

  /**
   * The author name.
   */
  authorName: string;

  /**
   * The committer mail address.
   */
  committerEmail: string;

  /**
   * The committer name.
   */
  committerName: string;

  /**
   * The commit message.
   */
  message: string;
}

/**
 * Represents a Git remote repository.
 */
export class GitData {

  /**
   * The branch name.
   */
  public branch: string;

  /**
   * The remote repositories.
   */
  public remotes: GitRemote[];

  /**
   * Initializes a new instance of the class.
   * @param commit The Git commit.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(public commit: GitCommit | null, options: Partial<GitDataOptions> = {}) {
    const {branch = '', remotes = []} = options;
    this.branch = branch;
    this.remotes = remotes;
  }

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'GitData';
  }

  /**
   * Creates a new Git data from the specified JSON map.
   * @param map A JSON map representing a Git data.
   * @return The instance corresponding to the specified JSON map.
   */
  public static fromJson(map: JsonMap): GitData {
    return new this(typeof map.head == 'object' && map.head ? GitCommit.fromJson(map.head) : null, {
      branch: typeof map.branch == 'string' ? map.branch : '',
      remotes: Array.isArray(map.remotes) ? map.remotes.map(item => GitRemote.fromJson(item)) : []
    });
  }

  /**
   * Creates a new Git data from a local repository.
   * This method relies on the availability of the Git executable in the system path.
   * @param path The path to the repository folder. Defaults to the current working directory.
   * @return The newly created data.
   */
  public static async fromRepository(path: string = process.cwd()): Promise<GitData> {
    const commands: JsonMap = {
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

    return new this(GitCommit.fromJson(commands), {
      branch: commands.branch,
      remotes: Array.from(remotes.values())
    });
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  public toJSON(): JsonMap {
    return {
      branch: this.branch,
      head: this.commit ? this.commit.toJSON() : null,
      remotes: this.remotes.map(item => item.toJSON())
    };
  }

  /**
   * Returns a string representation of this object.
   * @return The string representation of this object.
   */
  public toString(): string {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
}

/**
 * Defines the options of a `GitData` instance.
 */
export interface GitDataOptions {

  /**
   * The branch name.
   */
  branch: string;

  /**
   * The remote repositories.
   */
  remotes: GitRemote[];
}

/**
 * Represents a Git remote repository.
 */
export class GitRemote {

  /**
   * The remote's URL.
   */
  public url: URL | null;

  /**
   * Initializes a new instance of the class.
   * @param name The remote's name.
   * @param url The remote's URL.
   */
  constructor(public name: string, url: null | string | URL = null) {
    this.url = typeof url == 'string' ? new URL(url) : url;
  }

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'GitRemote';
  }

  /**
   * Creates a new remote repository from the specified JSON map.
   * @param map A JSON map representing a remote repository.
   * @return The instance corresponding to the specified JSON map.
   */
  public static fromJson(map: JsonMap): GitRemote {
    return new this(
      typeof map.name == 'string' ? map.name : '',
      typeof map.url == 'string' ? map.url : null
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  public toJSON(): JsonMap {
    return {
      name: this.name,
      url: this.url ? this.url.href : null
    };
  }

  /**
   * Returns a string representation of this object.
   * @return The string representation of this object.
   */
  public toString(): string {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
}

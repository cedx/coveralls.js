import { JsonObject } from "./json.js";
/** Represents a Git remote repository. */
export declare class GitRemote {
    name: string;
    /** The remote's URL. */
    url?: URL;
    /**
     * Creates a new Git remote repository.
     * @param name The remote's name.
     * @param url The remote's URL.
     */
    constructor(name: string, url?: URL | string);
    /**
     * Creates a new remote repository from the specified JSON object.
     * @param map A JSON object representing a remote repository.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map: JsonObject): GitRemote;
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON(): JsonObject;
}
/** Represents a Git remote repository. */
export declare class GitCommit {
    readonly id: string;
    /** The author mail address. */
    authorEmail: string;
    /** The author name. */
    authorName: string;
    /** The committer mail address. */
    committerEmail: string;
    /** The committer name. */
    committerName: string;
    /** The commit message. */
    message: string;
    /**
     * Creates a new Git commit.
     * @param id The commit identifier.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(id: string, options?: Partial<GitCommitOptions>);
    /**
     * Creates a new Git commit from the specified JSON object.
     * @param map A JSON object representing a Git commit.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map: JsonObject): GitCommit;
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON(): JsonObject;
}
/** Defines the options of a [[GitCommit]] instance. */
export interface GitCommitOptions {
    /** The author mail address. */
    authorEmail: string;
    /** The author name. */
    authorName: string;
    /** The committer mail address. */
    committerEmail: string;
    /** The committer name. */
    committerName: string;
    /** The commit message. */
    message: string;
}
/** Represents a Git remote repository. */
export declare class GitData {
    commit?: GitCommit | undefined;
    /** The branch name. */
    branch: string;
    /** The remote repositories. */
    remotes: GitRemote[];
    /**
     * Creates a new Git data.
     * @param commit The Git commit.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(commit?: GitCommit | undefined, options?: Partial<GitDataOptions>);
    /**
     * Creates a new Git data from the specified JSON object.
     * @param map A JSON object representing a Git data.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map: JsonObject): GitData;
    /**
     * Creates a new Git data from a local repository.
     * This method relies on the availability of the Git executable in the system path.
     * @param path The path to the repository folder.
     * @return The newly created data.
     */
    static fromRepository(path?: string): Promise<GitData>;
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON(): JsonObject;
}
/** Defines the options of a [[GitData]] instance. */
export interface GitDataOptions {
    /** The branch name. */
    branch: string;
    /** The remote repositories. */
    remotes: GitRemote[];
}

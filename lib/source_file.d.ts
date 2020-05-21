import { JsonObject } from "./json.js";
/** Represents a source code file and its coverage data for a single job. */
export declare class SourceFile {
    name: string;
    sourceDigest: string;
    /** The branch data for this file's job. */
    branches: number[];
    /** The coverage data for this file's job. */
    coverage: Array<number | null>;
    /** The contents of this source file. */
    source: string;
    /**
     * Creates a new source file.
     * @param name The file path of this source file.
     * @param sourceDigest The MD5 digest of the full source code of this file.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(name: string, sourceDigest: string, options?: Partial<SourceFileOptions>);
    /**
     * Creates a new source file from the specified JSON object.
     * @param map A JSON object representing a source file.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map: JsonObject): SourceFile;
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON(): JsonObject;
}
/** Defines the options of a [[SourceFile]] instance. */
export interface SourceFileOptions {
    /** The branch data for this file's job. */
    branches: number[];
    /** The coverage data for this file's job. */
    coverage: Array<number | null>;
    /** The contents of this source file. */
    source: string;
}

import {JsonObject} from './records';

/** Represents a source code file and its coverage data for a single job. */
export class SourceFile {

  /** The branch data for this file's job. */
  branches: number[];

  /** The coverage data for this file's job. */
  coverage: Array<number|null>;

  /** The contents of this source file. */
  source: string;

  /**
   * Creates a new source file.
   * @param name The file path of this source file.
   * @param sourceDigest The MD5 digest of the full source code of this file.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(public name: string, public sourceDigest: string, options: Partial<SourceFileOptions> = {}) {
    const {branches = [], coverage = [], source = ''} = options;
    this.branches = branches;
    this.coverage = coverage;
    this.source = source;
  }

  /**
   * Creates a new source file from the specified JSON object.
   * @param map A JSON object representing a source file.
   * @return The instance corresponding to the specified JSON object.
   */
  static fromJson(map: JsonObject): SourceFile {
    const options = {
      branches: Array.isArray(map.branches) ? map.branches : [],
      coverage: Array.isArray(map.coverage) ? map.coverage : [],
      source: typeof map.source == 'string' ? map.source : ''
    };

    return new SourceFile(
      typeof map.name == 'string' ? map.name : '',
      typeof map.source_digest == 'string' ? map.source_digest : '',
      options
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonObject {
    const map: JsonObject = {
      coverage: this.coverage,
      name: this.name,
      source_digest: this.sourceDigest // eslint-disable-line @typescript-eslint/camelcase
    };

    if (this.branches.length) map.branches = this.branches;
    if (this.source.length) map.source = this.source;
    return map;
  }
}

/** Defines the options of a [[SourceFile]] instance. */
export interface SourceFileOptions {

  /** The branch data for this file's job. */
  branches: number[];

  /** The coverage data for this file's job. */
  coverage: Array<number|null>;

  /** The contents of this source file. */
  source: string;
}

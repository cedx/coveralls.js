import {JsonMap} from './map';

/**
 * Represents a source code file and its coverage data for a single job.
 */
export class SourceFile {

  /**
   * The coverage data for this file's job.
   */
  public coverage: Array<number | null>;

  /**
   * The contents of this source file.
   */
  public source: string;

  /**
   * Initializes a new instance of the class.
   * @param name The file path of this source file.
   * @param sourceDigest The MD5 digest of the full source code of this file.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(public name: string, public sourceDigest: string, options: Partial<SourceFileOptions> = {}) {
    const {coverage = [], source = ''} = options;
    this.coverage = coverage;
    this.source = source;
  }

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'SourceFile';
  }

  /**
   * Creates a new source file from the specified JSON map.
   * @param map A JSON map representing a source file.
   * @return The instance corresponding to the specified JSON map.
   */
  public static fromJson(map: JsonMap): SourceFile {
    const options = {
      coverage: Array.isArray(map.coverage) ? map.coverage : [],
      source: typeof map.source == 'string' ? map.source : ''
    };

    return new this(
      typeof map.name == 'string' ? map.name : '',
      typeof map.source_digest == 'string' ? map.source_digest : '',
      options
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  public toJSON(): JsonMap {
    const map: JsonMap = {
      coverage: this.coverage,
      name: this.name,
      source_digest: this.sourceDigest
    };

    if (this.source.length) map.source = this.source;
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
 * Defines the options of a `SourceFile` instance.
 */
export interface SourceFileOptions {

  /**
   * The coverage data for this file's job.
   */
  coverage: Array<number | null>;

  /**
   * The contents of this source file.
   */
  source: string;
}

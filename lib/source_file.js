/** Represents a source code file and its coverage data for a single job. */
export class SourceFile {
    /**
     * Creates a new source file.
     * @param name The file path of this source file.
     * @param sourceDigest The MD5 digest of the full source code of this file.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(name, sourceDigest, options = {}) {
        this.name = name;
        this.sourceDigest = sourceDigest;
        const { branches = [], coverage = [], source = "" } = options;
        this.branches = branches;
        this.coverage = coverage;
        this.source = source;
    }
    /**
     * Creates a new source file from the specified JSON object.
     * @param map A JSON object representing a source file.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map) {
        const options = {
            branches: Array.isArray(map.branches) ? map.branches : [],
            coverage: Array.isArray(map.coverage) ? map.coverage : [],
            source: typeof map.source == "string" ? map.source : ""
        };
        return new SourceFile(typeof map.name == "string" ? map.name : "", typeof map.source_digest == "string" ? map.source_digest : "", options);
    }
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON() {
        const map = {
            coverage: this.coverage,
            name: this.name,
            source_digest: this.sourceDigest
        };
        if (this.branches.length)
            map.branches = this.branches;
        if (this.source.length)
            map.source = this.source;
        return map;
    }
}

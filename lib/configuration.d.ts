import { JsonObject, StringMap } from './json';
/** Provides access to the coverage settings. */
export declare class Configuration implements Iterable<[string, string | undefined]> {
    #private;
    /**
     * Creates a new configuration.
     * @param params The configuration parameters.
     */
    constructor(params?: StringMap);
    /**
     * Creates a new configuration from the variables of the specified environment.
     * @param env A map providing environment variables.
     * @return The newly created configuration.
     */
    static fromEnvironment(env?: StringMap): Promise<Configuration>;
    /**
     * Creates a new source file from the specified YAML document.
     * @param document A YAML document providing configuration parameters.
     * @return The instance corresponding to the specified YAML document.
     * @throws [[TypeError]] The specified document is empty or invalid.
     */
    static fromYaml(document: string): Configuration;
    /**
     * Loads the default configuration.
     * The default values are read from the environment variables and an optional `.coveralls.yml` file.
     * @param coverallsFile The path to the `.coveralls.yml` file.
     * @return The default configuration.
     */
    static loadDefaults(coverallsFile?: string): Promise<Configuration>;
    /** The keys of this configuration. */
    get keys(): string[];
    /** The number of entries in this configuration. */
    get length(): number;
    /**
     * Returns a new iterator that allows iterating the entries of this configuration.
     * @return An iterator for the entries of this configuration.
     */
    [Symbol.iterator](): IterableIterator<[string, string | undefined]>;
    /**
     * Gets the value associated to the specified key.
     * @param key The key to seek for.
     * @return The value of the configuration parameter, or `undefined` if the parameter is not found.
     */
    get(key: string): string | undefined;
    /**
     * Gets a value indicating whether this configuration contains the specified key.
     * @param key The key to seek for.
     * @return `true` if this configuration contains the specified key, otherwise `false`.
     */
    has(key: string): boolean;
    /**
     * Adds all entries of the specified configuration to this one, ignoring `undefined` values.
     * @param config The configuration to be merged.
     */
    merge(config: Configuration): void;
    /**
     * Removes the value associated to the specified key.
     * @param key The key to seek for.
     * @return The value associated with the specified key before it was removed.
     */
    remove(key: string): string | undefined;
    /**
     * Associates a given value to the specified key.
     * @param key The key to seek for.
     * @param value The parameter value.
     * @return This instance.
     */
    set(key: string, value?: string): this;
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON(): JsonObject;
}

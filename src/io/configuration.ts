import {promises} from 'fs';
import yaml from 'js-yaml';
import {JsonObject, StringMap} from './json';

/** Provides access to the coverage settings. */
export class Configuration implements Iterable<[string, string|undefined]> {

  /** The configuration parameters. */
  private _params: Map<string, string|undefined>;

  /**
   * Creates a new configuration.
   * @param params The configuration parameters.
   */
  constructor(params: StringMap = {}) {
    this._params = new Map<string, string|undefined>(Object.entries(params));
  }

  /**
   * Creates a new configuration from the variables of the specified environment.
   * @param environment A map providing environment variables.
   * @return The newly created configuration.
   */
  static async fromEnvironment(environment: StringMap = process.env): Promise<Configuration> {
    const configuration = new Configuration;

    // Standard.
    const serviceName = environment.CI_NAME ?? '';
    if (serviceName.length) configuration.set('service_name', serviceName);

    if ('CI_BRANCH' in environment) configuration.set('service_branch', environment.CI_BRANCH);
    if ('CI_BUILD_NUMBER' in environment) configuration.set('service_number', environment.CI_BUILD_NUMBER);
    if ('CI_BUILD_URL' in environment) configuration.set('service_build_url', environment.CI_BUILD_URL);
    if ('CI_COMMIT' in environment) configuration.set('commit_sha', environment.CI_COMMIT);
    if ('CI_JOB_ID' in environment) configuration.set('service_job_id', environment.CI_JOB_ID);

    if ('CI_PULL_REQUEST' in environment) {
      const matches = /(\d+)$/.exec(environment.CI_PULL_REQUEST!);
      if (matches && matches.length >= 2) configuration.set('service_pull_request', matches[1]);
    }

    // Coveralls.
    if ('COVERALLS_REPO_TOKEN' in environment || 'COVERALLS_TOKEN' in environment)
      configuration.set('repo_token', environment.COVERALLS_REPO_TOKEN ? environment.COVERALLS_REPO_TOKEN : environment.COVERALLS_TOKEN);

    if ('COVERALLS_COMMIT_SHA' in environment) configuration.set('commit_sha', environment.COVERALLS_COMMIT_SHA);
    if ('COVERALLS_FLAG_NAME' in environment) configuration.set('flag_name', environment.COVERALLS_FLAG_NAME);
    if ('COVERALLS_PARALLEL' in environment) configuration.set('parallel', environment.COVERALLS_PARALLEL);
    if ('COVERALLS_RUN_AT' in environment) configuration.set('run_at', environment.COVERALLS_RUN_AT);
    if ('COVERALLS_SERVICE_BRANCH' in environment) configuration.set('service_branch', environment.COVERALLS_SERVICE_BRANCH);
    if ('COVERALLS_SERVICE_JOB_ID' in environment) configuration.set('service_job_id', environment.COVERALLS_SERVICE_JOB_ID);
    if ('COVERALLS_SERVICE_NAME' in environment) configuration.set('service_name', environment.COVERALLS_SERVICE_NAME);

    // Git.
    if ('GIT_AUTHOR_EMAIL' in environment) configuration.set('git_author_email', environment.GIT_AUTHOR_EMAIL);
    if ('GIT_AUTHOR_NAME' in environment) configuration.set('git_author_name', environment.GIT_AUTHOR_NAME);
    if ('GIT_BRANCH' in environment) configuration.set('service_branch', environment.GIT_BRANCH);
    if ('GIT_COMMITTER_EMAIL' in environment) configuration.set('git_committer_email', environment.GIT_COMMITTER_EMAIL);
    if ('GIT_COMMITTER_NAME' in environment) configuration.set('git_committer_name', environment.GIT_COMMITTER_NAME);
    if ('GIT_ID' in environment) configuration.set('commit_sha', environment.GIT_ID);
    if ('GIT_MESSAGE' in environment) configuration.set('git_message', environment.GIT_MESSAGE);

    // CI services.
    const merge = async (service: string): Promise<void> => {
      const {getConfiguration} = await import(`./services/${service}`);
      configuration.merge(getConfiguration(environment));
    };

    if ('TRAVIS' in environment) {
      await merge('travis_ci');
      if (serviceName.length && serviceName != 'travis-ci') configuration.set('service_name', serviceName);
    }
    else if ('APPVEYOR' in environment) await merge('appveyor');
    else if ('CIRCLECI' in environment) await merge('circleci');
    else if (serviceName == 'codeship') await merge('codeship');
    else if ('GITHUB_WORKFLOW' in environment) await merge('github');
    else if ('GITLAB_CI' in environment) await merge('gitlab_ci');
    else if ('JENKINS_URL' in environment) await merge('jenkins');
    else if ('SEMAPHORE' in environment) await merge('semaphore');
    else if ('SURF_SHA1' in environment) await merge('surf');
    else if ('TDDIUM' in environment) await merge('solano_ci');
    else if ('WERCKER' in environment) await merge('wercker');

    return configuration;
  }

  /**
   * Creates a new source file from the specified YAML document.
   * @param document A YAML document providing configuration parameters.
   * @return The instance corresponding to the specified YAML document.
   * @throws [[TypeError]] The specified document is empty or invalid.
   */
  static fromYaml(document: string): Configuration {
    if (!document.trim().length) throw new TypeError('The specified YAML document is empty.');

    try {
      const map = yaml.safeLoad(document);
      if (!map || typeof map != 'object') throw new TypeError('The specified YAML document is invalid.');
      return new Configuration(map);
    }

    catch (err) {
      if (err instanceof yaml.YAMLException) throw new TypeError('The specified YAML document is invalid.');
      throw err;
    }
  }

  /**
   * Loads the default configuration.
   * The default values are read from the environment variables and an optional `.coveralls.yml` file.
   * @param coverallsFile The path to the `.coveralls.yml` file.
   * @return The default configuration.
   */
  static async loadDefaults(coverallsFile: string = '.coveralls.yml'): Promise<Configuration> {
    const defaults = await Configuration.fromEnvironment();

    try {
      defaults.merge(Configuration.fromYaml(await promises.readFile(coverallsFile, 'utf8')));
      return defaults;
    }

    catch {
      return defaults;
    }
  }

  /** The keys of this configuration. */
  get keys(): string[] {
    return [...this._params.keys()];
  }

  /** The number of entries in this configuration. */
  get length(): number {
    return this._params.size;
  }

  /**
   * Returns a new iterator that allows iterating the entries of this configuration.
   * @return An iterator for the entries of this configuration.
   */
  [Symbol.iterator](): IterableIterator<[string, string|undefined]> {
    return this._params.entries();
  }

  /**
   * Gets the value associated to the specified key.
   * @param key The key to seek for.
   * @return The value of the configuration parameter, or `undefined` if the parameter is not found.
   */
  get(key: string): string|undefined {
    return this._params.get(key);
  }

  /**
   * Gets a value indicating whether this configuration contains the specified key.
   * @param key The key to seek for.
   * @return `true` if this configuration contains the specified key, otherwise `false`.
   */
  has(key: string): boolean {
    return this._params.has(key);
  }

  /**
   * Adds all entries of the specified configuration to this one, ignoring `undefined` values.
   * @param configuration The configuration to be merged.
   */
  merge(configuration: Configuration): void {
    for (const [key, value] of configuration)
      if (value != undefined) this.set(key, value);
  }

  /**
   * Removes the value associated to the specified key.
   * @param key The key to seek for.
   * @return The value associated with the specified key before it was removed.
   */
  remove(key: string): string|undefined {
    const previousValue = this.get(key);
    this._params.delete(key);
    return previousValue;
  }

  /**
   * Associates a given value to the specified key.
   * @param key The key to seek for.
   * @param value The parameter value.
   * @return This instance.
   */
  set(key: string, value?: string): this {
    this._params.set(key, value);
    return this;
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonObject {
    const map: JsonObject = {};
    for (const [key, value] of this) map[key] = value ?? null;
    return map;
  }
}

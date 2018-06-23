'use strict';

const {promises} = require('fs');
const {safeLoad, YAMLException} = require('js-yaml');

/**
 * Provides access to the coverage settings.
 */
class Configuration {

  /**
   * Initializes a new instance of the class.
   * @param {Object} [params] The configuration parameters.
   */
  constructor(params = {}) {

    /**
     * The configuration parameters.
     * @type {Map<string, *>}
     */
    this._params = new Map(Object.entries(params));
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'Configuration';
  }

  /**
   * Creates a new configuration from the variables of the specified environment.
   * @param {Object} [env] A map providing environment variables. Defaults to `process.env`.
   * @return {Configuration} The newly created configuration.
   */
  static fromEnvironment(env = process.env) {
    let config = new this;

    // Standard.
    let serviceName = typeof env.CI_NAME == 'string' ? env.CI_NAME : '';
    if (serviceName.length) config.set('service_name', serviceName);

    if ('CI_BRANCH' in env) config.set('service_branch', env.CI_BRANCH);
    if ('CI_BUILD_NUMBER' in env) config.set('service_number', env.CI_BUILD_NUMBER);
    if ('CI_BUILD_URL' in env) config.set('service_build_url', env.CI_BUILD_URL);
    if ('CI_COMMIT' in env) config.set('commit_sha', env.CI_COMMIT);
    if ('CI_JOB_ID' in env) config.set('service_job_id', env.CI_JOB_ID);

    if ('CI_PULL_REQUEST' in env) {
      let matches = /(\d+)$/.exec(env.CI_PULL_REQUEST);
      if (matches && matches.length >= 2) config.set('service_pull_request', matches[1]);
    }

    // Coveralls.
    if ('COVERALLS_REPO_TOKEN' in env || 'COVERALLS_TOKEN' in env)
      config.set('repo_token', env.COVERALLS_REPO_TOKEN ? env.COVERALLS_REPO_TOKEN : env.COVERALLS_TOKEN);

    if ('COVERALLS_COMMIT_SHA' in env) config.set('commit_sha', env.COVERALLS_COMMIT_SHA);
    if ('COVERALLS_PARALLEL' in env) config.set('parallel', env.COVERALLS_PARALLEL);
    if ('COVERALLS_RUN_AT' in env) config.set('run_at', env.COVERALLS_RUN_AT);
    if ('COVERALLS_SERVICE_BRANCH' in env) config.set('service_branch', env.COVERALLS_SERVICE_BRANCH);
    if ('COVERALLS_SERVICE_JOB_ID' in env) config.set('service_job_id', env.COVERALLS_SERVICE_JOB_ID);
    if ('COVERALLS_SERVICE_NAME' in env) config.set('service_name', env.COVERALLS_SERVICE_NAME);

    // Git.
    if ('GIT_AUTHOR_EMAIL' in env) config.set('git_author_email', env.GIT_AUTHOR_EMAIL);
    if ('GIT_AUTHOR_NAME' in env) config.set('git_author_name', env.GIT_AUTHOR_NAME);
    if ('GIT_BRANCH' in env) config.set('service_branch', env.GIT_BRANCH);
    if ('GIT_COMMITTER_EMAIL' in env) config.set('git_committer_email', env.GIT_COMMITTER_EMAIL);
    if ('GIT_COMMITTER_NAME' in env) config.set('git_committer_name', env.GIT_COMMITTER_NAME);
    if ('GIT_ID' in env) config.set('commit_sha', env.GIT_ID);
    if ('GIT_MESSAGE' in env) config.set('git_message', env.GIT_MESSAGE);

    // CI services.
    const merge = service => {
      const {getConfiguration} = require(`./services/${service}`);
      config.merge(getConfiguration(env));
    };

    if ('TRAVIS' in env) {
      merge('travis_ci');
      if (serviceName.length && serviceName != 'travis-ci') config.set('service_name', serviceName);
    }
    else if ('APPVEYOR' in env) merge('appveyor');
    else if ('CIRCLECI' in env) merge('circleci');
    else if (serviceName == 'codeship') merge('codeship');
    else if ('GITLAB_CI' in env) merge('gitlab_ci');
    else if ('JENKINS_URL' in env) merge('jenkins');
    else if ('SEMAPHORE' in env) merge('semaphore');
    else if ('SURF_SHA1' in env) merge('surf');
    else if ('TDDIUM' in env) merge('solano_ci');
    else if ('WERCKER' in env) merge('wercker');

    return config;
  }

  /**
   * Creates a new source file from the specified YAML document.
   * @param {string} document A YAML document providing configuration parameters.
   * @return {Configuration} The instance corresponding to the specified YAML document.
   * @throws {TypeError} The specified document is invalid.
   */
  static fromYaml(document) {
    if (typeof document != 'string' || !document.trim().length) throw new TypeError('The specified YAML document is empty.');

    try {
      let map = safeLoad(document);
      if (!map || typeof map != 'object') throw new TypeError('The specified YAML document is invalid.');
      return new this(map);
    }

    catch (err) {
      if (err instanceof YAMLException) throw new TypeError('The specified YAML document is invalid.');
      throw err;
    }
  }

  /**
   * Loads the default configuration.
   * The default values are read from the environment variables and an optional `.coveralls.yml` file.
   * @param {string} [coverallsFile] The path to the `.coveralls.yml` file. Defaults to the file found in the current directory.
   * @return {Promise<Configuration>} The default configuration.
   */
  static async loadDefaults(coverallsFile = '.coveralls.yml') {
    let defaults = Configuration.fromEnvironment();

    try {
      defaults.merge(Configuration.fromYaml(await promises.readFile(coverallsFile, 'utf8')));
      return defaults;
    }

    catch (err) {
      return defaults;
    }
  }

  /**
   * The keys of this configuration.
   * @type {string[]}
   */
  get keys() {
    let keys = [];
    keys.push(...this._params.keys());
    return keys;
  }

  /**
   * The number of entries in this configuration.
   * @type {number}
   */
  get length() {
    return this._params.size;
  }

  /**
   * Returns a new iterator that allows iterating the entries of this configuration.
   * @return {Iterator<Array>} An iterator for the entries of this configuration.
   */
  [Symbol.iterator]() {
    return this._params.entries();
  }

  /**
   * Gets the value associated to the specified key.
   * @param {string} key The key to seek for.
   * @param {*} defaultValue The default parameter value if it does not exist.
   * @return {*} The value of the configuration parameter, or the default value if the parameter is not found.
   */
  get(key, defaultValue = null) {
    return this.has(key) ? this._params.get(key) : defaultValue;
  }

  /**
   * Gets a value indicating whether this configuration contains the specified key.
   * @param {string} key The key to seek for.
   * @return {boolean} `true` if this configuration contains the specified key, otherwise `false`.
   */
  has(key) {
    return this._params.has(key);
  }

  /**
   * Adds all entries of the specified configuration to this one.
   * @param {Configuration} config The configuration to be merged.
   */
  merge(config) {
    for (let [key, value] of config) this.set(key, value);
  }

  /**
   * Removes the value associated to the specified key.
   * @param {string} key The key to seek for.
   */
  remove(key) {
    this._params.delete(key);
  }

  /**
   * Associates a given value to the specified key.
   * @param {string} key The key to seek for.
   * @param {*} value The parameter value.
   */
  set(key, value) {
    this._params.set(key, value);
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {Object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = {};
    for (let [key, value] of this) map[key] = value;
    return map;
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
}

// Module exports.
exports.Configuration = Configuration;

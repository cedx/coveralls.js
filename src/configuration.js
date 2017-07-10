import {readFile} from 'fs';
import {safeLoad as loadYAML} from 'js-yaml';
import {Observable} from 'rxjs';

import {getConfiguration as getAppveyorConfig} from './services/appveyor';
import {getConfiguration as getCircleCIConfig} from './services/circleci';
import {getConfiguration as getCodeshipConfig} from './services/codeship';
import {getConfiguration as getGitLabCIConfig} from './services/gitlab_ci';
import {getConfiguration as getJenkinsConfig} from './services/jenkins';
import {getConfiguration as getSemaphoreConfig} from './services/semaphore';
import {getConfiguration as getSolanoCIConfig} from './services/solano_ci';
import {getConfiguration as getSurfConfig} from './services/surf';
import {getConfiguration as getTravisCIConfig} from './services/travis_ci';
import {getConfiguration as getWerckerConfig} from './services/wercker';

/**
 * Provides access to the coverage settings.
 */
export class Configuration {

  /**
   * Initializes a new instance of the class.
   * @param {object} [params] The configuration parameters.
   */
  constructor(params = {}) {

    /**
     * The configuration parameters.
     * @type {Map<string, *>}
     */
    this._params = new Map(Object.entries(params));
  }

  /**
   * Creates a new configuration from the variables of the specified environment.
   * @param {object} [env] A map providing environment variables. Defaults to `process.env`.
   * @return {Configuration} The newly created configuration.
   */
  static fromEnvironment(env = process.env) {
    let config = new Configuration;

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
    if ('TRAVIS' in env) {
      config.merge(getTravisCIConfig(env));
      if (serviceName.length && serviceName != 'travis-ci') config.set('service_name', serviceName);
    }
    else if ('APPVEYOR' in env) config.merge(getAppveyorConfig(env));
    else if ('CIRCLECI' in env) config.merge(getCircleCIConfig(env));
    else if (serviceName == 'codeship') config.merge(getCodeshipConfig(env));
    else if ('GITLAB_CI' in env) config.merge(getGitLabCIConfig(env));
    else if ('JENKINS_URL' in env) config.merge(getJenkinsConfig(env));
    else if ('SEMAPHORE' in env) config.merge(getSemaphoreConfig(env));
    else if ('SURF_SHA1' in env) config.merge(getSurfConfig(env));
    else if ('TDDIUM' in env) config.merge(getSolanoCIConfig(env));
    else if ('WERCKER' in env) config.merge(getWerckerConfig(env));

    return config;
  }

  /**
   * Creates a new source file from the specified YAML document.
   * @param {string} document A YAML document providing configuration parameters.
   * @return {Configuration} The instance corresponding to the specified YAML document, or `null` if a parsing error occurred.
   */
  static fromYAML(document) {
    if (typeof document != 'string' || !document.length) return null;

    try {
      let map = loadYAML(document);
      return map && typeof map == 'object' ? new Configuration(map) : null;
    }

    catch (error) {
      return null;
    }
  }

  /**
   * Loads the default configuration.
   * The default values are read from the environment variables and an optional `.coveralls.yml` file.
   * @param {string} [coverallsFile] The path to the `.coveralls.yml` file. Defaults to the file found in the current directory.
   * @return {Observable<Configuration>} The default configuration.
   */
  static loadDefaults(coverallsFile = '') {
    const readYAML = Observable.bindNodeCallback(readFile);
    return readYAML(coverallsFile.length ? coverallsFile : '.coveralls.yml', 'utf8')
      .catch(() => null)
      .map(data => {
        let config = Configuration.fromYAML(data);
        let defaults = Configuration.fromEnvironment();
        if (config) defaults.merge(config);
        return defaults;
      });
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
   * @return {object} The map in JSON format corresponding to this object.
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
    return `${this.constructor.name} ${JSON.stringify(this)}`;
  }
}

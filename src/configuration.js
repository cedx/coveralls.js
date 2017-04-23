import fs from 'fs';
import {safeLoad as loadYAML, YAMLException} from 'js-yaml';

import * as appveyor from './services/appveyor';
import * as circleci from './services/circleci';
import * as codeship from './services/codeship';
import * as gitlab_ci from './services/gitlab_ci';
import * as jenkins from './services/jenkins';
import * as semaphore from './services/semaphore';
import * as solano_ci from './services/solano_ci';
import * as surf from './services/surf';
import * as travis_ci from './services/travis_ci';
import * as wercker from './services/wercker';

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
     * @type {object}
     */
    this._params = params;
  }

  /**
   * Creates a new configuration from the variables of the specified environment.
   * @param {object} [env] A map providing environment variables. Defaults to `process.env`.
   * @return {Configuration} The newly created configuration.
   */
  static fromEnvironment(env = process.env) {
    let config = new Configuration();

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
      config.merge(travis_ci.getConfiguration(env));
      if (serviceName.length && serviceName != 'travis-ci') config.set('service_name', serviceName);
    }
    else if ('APPVEYOR' in env) config.merge(appveyor.getConfiguration(env));
    else if ('CIRCLECI' in env) config.merge(circleci.getConfiguration(env));
    else if (serviceName == 'codeship') config.merge(codeship.getConfiguration(env));
    else if ('GITLAB_CI' in env) config.merge(gitlab_ci.getConfiguration(env));
    else if ('JENKINS_URL' in env) config.merge(jenkins.getConfiguration(env));
    else if ('SEMAPHORE' in env) config.merge(semaphore.getConfiguration(env));
    else if ('SURF_SHA1' in env) config.merge(surf.getConfiguration(env));
    else if ('TDDIUM' in env) config.merge(solano_ci.getConfiguration(env));
    else if ('WERCKER' in env) config.merge(wercker.getConfiguration(env));

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
      if (error instanceof YAMLException) return null;
      throw error;
    }
  }

  /**
   * Loads the default configuration.
   * The default values are read from the environment variables and an optional `.coveralls.yml` file.
   * @param {string} [coverallsFile] The path to the `.coveralls.yml` file. Defaults to the file found in the current directory.
   * @return {Promise<Configuration>} The default configuration.
   */
  static async loadDefaults(coverallsFile = '') {
    const readYAML = file => new Promise(resolve =>
      fs.readFile(file, 'utf8', (err, doc) => resolve(err ? null : Configuration.fromYAML(doc)))
    );

    let config = await readYAML(coverallsFile.length ? coverallsFile : `${process.cwd()}/.coveralls.yml`);
    let defaults = Configuration.fromEnvironment();
    if (config) defaults.merge(config);
    return defaults;
  }

  /**
   * The keys of this configuration.
   * @type {string[]}
   */
  get keys() {
    return Object.keys(this._params);
  }

  /**
   * The number of entries in this configuration.
   * @type {number}
   */
  get length() {
    return this.keys.length;
  }

  /**
   * Returns a new iterator that allows iterating the entries of this configuration.
   */
  *[Symbol.iterator]() {
    for (let key of this.keys) yield [key, this.get(key)];
  }

  /**
   * Gets the value associated to the specified key.
   * @param {string} key The key to seek for.
   * @param {*} defaultValue The default parameter value if it does not exist.
   * @return {*} The value of the configuration parameter, or the default value if the parameter is not found.
   */
  get(key, defaultValue = null) {
    return typeof this._params[key] != 'undefined' ? this._params[key] : defaultValue;
  }

  /**
   * Gets a value indicating whether this configuration contains the specified key.
   * @param {string} key The key to seek for.
   * @return {boolean} `true` if this configuration contains the specified key, otherwise `false`.
   */
  has(key) {
    return this.keys.includes(key);
  }

  /**
   * Adds all entries of the specified configuration to this one.
   * @param {Configuration} config The configuration to be merged.
   */
  merge(config) {
    for (let item of config) this.set(item[0], item[1]);
  }

  /**
   * Removes the value associated to the specified key.
   * @param {string} key The key to seek for.
   * @return {*} The value associated with the key before it was removed, or a `null` reference if the key was not found.
   */
  remove(key) {
    let value = this.get(key);
    delete this._params[key];
    return value;
  }

  /**
   * Associates a given value to the specified key.
   * @param {string} key The key to seek for.
   * @param {*} value The parameter value.
   */
  set(key, value) {
    this._params[key] = value;
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    return this._params;
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `${this.constructor.name} ${JSON.stringify(this)}`;
  }
}

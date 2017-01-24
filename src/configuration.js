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
   * Creates a new configuration from the environment variables.
   * @return {Configuration} The newly created configuration.
   */
  static fromEnvironment() {
    let config = new Configuration();

    // Standard.
    let serviceName = typeof process.env.CI_NAME == 'string' ? process.env.CI_NAME : '';
    if (serviceName.length) config.set('service_name', serviceName);

    if ('CI_BRANCH' in process.env) config.set('service_branch', process.env.CI_BRANCH);
    if ('CI_BUILD_NUMBER' in process.env) config.set('service_number', process.env.CI_BUILD_NUMBER);
    if ('CI_BUILD_URL' in process.env) config.set('service_build_url', process.env.CI_BUILD_URL);
    if ('CI_COMMIT' in process.env) config.set('commit_sha', process.env.CI_COMMIT);
    if ('CI_JOB_ID' in process.env) config.set('service_job_id', process.env.CI_JOB_ID);

    if ('CI_PULL_REQUEST' in process.env) {
      let matches = /(\d+)$/.exec(process.env.CI_PULL_REQUEST);
      if (matches && matches.length >= 2) config.set('service_pull_request', matches[1]);
    }

    // Coveralls.
    if ('COVERALLS_COMMIT_SHA' in process.env) config.set('commit_sha', process.env.COVERALLS_COMMIT_SHA);
    if ('COVERALLS_PARALLEL' in process.env) config.set('parallel', process.env.COVERALLS_PARALLEL);
    if ('COVERALLS_REPO_TOKEN' in process.env) config.set('repo_token', process.env.COVERALLS_REPO_TOKEN);
    if ('COVERALLS_RUN_AT' in process.env) config.set('run_at', process.env.COVERALLS_RUN_AT);
    if ('COVERALLS_SERVICE_BRANCH' in process.env) config.set('service_branch', process.env.COVERALLS_SERVICE_BRANCH);
    if ('COVERALLS_SERVICE_JOB_ID' in process.env) config.set('service_job_id', process.env.COVERALLS_SERVICE_JOB_ID);
    if ('COVERALLS_SERVICE_NAME' in process.env) config.set('service_name', process.env.COVERALLS_SERVICE_NAME);

    // Git.
    if ('GIT_AUTHOR_EMAIL' in process.env) config.set('git_author_email', process.env.GIT_AUTHOR_EMAIL);
    if ('GIT_AUTHOR_NAME' in process.env) config.set('git_author_name', process.env.GIT_AUTHOR_NAME);
    if ('GIT_BRANCH' in process.env) config.set('service_branch', process.env.GIT_BRANCH);
    if ('GIT_COMMITTER_EMAIL' in process.env) config.set('git_committer_email', process.env.GIT_COMMITTER_EMAIL);
    if ('GIT_COMMITTER_NAME' in process.env) config.set('git_committer_name', process.env.GIT_COMMITTER_NAME);
    if ('GIT_ID' in process.env) config.set('commit_sha', process.env.GIT_ID);
    if ('GIT_MESSAGE' in process.env) config.set('git_message', process.env.GIT_MESSAGE);

    // CI services.
    if ('TRAVIS' in process.env) config.merge(travis_ci.getConfiguration());
    else if ('APPVEYOR' in process.env) config.merge(appveyor.getConfiguration());
    else if ('CIRCLECI' in process.env) config.merge(circleci.getConfiguration());
    else if (serviceName == 'codeship') config.merge(codeship.getConfiguration());
    else if ('GITLAB_CI' in process.env) config.merge(gitlab_ci.getConfiguration());
    else if ('JENKINS_URL' in process.env) config.merge(jenkins.getConfiguration());
    else if ('SEMAPHORE' in process.env) config.merge(semaphore.getConfiguration());
    else if ('SURF_SHA1' in process.env) config.merge(surf.getConfiguration());
    else if ('TDDIUM' in process.env) config.merge(solano_ci.getConfiguration());
    else if ('WERCKER' in process.env) config.merge(wercker.getConfiguration());

    return config;
  }

  /**
   * Creates a new source file from the specified YAML document.
   * @param {string} document A YAML document providing configuration parameters.
   * @return {Configuration} The instance corresponding to the specified YAML document, or `null` if a parsing error occurred.
   */
  static fromYAML(document) {
    try {
      return typeof document == 'string' && document.length ? new Configuration(loadYAML(document)) : null;
    }

    catch (err) {
      if (err instanceof YAMLException) return null;
      throw err;
    }
  }

  /**
   * Returns a new iterator that allows iterating the keys of this configuration.
   */
  *[Symbol.iterator]() {
    for (let key in this._params) yield key;
  }

  /**
   * Gets the value of the configuration parameter with the specified name.
   * @param {string} name The name of the configuration parameter.
   * @param {*} defaultValue The default parameter value if it does not exist.
   * @return {*} The value of the configuration parameter, or the default value if the parameter is not found.
   */
  get(name, defaultValue = null) {
    return typeof this._params[name] != 'undefined' ? this._params[name] : defaultValue;
  }

  /**
   * Loads the default configuration.
   * The default values are read from the `.coveralls.yml` file and the environment variables.
   * @return {Promise<Configuration>} The default configuration.
   */
  static loadDefaults() {
    let readYAML = file => new Promise((resolve, reject) => {
      fs.exists(file, (err, exists) => {
        if (err) reject(err);
        else if (!exists) resolve(null);
        else fs.readFile(file, 'utf8', (err, doc) => {
          if (err) reject(err);
          else resolve(Configuration.fromYAML(doc));
        });
      });
    });

    return readYAML(`${process.cwd()}/.coveralls.yml`).then(config => {
      let defaults = new Configuration();
      if (config) defaults.merge(config);
      defaults.merge(Configuration.fromEnvironment());
      return defaults;
    });
  }

  /**
   * Adds all key-value pairs of the specified configuration to this one.
   * @param {Configuration} config The configuration to be merged.
   */
  merge(config) {
    for (let key of config) this.set(key, config.get(key));
  }

  /**
   * Sets the value of the configuration parameter with the specified name.
   * @param {string} name The name of the configuration parameter.
   * @param {*} value The parameter value.
   */
  set(name, value) {
    this._params[name] = value;
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

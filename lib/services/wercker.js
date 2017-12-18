'use strict';
const {Configuration} = require('../configuration.js');

/**
 * Gets the [Wercker](http://www.wercker.com) configuration parameters from the environment.
 * @param {object} env A map providing environment variables.
 * @return {Configuration} The configuration parameters.
 */
exports.getConfiguration = function getConfiguration(env) {
  return new Configuration({
    commit_sha: env.WERCKER_GIT_COMMIT,
    service_branch: env.WERCKER_GIT_BRANCH,
    service_job_id: env.WERCKER_BUILD_ID,
    service_name: 'wercker'
  });
};

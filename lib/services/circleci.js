'use strict';
const {Configuration} = require('../configuration.js');

/**
 * Gets the [CircleCI](https://circleci.com) configuration parameters from the environment.
 * @param {object} env A map providing environment variables.
 * @return {Configuration} The configuration parameters.
 */
exports.getConfiguration = function getConfiguration(env) {
  return new Configuration({
    commit_sha: env.CIRCLE_SHA1,
    parallel: Number.parseInt(env.CIRCLE_NODE_TOTAL, 10) > 1 ? 'true' : 'false',
    service_branch: env.CIRCLE_BRANCH,
    service_build_url: env.CIRCLE_BUILD_URL,
    service_job_number: env.CIRCLE_NODE_INDEX,
    service_name: 'circleci',
    service_number: env.CIRCLE_BUILD_NUM
  });
};

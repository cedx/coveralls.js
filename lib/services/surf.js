'use strict';
const {Configuration} = require('../configuration.js');

/**
 * Gets the [Surf](https://github.com/surf-build/surf) configuration parameters from the environment.
 * @param {Object} env A map providing environment variables.
 * @return {Configuration} The configuration parameters.
 */
exports.getConfiguration = function getConfiguration(env) {
  return new Configuration({
    commit_sha: env.SURF_SHA1,
    service_branch: env.SURF_REF,
    service_name: 'surf'
  });
};

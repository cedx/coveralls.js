const {Configuration} = require('../configuration.js');

/**
 * Gets the [Codeship](https://codeship.com) configuration parameters from the environment.
 * @param {Object} env A map providing environment variables.
 * @return {Configuration} The configuration parameters.
 */
exports.getConfiguration = function getConfiguration(env) {
  return new Configuration({
    commit_sha: env.CI_COMMIT_ID,
    git_committer_email: env.CI_COMMITTER_EMAIL,
    git_committer_name: env.CI_COMMITTER_NAME,
    git_message: env.CI_COMMIT_MESSAGE,
    service_job_id: env.CI_BUILD_NUMBER,
    service_name: 'codeship'
  });
};

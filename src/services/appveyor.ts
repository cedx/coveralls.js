const {Configuration} = require('../configuration.js');

/**
 * Gets the [AppVeyor](https://www.appveyor.com) configuration parameters from the environment.
 * @param {Object} env A map providing environment variables.
 * @return {Configuration} The configuration parameters.
 */
exports.getConfiguration = function getConfiguration(env) {
  let repoName = env.APPVEYOR_REPO_NAME;
  let serviceNumber = env.APPVEYOR_BUILD_VERSION;

  return new Configuration({
    commit_sha: env.APPVEYOR_REPO_COMMIT,
    git_author_email: env.APPVEYOR_REPO_COMMIT_AUTHOR_EMAIL,
    git_author_name: env.APPVEYOR_REPO_COMMIT_AUTHOR,
    git_message: env.APPVEYOR_REPO_COMMIT_MESSAGE,
    service_branch: env.APPVEYOR_REPO_BRANCH,
    service_build_url: repoName && serviceNumber ? `https://ci.appveyor.com/project/${repoName}/build/${serviceNumber}` : null,
    service_job_id: env.APPVEYOR_BUILD_ID,
    service_job_number: env.APPVEYOR_BUILD_NUMBER,
    service_name: 'appveyor',
    service_number: serviceNumber
  });
};

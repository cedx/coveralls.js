import {Configuration} from '../configuration';

/**
 * Gets the [AppVeyor](https://www.appveyor.com) configuration parameters from the environment.
 * @return {Configuration} The configuration parameters.
  */
export function getConfiguration() {
  let repoName = process.env.APPVEYOR_REPO_NAME;
  let serviceNumber = process.env.APPVEYOR_BUILD_VERSION;

  return new Configuration({
    commit_sha: process.env.APPVEYOR_REPO_COMMIT,
    git_author_email: process.env.APPVEYOR_REPO_COMMIT_AUTHOR_EMAIL,
    git_author_name: process.env.APPVEYOR_REPO_COMMIT_AUTHOR,
    git_message: process.env.APPVEYOR_REPO_COMMIT_MESSAGE,
    service_branch: process.env.APPVEYOR_REPO_BRANCH,
    service_build_url: `https://ci.appveyor.com/project/${repoName}/build/${serviceNumber}`,
    service_job_id: process.env.APPVEYOR_BUILD_ID,
    service_job_number: process.env.APPVEYOR_BUILD_NUMBER,
    service_name: 'appveyor',
    service_number: serviceNumber
  });
}

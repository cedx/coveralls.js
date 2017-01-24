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
    service_branch: process.env.APPVEYOR_REPO_BRANCH,
    service_build_url: `https://ci.appveyor.com/project/${repoName}/build/${serviceNumber}`,
    service_job_id: process.env.APPVEYOR_BUILD_ID,
    service_job_number: process.env.APPVEYOR_BUILD_NUMBER,
    service_name: 'appveyor',
    service_number: serviceNumber
  });
}

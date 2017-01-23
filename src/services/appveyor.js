import {Configuration} from '../configuration';

/**
 * Gets the [AppVeyor](https://www.appveyor.com) configuration parameters from the environment.
 * @return {Configuration} The configuration parameters.
  */
export function getConfiguration() {
  return new Configuration({
    git_branch: process.env.APPVEYOR_REPO_BRANCH,
    git_commit: process.env.APPVEYOR_REPO_COMMIT,
    service_job_id: process.env.APPVEYOR_BUILD_ID,
    service_job_number: process.env.APPVEYOR_BUILD_NUMBER,
    service_name: 'appveyor'
  });
}

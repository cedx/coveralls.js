/* eslint-disable @typescript-eslint/camelcase */
import {Configuration} from '../configuration';
import {StringMap} from '../json';

/**
 * Gets the [AppVeyor](https://www.appveyor.com) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(environment: StringMap): Configuration {
  const repoName = environment.APPVEYOR_REPO_NAME;
  const serviceNumber = environment.APPVEYOR_BUILD_VERSION;

  return new Configuration({
    commit_sha: environment.APPVEYOR_REPO_COMMIT,
    git_author_email: environment.APPVEYOR_REPO_COMMIT_AUTHOR_EMAIL,
    git_author_name: environment.APPVEYOR_REPO_COMMIT_AUTHOR,
    git_message: environment.APPVEYOR_REPO_COMMIT_MESSAGE,
    service_branch: environment.APPVEYOR_REPO_BRANCH,
    service_build_url: repoName && serviceNumber ? `https://ci.appveyor.com/project/${repoName}/build/${serviceNumber}` : undefined,
    service_job_id: environment.APPVEYOR_BUILD_ID,
    service_job_number: environment.APPVEYOR_BUILD_NUMBER,
    service_name: 'appveyor',
    service_number: serviceNumber
  });
}

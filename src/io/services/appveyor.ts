/* eslint-disable @typescript-eslint/camelcase */
import {Configuration} from '../configuration';
import {StringMap} from '../json';

/**
 * Gets the [AppVeyor](https://www.appveyor.com) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(env: StringMap): Configuration {
  const repoName = env.APPVEYOR_REPO_NAME;
  const serviceNumber = env.APPVEYOR_BUILD_VERSION;

  return new Configuration({
    commit_sha: env.APPVEYOR_REPO_COMMIT,
    git_author_email: env.APPVEYOR_REPO_COMMIT_AUTHOR_EMAIL,
    git_author_name: env.APPVEYOR_REPO_COMMIT_AUTHOR,
    git_message: env.APPVEYOR_REPO_COMMIT_MESSAGE,
    service_branch: env.APPVEYOR_REPO_BRANCH,
    service_build_url: repoName && serviceNumber ? `https://ci.appveyor.com/project/${repoName}/build/${serviceNumber}` : undefined,
    service_job_id: env.APPVEYOR_BUILD_ID,
    service_job_number: env.APPVEYOR_BUILD_NUMBER,
    service_name: 'appveyor',
    service_number: serviceNumber
  });
}

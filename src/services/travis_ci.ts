import {Configuration} from '../configuration';
import {StringMap} from '../map';

/**
 * Gets the [Travis CI](https://travis-ci.com) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(env: StringMap): Configuration {
  const config = new Configuration({
    commit_sha: 'HEAD',
    service_branch: env.TRAVIS_BRANCH,
    service_job_id: env.TRAVIS_JOB_ID,
    service_name: 'travis-ci'
  });

  if ('TRAVIS_PULL_REQUEST' in env && env.TRAVIS_PULL_REQUEST != 'false')
    config.set('service_pull_request', env.TRAVIS_PULL_REQUEST);

  return config;
}

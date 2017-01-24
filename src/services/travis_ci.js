import {Configuration} from '../configuration';

/**
 * Gets the [Travis CI](https://travis-ci.com) configuration parameters from the environment.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration() {
  let config = new Configuration({
    commit_sha: 'HEAD',
    service_branch: process.env.TRAVIS_BRANCH,
    service_job_id: process.env.TRAVIS_JOB_ID,
    service_name: 'travis-ci'
  });

  if('TRAVIS_PULL_REQUEST' in process.env && process.env.TRAVIS_PULL_REQUEST != 'false')
    config.set('service_pull_request', process.env.TRAVIS_PULL_REQUEST);

  return config;
}

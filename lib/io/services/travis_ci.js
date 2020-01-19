/* eslint-disable @typescript-eslint/camelcase */
import { Configuration } from '../configuration.js';
/**
 * Gets the [Travis CI](https://travis-ci.com) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(environment) {
    const configuration = new Configuration({
        commit_sha: environment.TRAVIS_COMMIT,
        flag_name: environment.TRAVIS_JOB_NAME,
        service_branch: environment.TRAVIS_BRANCH,
        service_build_url: environment.TRAVIS_BUILD_WEB_URL,
        service_job_id: environment.TRAVIS_JOB_ID,
        service_name: 'travis-ci'
    });
    if ('TRAVIS_PULL_REQUEST' in environment && environment.TRAVIS_PULL_REQUEST != 'false')
        configuration.set('service_pull_request', environment.TRAVIS_PULL_REQUEST);
    return configuration;
}

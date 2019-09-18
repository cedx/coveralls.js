/* eslint-disable @typescript-eslint/camelcase */
import {Configuration} from '../configuration';
import {StringMap} from '../records';

/**
 * Gets the [GitHub](https://github.com) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(env: StringMap): Configuration {
  const commitSha = 'GITHUB_SHA' in env ? env.GITHUB_SHA! : '';
  const gitRef = 'GITHUB_REF' in env ? env.GITHUB_REF! : '';

  return new Configuration({
    commit_sha: commitSha.length ? commitSha : undefined,
    service_branch: gitRef.startsWith('refs/heads/') ? gitRef.substring('refs/heads/'.length) : undefined,
    service_build_url: commitSha.length ? `https://github.com/cedx/coveralls.js/commit/${commitSha}/checks` : undefined,
    service_name: 'github'
  });
}

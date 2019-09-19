/* eslint-disable @typescript-eslint/camelcase */
import {Configuration} from '../configuration';
import {StringMap} from '../records';

/**
 * Gets the [GitHub](https://github.com) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(env: StringMap): Configuration {
  const commitSha = env.GITHUB_SHA;
  const gitRef = 'GITHUB_REF' in env ? env.GITHUB_REF! : '';
  const repository = env.GITHUB_REPOSITORY;

  return new Configuration({
    commit_sha: commitSha ? commitSha : undefined,
    service_branch: gitRef.startsWith('refs/heads/') ? gitRef.substring(11) : undefined,
    service_build_url: commitSha && repository ? `https://github.com/${repository}/commit/${commitSha}/checks` : undefined,
    service_name: 'github'
  });
}

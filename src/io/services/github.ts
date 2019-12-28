/* eslint-disable @typescript-eslint/camelcase */
import {Configuration} from '../configuration';
import {StringMap} from '../json';

/**
 * Gets the [GitHub](https://github.com) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(environment: StringMap): Configuration {
  const commitSha = environment.GITHUB_SHA;
  const repository = environment.GITHUB_REPOSITORY;

  const gitRef = environment.GITHUB_REF ?? '';
  const gitRegex = /^refs\/\w+\//;

  return new Configuration({
    commit_sha: commitSha ?? undefined,
    service_branch: gitRegex.test(gitRef) ? gitRef.replace(gitRegex, '') : undefined,
    service_build_url: commitSha && repository ? `https://github.com/${repository}/commit/${commitSha}/checks` : undefined,
    service_name: 'github'
  });
}

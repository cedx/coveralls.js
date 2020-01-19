/* eslint-disable @typescript-eslint/camelcase */
import { Configuration } from '../configuration.js';
/**
 * Gets the [GitHub](https://github.com) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(environment) {
    var _a;
    const commitSha = environment.GITHUB_SHA;
    const repository = environment.GITHUB_REPOSITORY;
    const gitRef = (_a = environment.GITHUB_REF, (_a !== null && _a !== void 0 ? _a : ''));
    const gitRegex = /^refs\/\w+\//;
    return new Configuration({
        commit_sha: (commitSha !== null && commitSha !== void 0 ? commitSha : undefined),
        service_branch: gitRegex.test(gitRef) ? gitRef.replace(gitRegex, '') : undefined,
        service_build_url: commitSha && repository ? `https://github.com/${repository}/commit/${commitSha}/checks` : undefined,
        service_name: 'github'
    });
}

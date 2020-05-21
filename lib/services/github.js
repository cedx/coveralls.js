import { Configuration } from "../configuration.js";
/**
 * Gets the [GitHub](https://github.com) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(env) {
    const commitSha = env.GITHUB_SHA;
    const repository = env.GITHUB_REPOSITORY;
    const gitRef = env.GITHUB_REF ?? "";
    const gitRegex = /^refs\/\w+\//;
    return new Configuration({
        commit_sha: commitSha ?? undefined,
        service_branch: gitRegex.test(gitRef) ? gitRef.replace(gitRegex, "") : undefined,
        service_build_url: commitSha && repository ? `https://github.com/${repository}/commit/${commitSha}/checks` : undefined,
        service_name: "github"
    });
}

import { Configuration } from "../configuration.js";
/**
 * Gets the [Wercker](https://app.wercker.com) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(env) {
    return new Configuration({
        commit_sha: env.WERCKER_GIT_COMMIT,
        service_branch: env.WERCKER_GIT_BRANCH,
        service_job_id: env.WERCKER_BUILD_ID,
        service_name: "wercker"
    });
}

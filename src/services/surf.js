/**
 * Gets the [Surf](https://github.com/surf-build/surf) configuration parameters from the environment.
 * @return {object} The configuration parameters.
 */
export function getConfiguration() {
  return {
    git_branch: process.env.SURF_REF,
    git_commit: process.env.SURF_SHA1,
    service_name: 'surf'
  };
}

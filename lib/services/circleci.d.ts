import { Configuration } from "../configuration.js";
import { StringMap } from "../json.js";
/**
 * Gets the [CircleCI](https://circleci.com) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export declare function getConfiguration(env: StringMap): Configuration;

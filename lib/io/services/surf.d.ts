import { Configuration } from '../configuration';
import { StringMap } from '../json';
/**
 * Gets the [Surf](https://github.com/surf-build/surf) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export declare function getConfiguration(environment: StringMap): Configuration;

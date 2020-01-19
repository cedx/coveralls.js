import { Configuration } from '../configuration';
import { StringMap } from '../json';
/**
 * Gets the [Solano CI](https://ci.solanolabs.com) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export declare function getConfiguration(environment: StringMap): Configuration;

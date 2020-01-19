import { Configuration } from '../configuration';
import { StringMap } from '../json';
/**
 * Gets the [Wercker](https://app.wercker.com) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export declare function getConfiguration(environment: StringMap): Configuration;

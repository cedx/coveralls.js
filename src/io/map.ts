/** Defines the shape of a map in JSON format. */
export type JsonMap = StringMap<any>;

/**
 * Defines the shape of a dictionary whose keys are strings.
 * @typeparam T The type of the map values.
 */
export interface StringMap<T = string|undefined> {

  /** Gets or sets the value for the given key. */
  [key: string]: T;
}

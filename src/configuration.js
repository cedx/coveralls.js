/**
 * Provides access to the coverage settings.
 */
export class Configuration {

  /**
   * Initializes a new instance of the class.
   * @param {object} [params] The configuration parameters.
   */
  constructor(params = {}) {

    /**
     * The configuration parameters.
     * @type {object}
     */
    this._params = params;
  }

  /**
   * Returns a new iterator that allows iterating the keys of this configuration.
   * @return {Generator} An iterator for the keys of this configuration.
   */
  *[Symbol.iterator]() {
    for (let key in this._params) yield key;
  }

  /**
   * Gets the value of the configuration parameter with the specified name.
   * @param {string} name The name of the configuration parameter.
   * @param {*} defaultValue The default parameter value if it does not exist.
   * @return {*} The value of the configuration parameter, or the default value if the parameter is not found.
   */
  get(name, defaultValue = undefined) {
    return name in this._params ? this._params[name] : defaultValue;
  }

  /**
   * Sets the value of the configuration parameter with the specified name.
   * @param {string} name The name of the configuration parameter.
   * @param {*} value The parameter value.
   */
  set(name, value) {
    this._params[name] = value;
  }
}

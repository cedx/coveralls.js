import {readFile} from "fs/promises";
import yaml from "js-yaml";
import {JsonObject, StringMap} from "./json.js";

/** Provides access to the coverage settings. */
export class Configuration implements Iterable<[string, string|undefined]> {

	/** The configuration parameters. */
	readonly #params: Map<string, string|undefined>;

	/**
	 * Creates a new configuration.
	 * @param params The configuration parameters.
	 */
	constructor(params: StringMap = {}) {
		this.#params = new Map<string, string|undefined>(Object.entries(params));
	}

	/**
	 * Creates a new configuration from the variables of the specified environment.
	 * @param env A map providing environment variables.
	 * @return The newly created configuration.
	 */
	static async fromEnvironment(env: StringMap = process.env): Promise<Configuration> {
		const config = new Configuration;

		// Standard.
		const serviceName = env.CI_NAME ?? "";
		if (serviceName.length) config.set("service_name", serviceName);

		if ("CI_BRANCH" in env) config.set("service_branch", env.CI_BRANCH);
		if ("CI_BUILD_NUMBER" in env) config.set("service_number", env.CI_BUILD_NUMBER);
		if ("CI_BUILD_URL" in env) config.set("service_build_url", env.CI_BUILD_URL);
		if ("CI_COMMIT" in env) config.set("commit_sha", env.CI_COMMIT);
		if ("CI_JOB_ID" in env) config.set("service_job_id", env.CI_JOB_ID);

		if ("CI_PULL_REQUEST" in env) {
			const matches = /(\d+)$/.exec(env.CI_PULL_REQUEST!);
			if (matches && matches.length >= 2) config.set("service_pull_request", matches[1]);
		}

		// Coveralls.
		if ("COVERALLS_REPO_TOKEN" in env || "COVERALLS_TOKEN" in env)
			config.set("repo_token", env.COVERALLS_REPO_TOKEN ? env.COVERALLS_REPO_TOKEN : env.COVERALLS_TOKEN);

		if ("COVERALLS_COMMIT_SHA" in env) config.set("commit_sha", env.COVERALLS_COMMIT_SHA);
		if ("COVERALLS_FLAG_NAME" in env) config.set("flag_name", env.COVERALLS_FLAG_NAME);
		if ("COVERALLS_PARALLEL" in env) config.set("parallel", env.COVERALLS_PARALLEL);
		if ("COVERALLS_RUN_AT" in env) config.set("run_at", env.COVERALLS_RUN_AT);
		if ("COVERALLS_SERVICE_BRANCH" in env) config.set("service_branch", env.COVERALLS_SERVICE_BRANCH);
		if ("COVERALLS_SERVICE_JOB_ID" in env) config.set("service_job_id", env.COVERALLS_SERVICE_JOB_ID);
		if ("COVERALLS_SERVICE_NAME" in env) config.set("service_name", env.COVERALLS_SERVICE_NAME);

		// Git.
		if ("GIT_AUTHOR_EMAIL" in env) config.set("git_author_email", env.GIT_AUTHOR_EMAIL);
		if ("GIT_AUTHOR_NAME" in env) config.set("git_author_name", env.GIT_AUTHOR_NAME);
		if ("GIT_BRANCH" in env) config.set("service_branch", env.GIT_BRANCH);
		if ("GIT_COMMITTER_EMAIL" in env) config.set("git_committer_email", env.GIT_COMMITTER_EMAIL);
		if ("GIT_COMMITTER_NAME" in env) config.set("git_committer_name", env.GIT_COMMITTER_NAME);
		if ("GIT_ID" in env) config.set("commit_sha", env.GIT_ID);
		if ("GIT_MESSAGE" in env) config.set("git_message", env.GIT_MESSAGE);

		// CI services.
		const merge = async (service: string): Promise<void> => {
			const {getConfiguration} = await import(`./services/${service}.js`);
			config.merge(getConfiguration(env));
		};

		if ("TRAVIS" in env) {
			await merge("travis_ci");
			if (serviceName.length && serviceName != "travis-ci") config.set("service_name", serviceName);
		}
		else if ("APPVEYOR" in env) await merge("appveyor");
		else if ("CIRCLECI" in env) await merge("circleci");
		else if (serviceName == "codeship") await merge("codeship");
		else if ("GITHUB_WORKFLOW" in env) await merge("github");
		else if ("GITLAB_CI" in env) await merge("gitlab_ci");
		else if ("JENKINS_URL" in env) await merge("jenkins");
		else if ("SEMAPHORE" in env) await merge("semaphore");
		else if ("SURF_SHA1" in env) await merge("surf");
		else if ("TDDIUM" in env) await merge("solano_ci");
		else if ("WERCKER" in env) await merge("wercker");

		return config;
	}

	/**
	 * Creates a new source file from the specified YAML document.
	 * @param document A YAML document providing configuration parameters.
	 * @return The instance corresponding to the specified YAML document.
	 * @throws `SyntaxError` The specified document has an invalid format.
	 * @throws `TypeError` The specified document is empty.
	 */
	static fromYaml(document: string): Configuration {
		if (!document.trim().length) throw new TypeError("The specified YAML document is empty.");

		try {
			const map = yaml.safeLoad(document);
			if (!map || typeof map != "object") throw new SyntaxError("The specified YAML document is invalid.");
			return new Configuration(map);
		}

		catch (err) {
			if (err instanceof yaml.YAMLException) throw new SyntaxError("The specified YAML document is invalid.");
			throw err;
		}
	}

	/**
	 * Loads the default configuration.
	 * The default values are read from the environment variables and an optional `.coveralls.yml` file.
	 * @param coverallsFile The path to the `.coveralls.yml` file.
	 * @return The default configuration.
	 */
	static async loadDefaults(coverallsFile: string = ".coveralls.yml"): Promise<Configuration> {
		const defaults = await Configuration.fromEnvironment();

		try {
			defaults.merge(Configuration.fromYaml(await readFile(coverallsFile, "utf8")));
			return defaults;
		}

		catch {
			return defaults;
		}
	}

	/** The keys of this configuration. */
	get keys(): string[] {
		return [...this.#params.keys()];
	}

	/** The number of entries in this configuration. */
	get length(): number {
		return this.#params.size;
	}

	/**
	 * Returns a new iterator that allows iterating the entries of this configuration.
	 * @return An iterator for the entries of this configuration.
	 */
	[Symbol.iterator](): IterableIterator<[string, string|undefined]> {
		return this.#params.entries();
	}

	/**
	 * Gets the value associated to the specified key.
	 * @param key The key to seek for.
	 * @return The value of the configuration parameter, or `undefined` if the parameter is not found.
	 */
	get(key: string): string|undefined {
		return this.#params.get(key);
	}

	/**
	 * Gets a value indicating whether this configuration contains the specified key.
	 * @param key The key to seek for.
	 * @return `true` if this configuration contains the specified key, otherwise `false`.
	 */
	has(key: string): boolean {
		return this.#params.has(key);
	}

	/**
	 * Adds all entries of the specified configuration to this one, ignoring `undefined` values.
	 * @param config The configuration to be merged.
	 */
	merge(config: Configuration): void {
		for (const [key, value] of config)
			if (value != undefined) this.set(key, value);
	}

	/**
	 * Removes the value associated to the specified key.
	 * @param key The key to seek for.
	 * @return The value associated with the specified key before it was removed.
	 */
	remove(key: string): string|undefined {
		const previousValue = this.get(key);
		this.#params.delete(key);
		return previousValue;
	}

	/**
	 * Associates a given value to the specified key.
	 * @param key The key to seek for.
	 * @param value The parameter value.
	 * @return This instance.
	 */
	set(key: string, value?: string): this {
		this.#params.set(key, value);
		return this;
	}

	/**
	 * Converts this object to a map in JSON format.
	 * @return The map in JSON format corresponding to this object.
	 */
	toJSON(): JsonObject {
		const map: JsonObject = {};
		for (const [key, value] of this) map[key] = value ?? null;
		return map;
	}
}

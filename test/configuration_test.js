import {strict as assert} from "assert";
import {Configuration} from "../lib/index.js";

/** Tests the features of the `Configuration` class. */
describe("Configuration", function() {
	describe(".keys", function() {
		it("should return an empty array for an empty configuration", function() {
			assert.equal(new Configuration().keys.length, 0);
		});

		it("should return the list of keys for a non-empty configuration", function() {
			const {keys} = new Configuration({foo: "bar", bar: "baz"});
			assert.equal(keys.length, 2);
			assert.equal(keys[0], "foo");
			assert.equal(keys[1], "bar");
		});
	});

	describe(".length", function() {
		it("should return zero for an empty configuration", function() {
			assert.equal(new Configuration().length, 0);
		});

		it("should return the number of entries for a non-empty configuration", function() {
			assert.equal(new Configuration({bar: "baz", foo: "bar"}).length, 2);
		});
	});

	describe(".fromEnvironment()", function() {
		it("should return an empty configuration for an empty environment", async function() {
			assert.equal((await Configuration.fromEnvironment({})).length, 0);
		});

		it("should return an initialized instance for a non-empty environment", async function() {
			const config = await Configuration.fromEnvironment({
				CI_NAME: "travis-pro",
				CI_PULL_REQUEST: "PR #123",
				COVERALLS_REPO_TOKEN: "0123456789abcdef",
				GIT_MESSAGE: "Hello World!",
				TRAVIS: "true",
				TRAVIS_BRANCH: "develop"
			});

			assert.equal(config.get("commit_sha"), undefined);
			assert.equal(config.get("git_message"), "Hello World!");
			assert.equal(config.get("repo_token"), "0123456789abcdef");
			assert.equal(config.get("service_branch"), "develop");
			assert.equal(config.get("service_name"), "travis-pro");
			assert.equal(config.get("service_pull_request"), "123");
		});
	});

	describe(".fromYaml()", function() {
		it("should throw an exception with a non-object value", function() {
			assert.throws(() => Configuration.fromYaml("**123/456**"), SyntaxError);
			assert.throws(() => Configuration.fromYaml("foo"), SyntaxError);
		});

		it("should return an initialized instance for a non-empty map", function() {
			const config = Configuration.fromYaml("repo_token: 0123456789abcdef\nservice_name: travis-ci");
			assert(config instanceof Configuration);
			assert.equal(config.length, 2);
			assert.equal(config.get("repo_token"), "0123456789abcdef");
			assert.equal(config.get("service_name"), "travis-ci");
		});
	});

	describe(".loadDefaults()", function() {
		it("should properly initialize from a `.coveralls.yml` file", async function() {
			const config = await Configuration.loadDefaults("test/fixtures/.coveralls.yml");
			assert(config.length >= 2);
			assert.equal(config.get("repo_token"), "yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt");
			assert.equal(config.get("service_name"), "travis-pro");
		});

		it("should use the environment defaults if the `.coveralls.yml` file is not found", async function() {
			const config = await Configuration.loadDefaults(".dummy/config.yml");
			const defaults = await Configuration.fromEnvironment();
			assert.deepEqual(config.toJSON(), defaults.toJSON());
		});
	});

	describe(".[SymbolIterator]()", function() {
		it("should return a done iterator if configuration is empty", function() {
			const config = new Configuration;
			const iterator = config[Symbol.iterator]();
			assert(iterator.next().done);
		});

		it("should return a value iterator if configuration is not empty", function() {
			const config = new Configuration({foo: "bar", bar: "baz"});
			const iterator = config[Symbol.iterator]();

			let next = iterator.next();
			assert.equal(next.done, false);
			assert.equal(next.value[0], "foo");
			assert.equal(next.value[1], "bar");

			next = iterator.next();
			assert.equal(next.done, false);
			assert.equal(next.value[0], "bar");
			assert.equal(next.value[1], "baz");
			assert(iterator.next().done);
		});

		it("should allow the `iterable` protocol", function() {
			const config = new Configuration({foo: "bar", bar: "baz"});
			let index = 0;
			for (const [key, value] of config) {
				if (index == 0) {
					assert.equal(key, "foo");
					assert.equal(value, "bar");
				}
				else if (index == 1) {
					assert.equal(key, "bar");
					assert.equal(value, "baz");
				}
				else assert.fail("More than two iteration rounds.");
				index++;
			}
		});
	});

	describe(".get()", function() {
		it("should properly get the configuration entries", function() {
			const config = new Configuration;
			assert.equal(config.get("foo"), undefined);

			config.set("foo", "bar");
			assert.equal(config.get("foo"), "bar");
		});
	});

	describe(".has()", function() {
		it("should return `false` if the specified key is not contained", function() {
			assert.equal(new Configuration().has("foo"), false);
		});

		it("should return `true` if the specified key is contained", function() {
			assert(new Configuration({foo: "bar"}).has("foo"));
		});
	});

	describe(".merge()", function() {
		it("should have the same entries as the other configuration", function() {
			const config = new Configuration;
			assert.equal(config.length, 0);

			config.merge(new Configuration({bar: "baz", foo: "bar"}));
			assert.equal(config.length, 2);
			assert.equal(config.get("foo"), "bar");
			assert.equal(config.get("bar"), "baz");
		});
	});

	describe(".remove()", function() {
		it("should properly remove the configuration entries", function() {
			const config = new Configuration({bar: "baz", foo: "bar"});
			assert.equal(config.length, 2);

			config.remove("foo");
			assert.equal(config.length, 1);
			config.remove("bar");
			assert.equal(config.length, 0);
		});
	});

	describe(".set()", function() {
		it("should properly set the configuration entries", function() {
			const config = new Configuration;
			assert.equal(config.get("foo"), undefined);

			config.set("foo", "bar");
			assert.equal(config.get("foo"), "bar");
		});
	});

	describe(".toJSON()", function() {
		it("should return an empty map for a newly created instance", function() {
			assert.deepEqual(new Configuration().toJSON(), {});
		});

		it("should return a non-empty map for an initialized instance", function() {
			const config = new Configuration({baz: "qux", foo: "bar"});
			assert.deepEqual(config.toJSON(), {baz: "qux", foo: "bar"});
		});
	});
});

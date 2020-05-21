import {strict as assert} from "assert";
import {GitCommit, GitData, GitRemote} from "../lib/index.js";

/** Tests the features of the `GitCommit` class. */
describe("GitCommit", function() {
	describe(".fromJson()", function() {
		it("should return an instance with default values for an empty map", function() {
			const remote = GitCommit.fromJson({});
			assert.equal(remote.authorEmail.length, 0);
			assert.equal(remote.authorName.length, 0);
			assert.equal(remote.id.length, 0);
			assert.equal(remote.message.length, 0);
		});

		it("should return an initialized instance for a non-empty map", function() {
			const remote = GitCommit.fromJson({
				author_email: "anonymous@secret.com",
				author_name: "Anonymous",
				id: "2ef7bde608ce5404e97d5f042f95f89f1c232871",
				message: "Hello World!"
			});

			assert.equal(remote.authorEmail, "anonymous@secret.com");
			assert.equal(remote.authorName, "Anonymous");
			assert.equal(remote.id, "2ef7bde608ce5404e97d5f042f95f89f1c232871");
			assert.equal(remote.message, "Hello World!");
		});
	});

	describe(".toJSON()", function() {
		it("should return a map with default values for a newly created instance", function() {
			const map = new GitCommit("").toJSON();
			assert.equal(Object.keys(map).length, 1);
			assert.equal(map.id.length, 0);
		});

		it("should return a non-empty map for an initialized instance", function() {
			const commit = new GitCommit("2ef7bde608ce5404e97d5f042f95f89f1c232871", {
				authorEmail: "anonymous@secret.com",
				authorName: "Anonymous",
				message: "Hello World!"
			});

			const map = commit.toJSON();
			assert.equal(Object.keys(map).length, 4);
			assert.equal(map.author_email, "anonymous@secret.com");
			assert.equal(map.author_name, "Anonymous");
			assert.equal(map.id, "2ef7bde608ce5404e97d5f042f95f89f1c232871");
			assert.equal(map.message, "Hello World!");
		});
	});
});

/** Tests the features of the `GitData` class. */
describe("GitData", function() {
	describe(".fromJson()", function() {
		it("should return an instance with default values for an empty map", function() {
			const data = GitData.fromJson({});
			assert.equal(data.branch.length, 0);
			assert.equal(data.commit, undefined);
			assert.equal(data.remotes.length, 0);
		});

		it("should return an initialized instance for a non-empty map", function() {
			const data = GitData.fromJson({
				branch: "develop",
				head: {id: "2ef7bde608ce5404e97d5f042f95f89f1c232871"},
				remotes: [{name: "origin"}]
			});

			assert.equal(data.branch, "develop");
			assert(data.commit instanceof GitCommit);
			assert.equal(data.commit.id, "2ef7bde608ce5404e97d5f042f95f89f1c232871");

			assert.equal(data.remotes.length, 1);
			assert(data.remotes[0] instanceof GitRemote);
			assert.equal(data.remotes[0].name, "origin");
		});
	});

	describe(".fromRepository()", function() {
		it("should retrieve the Git data from the executable output", async function() {
			const data = await GitData.fromRepository();
			assert(data.branch.length > 0);

			assert(data.commit instanceof GitCommit);
			assert.match(data.commit.id, /^[a-f\d]{40}$/);

			assert(data.remotes.length > 0);
			assert(data.remotes[0] instanceof GitRemote);

			const origins = data.remotes.filter(remote => remote.name == "origin");
			assert.equal(origins.length, 1);

			const {href} = origins[0].url;
			assert([
				"https://git.belin.io/cedx/coveralls.js", 
				"https://git.belin.io/cedx/coveralls.js.git", 
				"https://github.com/cedx/coveralls.js", 
				"https://github.com/cedx/coveralls.js.git"
			].includes(href));
		});
	});

	describe(".toJSON()", function() {
		it("should return a map with default values for a newly created instance", function() {
			const map = new GitData().toJSON();
			assert.equal(Object.keys(map).length, 3);
			assert.equal(map.branch.length, 0);
			assert.equal(map.head, null);
			assert(Array.isArray(map.remotes));
			assert.equal(map.remotes.length, 0);
		});

		it("should return a non-empty map for an initialized instance", function() {
			const map = new GitData(new GitCommit("2ef7bde608ce5404e97d5f042f95f89f1c232871"), {
				branch: "develop",
				remotes: [new GitRemote("origin")]
			}).toJSON();

			assert.equal(Object.keys(map).length, 3);
			assert.equal(map.branch, "develop");

			assert.ok(map.head);
			assert.equal(typeof map.head, "object");
			assert.equal(map.head.id, "2ef7bde608ce5404e97d5f042f95f89f1c232871");

			assert(Array.isArray(map.remotes));
			assert.equal(map.remotes.length, 1);
			assert.ok(map.remotes[0]);
			assert.equal(typeof map.remotes[0], "object");
			assert.equal(map.remotes[0].name, "origin");
		});
	});
});

/** Tests the features of the `GitRemote` class. */
describe("GitRemote", function() {
	describe(".fromJson()", function() {
		it("should return an instance with default values for an empty map", function() {
			const remote = GitRemote.fromJson({});
			assert.equal(remote.name.length, 0);
			assert.equal(remote.url, undefined);
		});

		it("should return an initialized instance for a non-empty map", function() {
			let remote = GitRemote.fromJson({name: "origin", url: "git@git.belin.io:cedx/coveralls.js.git"});
			assert.equal(remote.name, "origin");
			assert.equal(remote.url.href, "ssh://git@git.belin.io/cedx/coveralls.js.git");

			remote = GitRemote.fromJson({name: "origin", url: "https://git.belin.io/cedx/coveralls.js.git"});
			assert.equal(remote.url.href, "https://git.belin.io/cedx/coveralls.js.git");
		});
	});

	describe(".toJSON()", function() {
		it("should return a map with default values for a newly created instance", function() {
			const map = new GitRemote("").toJSON();
			assert.equal(Object.keys(map).length, 2);
			assert.equal(map.name.length, 0);
			assert.equal(map.url, null);
		});

		it("should return a non-empty map for an initialized instance", function() {
			let map = new GitRemote("origin", "git@git.belin.io:cedx/coveralls.js.git").toJSON();
			assert.equal(Object.keys(map).length, 2);
			assert.equal(map.name, "origin");
			assert.equal(map.url, "ssh://git@git.belin.io/cedx/coveralls.js.git");

			map = new GitRemote("origin", new URL("https://git.belin.io/cedx/coveralls.js.git")).toJSON();
			assert.equal(map.url, "https://git.belin.io/cedx/coveralls.js.git");
		});
	});
});

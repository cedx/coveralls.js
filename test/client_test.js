import {strict as assert} from "assert";
import {Client, Job} from "../lib/index.js";

/** Tests the features of the `Client` class. */
describe("Client", function() {
	describe(".upload()", function() {
		it("should reject with an empty coverage report", function() {
			assert.rejects(new Client().upload(""), TypeError);
		});

		it("should reject with an invalid coverage report", function() {
			assert.rejects(new Client().upload("end_of_record"), TypeError);
		});
	});

	describe(".uploadJob()", function() {
		it("should reject with an empty test job", function() {
			assert.rejects(new Client().uploadJob(new Job), TypeError);
		});
	});
});

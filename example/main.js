import {Client, ClientError} from "@cedx/coveralls";
import {readFile} from "fs/promises";

/**
 * Uploads a coverage report.
 * @return {Promise<void>} Completes when the program is terminated.
 */
async function main() {
	try {
		const coverage = await readFile("/path/to/coverage.report", "utf8");
		await new Client().upload(coverage);
		console.log("The report was sent successfully.");
	}

	catch (error) {
		console.log(`An error occurred: ${error.message}`);
		if (error instanceof ClientError) console.log(`From: ${error.uri.href}`);
	}
}

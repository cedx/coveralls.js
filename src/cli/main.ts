import program from "commander";
import {readFile} from "fs/promises";
import {Client} from "../client.js";
import {packageVersion} from "./version.g.js";

/**
 * Application entry point.
 * @return Completes when the program is terminated.
 */
export async function main(): Promise<void> {
	// Initialize the application.
	process.title = "Coveralls.js";

	// Parse the command line arguments.
	program.name("coveralls")
		.description("Send a coverage report to the Coveralls service.")
		.version(packageVersion, "-v, --version")
		.arguments("<file>").action(file => program.file = file)
		.parse(process.argv);

	if (!program.file) {
		program.outputHelp();
		process.exitCode = 64;
		return undefined;
	}

	// Run the program.
	const client = new Client("COVERALLS_ENDPOINT" in process.env ? new URL(process.env.COVERALLS_ENDPOINT!) : Client.defaultEndPoint);
	const coverage = await readFile(program.file, "utf8");
	console.log(`[Coveralls] Submitting to ${client.endPoint}`); // eslint-disable-line no-console
	return client.upload(coverage);
}

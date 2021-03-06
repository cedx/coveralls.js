---
path: src/branch/main
source: src/client.ts
---

# Application programming interface
The hard way. Use the `Client` class to upload your coverage reports:

``` js
import {Client, ClientError} from "@cedx/coveralls";
import {readFile} from "fs/promises";

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
```

The `Client.upload()` method returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves when the coverage report has been uploaded.

The promise rejects with a [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
if the input report is invalid. It rejects with a `ClientError` if any error occurred while uploading the report.

## Client events
The `Client` class is an [`EventEmitter`](https://nodejs.org/api/events.html) that triggers some events during its life cycle.

### The `Client.eventRequest` event
Emitted every time a request is made to the remote service:

``` js
import {Client} from "@cedx/coveralls";

function main() {
	const client = new Client;
	client.on(Client.eventRequest, request =>
		console.log(`Client request: ${request.url}`)
	);
}
```

### The `Client.eventResponse` event
Emitted every time a response is received from the remote service:

``` js
import {Client} from "@cedx/coveralls";

function main() {
	const client = new Client;
	client.on(Client.eventResponse, (response, request) =>
		console.log(`Server response: ${response.status}`)
	);
}
```

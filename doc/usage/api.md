# Application programming interface
The hard way. Use the `Client` class to upload your coverage reports:

```javascript
const {Client, ClientError} = require('@cedx/coveralls');
const {promises} = require('fs');

async function main() {
  try {
    let coverage = await promises.readFile('/path/to/coverage.report', 'utf8');
    await new Client().upload(coverage);
    console.log('The report was sent successfully.');
  }
  
  catch (error) {
    console.log(`An error occurred: ${error.message}`);
    if (error instanceof ClientError) console.log(`From: ${error.uri.href}`);
  }
}
```

The `Client#upload()` method returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves when the coverage report has been uploaded.

The promise rejects with a [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
if the input report is invalid. It rejects with a `ClientError` if any error occurred while sending the message.

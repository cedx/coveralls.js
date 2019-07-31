#!/usr/bin/env node
import {main} from '../lib/cli/main.js';

// Start the application.
main().catch(err => {
  console.error(err.message);
  process.exitCode = 1;
});

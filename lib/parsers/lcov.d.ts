import { Job } from "../job.js";
/**
 * Parses the specified [LCOV](http://ltp.sourceforge.net/coverage/lcov.php) coverage report.
 * @param report A coverage report in LCOV format.
 * @return The job corresponding to the specified coverage report.
 */
export declare function parseReport(report: string): Promise<Job>;

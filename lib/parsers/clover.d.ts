import { Job } from "../job.js";
/**
 * Parses the specified [Clover](https://www.atlassian.com/software/clover) coverage report.
 * Rejects with a `TypeError` if the specified report is empty or invalid.
 * @param report A coverage report in Clover format.
 * @return The job corresponding to the specified coverage report.
 */
export declare function parseReport(report: string): Promise<Job>;

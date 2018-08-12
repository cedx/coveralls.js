/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {Client, ClientError, Job} from '../src';

/**
 * Tests the features of the `Client` class.
 */
@suite class ClientTest {

  /**
   * @test {Client#upload}
   */
  @test('It should throw an error with an empty or invalid coverage report')
  public async testUpload(): Promise<void> {
    // It should throw an error with an empty coverage report.
    try {
      await (new Client).upload('');
      expect.fail('Error not thrown');
    }

    catch (err) {
      expect(err).to.be.instanceof(TypeError);
    }

    // It should throw an error with an invalid coverage report.
    try {
      await (new Client).upload('end_of_record');
      expect.fail('Error not thrown');
    }

    catch (err) {
      expect(err).to.be.instanceof(TypeError);
    }
  }

  /**
   * @test {Client#uploadJob}
   */
  @test('It should throw an error with an empty test job')
  public async testUploadJob(): Promise<void> {
    try {
      await (new Client).uploadJob(new Job);
      expect.fail('Error not thrown');
    }

    catch (err) {
      expect(err).to.be.instanceof(TypeError);
    }
  }
}

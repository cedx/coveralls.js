/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {Client, Job} from '../src';

/** Tests the features of the [[Client]] class. */
describe('Client', () => {

  /** Tests the `Client#upload()` method. */
  describe('#upload()', () => {
    it('should throw an error with an empty coverage report', async () => {
      try {
        await (new Client).upload('');
        expect.fail('Error not thrown');
      }

      catch (err) {
        expect(err).to.be.an.instanceof(TypeError);
      }
    });

    it('should throw an error with an invalid coverage report', async () => {
      try {
        await (new Client).upload('end_of_record');
        expect.fail('Error not thrown');
      }

      catch (err) {
        expect(err).to.be.an.instanceof(TypeError);
      }
    });
  });

  /** Tests the `Client#uploadJob()` method. */
  describe('#uploadJob()', async () => {
    it('should throw an error with an empty test job', async () => {
      try {
        await (new Client).uploadJob(new Job);
        expect.fail('Error not thrown');
      }

      catch (err) {
        expect(err).to.be.an.instanceof(TypeError);
      }
    });
  });
});

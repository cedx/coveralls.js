import * as chai from 'chai';
import {Client, Job} from '../src/index';

/** Tests the features of the [[Client]] class. */
describe('Client', () => {
  const {expect} = chai;

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

  describe('#uploadJob()', () => {
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

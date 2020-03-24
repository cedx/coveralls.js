import {strict as assert} from 'assert';
import {Client, Job} from '../lib/index.js';

/** Tests the features of the {@link Client} class. */
describe('Client', () => {
  describe('.upload()', () => {
    it('should reject with an empty coverage report', () => {
      assert.rejects(new Client().upload(''), TypeError);
    });

    it('should reject with an invalid coverage report', () => {
      assert.rejects(new Client().upload('end_of_record'), TypeError);
    });
  });

  describe('.uploadJob()', () => {
    it('should reject with an empty test job', () => {
      assert.rejects(new Client().uploadJob(new Job), TypeError);
    });
  });
});

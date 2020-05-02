import {strict as assert} from 'assert';
import {Configuration} from '../lib/index.js';

/** Tests the features of the `Configuration` class. */
describe('Configuration', () => {
  describe('.keys', () => {
    it('should return an empty array for an empty configuration', () => {
      assert.equal(new Configuration().keys.length, 0);
    });

    it('should return the list of keys for a non-empty configuration', () => {
      const {keys} = new Configuration({foo: 'bar', bar: 'baz'});
      assert.equal(keys.length, 2);
      assert.equal(keys[0], 'foo');
      assert.equal(keys[1], 'bar');
    });
  });

  describe('.length', () => {
    it('should return zero for an empty configuration', () => {
      assert.equal(new Configuration().length, 0);
    });

    it('should return the number of entries for a non-empty configuration', () => {
      assert.equal(new Configuration({bar: 'baz', foo: 'bar'}).length, 2);
    });
  });

  describe('.fromEnvironment()', () => {
    it('should return an empty configuration for an empty environment', async () => {
      assert.equal((await Configuration.fromEnvironment({})).length, 0);
    });

    it('should return an initialized instance for a non-empty environment', async () => {
      const config = await Configuration.fromEnvironment({
        CI_NAME: 'travis-pro',
        CI_PULL_REQUEST: 'PR #123',
        COVERALLS_REPO_TOKEN: '0123456789abcdef',
        GIT_MESSAGE: 'Hello World!',
        TRAVIS: 'true',
        TRAVIS_BRANCH: 'develop'
      });

      assert.equal(config.get('commit_sha'), undefined);
      assert.equal(config.get('git_message'), 'Hello World!');
      assert.equal(config.get('repo_token'), '0123456789abcdef');
      assert.equal(config.get('service_branch'), 'develop');
      assert.equal(config.get('service_name'), 'travis-pro');
      assert.equal(config.get('service_pull_request'), '123');
    });
  });

  describe('.fromYaml()', () => {
    it('should throw an exception with a non-object value', () => {
      assert.throws(() => Configuration.fromYaml('**123/456**'), SyntaxError);
      assert.throws(() => Configuration.fromYaml('foo'), SyntaxError);
    });

    it('should return an initialized instance for a non-empty map', () => {
      const config = Configuration.fromYaml('repo_token: 0123456789abcdef\nservice_name: travis-ci');
      assert(config instanceof Configuration);
      assert.equal(config.length, 2);
      assert.equal(config.get('repo_token'), '0123456789abcdef');
      assert.equal(config.get('service_name'), 'travis-ci');
    });
  });

  describe('.loadDefaults()', () => {
    it('should properly initialize from a `.coveralls.yml` file', async () => {
      const config = await Configuration.loadDefaults('test/fixtures/.coveralls.yml');
      assert(config.length >= 2);
      assert.equal(config.get('repo_token'), 'yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');
      assert.equal(config.get('service_name'), 'travis-pro');
    });

    it('should use the environment defaults if the `.coveralls.yml` file is not found', async () => {
      const config = await Configuration.loadDefaults('.dummy/config.yml');
      const defaults = await Configuration.fromEnvironment();
      assert.deepEqual(config.toJSON(), defaults.toJSON());
    });
  });

  describe('.[SymbolIterator]()', () => {
    it('should return a done iterator if configuration is empty', () => {
      const config = new Configuration;
      const iterator = config[Symbol.iterator]();
      assert(iterator.next().done);
    });

    it('should return a value iterator if configuration is not empty', () => {
      const config = new Configuration({foo: 'bar', bar: 'baz'});
      const iterator = config[Symbol.iterator]();

      let next = iterator.next();
      assert.equal(next.done, false);
      assert.equal(next.value[0], 'foo');
      assert.equal(next.value[1], 'bar');

      next = iterator.next();
      assert.equal(next.done, false);
      assert.equal(next.value[0], 'bar');
      assert.equal(next.value[1], 'baz');
      assert(iterator.next().done);
    });

    it('should allow the "iterable" protocol', () => {
      const config = new Configuration({foo: 'bar', bar: 'baz'});
      let index = 0;
      for (const [key, value] of config) {
        if (index == 0) {
          assert.equal(key, 'foo');
          assert.equal(value, 'bar');
        }
        else if (index == 1) {
          assert.equal(key, 'bar');
          assert.equal(value, 'baz');
        }
        else assert.fail('More than two iteration rounds.');
        index++;
      }
    });
  });

  describe('.get()', () => {
    it('should properly get the configuration entries', () => {
      const config = new Configuration;
      assert.equal(config.get('foo'), undefined);

      config.set('foo', 'bar');
      assert.equal(config.get('foo'), 'bar');
    });
  });

  describe('.has()', () => {
    it('should return `false` if the specified key is not contained', () => {
      assert.equal(new Configuration().has('foo'), false);
    });

    it('should return `true` if the specified key is contained', () => {
      assert(new Configuration({foo: 'bar'}).has('foo'));
    });
  });

  describe('.merge()', () => {
    it('should have the same entries as the other configuration', () => {
      const config = new Configuration;
      assert.equal(config.length, 0);

      config.merge(new Configuration({bar: 'baz', foo: 'bar'}));
      assert.equal(config.length, 2);
      assert.equal(config.get('foo'), 'bar');
      assert.equal(config.get('bar'), 'baz');
    });
  });

  describe('.remove()', () => {
    it('should properly remove the configuration entries', () => {
      const config = new Configuration({bar: 'baz', foo: 'bar'});
      assert.equal(config.length, 2);

      config.remove('foo');
      assert.equal(config.length, 1);
      config.remove('bar');
      assert.equal(config.length, 0);
    });
  });

  describe('.set()', () => {
    it('should properly set the configuration entries', () => {
      const config = new Configuration;
      assert.equal(config.get('foo'), undefined);

      config.set('foo', 'bar');
      assert.equal(config.get('foo'), 'bar');
    });
  });

  describe('.toJSON()', () => {
    it('should return an empty map for a newly created instance', () => {
      assert.deepEqual(new Configuration().toJSON(), {});
    });

    it('should return a non-empty map for an initialized instance', () => {
      const config = new Configuration({baz: 'qux', foo: 'bar'});
      assert.deepEqual(config.toJSON(), {baz: 'qux', foo: 'bar'});
    });
  });
});

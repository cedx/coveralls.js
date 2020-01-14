import chai from 'chai';
import {Configuration} from '../lib/index.js';

/** Tests the features of the [[Configuration]] class. */
describe('Configuration', () => {
  const {expect} = chai;

  describe('#keys', () => {
    it('should return an empty array for an empty configuration', () => {
      expect(new Configuration().keys).to.be.empty;
    });

    it('should return the list of keys for a non-empty configuration', () => {
      const {keys} = new Configuration({foo: 'bar', bar: 'baz'});
      expect(keys).to.have.lengthOf(2);
      expect(keys[0]).to.equal('foo');
      expect(keys[1]).to.equal('bar');
    });
  });

  describe('#length', () => {
    it('should return zero for an empty configuration', () => {
      expect(new Configuration).to.have.lengthOf(0);
    });

    it('should return the number of entries for a non-empty configuration', () => {
      expect(new Configuration({bar: 'baz', foo: 'bar'})).to.have.lengthOf(2);
    });
  });

  describe('.fromEnvironment()', () => {
    it('should return an empty configuration for an empty environment', async () => {
      expect(await Configuration.fromEnvironment({})).to.have.lengthOf(0);
    });

    it('should return an initialized instance for a non-empty environment', async () => {
      const configuration = await Configuration.fromEnvironment({
        CI_NAME: 'travis-pro',
        CI_PULL_REQUEST: 'PR #123',
        COVERALLS_REPO_TOKEN: '0123456789abcdef',
        GIT_MESSAGE: 'Hello World!',
        TRAVIS: 'true',
        TRAVIS_BRANCH: 'develop'
      });

      expect(configuration.get('commit_sha')).to.be.undefined;
      expect(configuration.get('git_message')).to.equal('Hello World!');
      expect(configuration.get('repo_token')).to.equal('0123456789abcdef');
      expect(configuration.get('service_branch')).to.equal('develop');
      expect(configuration.get('service_name')).to.equal('travis-pro');
      expect(configuration.get('service_pull_request')).to.equal('123');
    });
  });

  describe('.fromYaml()', () => {
    it('should throw an exception with a non-object value', () => {
      expect(() => Configuration.fromYaml('**123/456**')).to.throw(TypeError);
      expect(() => Configuration.fromYaml('foo')).to.throw(TypeError);
    });

    it('should return an initialized instance for a non-empty map', () => {
      const configuration = Configuration.fromYaml('repo_token: 0123456789abcdef\nservice_name: travis-ci');
      expect(configuration).to.be.an.instanceof(Configuration);
      expect(configuration).to.have.lengthOf(2);
      expect(configuration.get('repo_token')).to.equal('0123456789abcdef');
      expect(configuration.get('service_name')).to.equal('travis-ci');
    });
  });

  describe('.loadDefaults()', () => {
    it('should properly initialize from a `.coveralls.yml` file', async () => {
      const configuration = await Configuration.loadDefaults('test/fixtures/.coveralls.yml');
      expect(configuration).to.be.an.instanceof(Configuration);
      expect(configuration).to.have.length.of.at.least(2);
      expect(configuration.get('repo_token')).to.equal('yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');
      expect(configuration.get('service_name')).to.equal('travis-pro');
    });

    it('should use the environment defaults if the `.coveralls.yml` file is not found', async () => {
      const configuration = await Configuration.loadDefaults('.dummy/config.yml');
      const defaults = await Configuration.fromEnvironment();
      expect(configuration).to.be.an.instanceof(Configuration);
      expect(configuration.toJSON()).to.deep.equal(defaults.toJSON());
    });
  });

  describe('#[SymbolIterator]()', () => {
    it('should return a done iterator if configuration is empty', () => {
      const configuration = new Configuration;
      const iterator = configuration[Symbol.iterator]();
      expect(iterator.next().done).to.be.true;
    });

    it('should return a value iterator if configuration is not empty', () => {
      const configuration = new Configuration({foo: 'bar', bar: 'baz'});
      const iterator = configuration[Symbol.iterator]();

      let next = iterator.next();
      expect(next.done).to.be.false;
      expect(next.value[0]).to.equal('foo');
      expect(next.value[1]).to.equal('bar');

      next = iterator.next();
      expect(next.done).to.be.false;
      expect(next.value[0]).to.equal('bar');
      expect(next.value[1]).to.equal('baz');
      expect(iterator.next().done).to.be.true;
    });

    it('should allow the "iterable" protocol', () => {
      const configuration = new Configuration({foo: 'bar', bar: 'baz'});
      let index = 0;
      for (const [key, value] of configuration) {
        if (index == 0) {
          expect(key).to.equal('foo');
          expect(value).to.equal('bar');
        }
        else if (index == 1) {
          expect(key).to.equal('bar');
          expect(value).to.equal('baz');
        }
        else expect.fail('More than two iteration rounds.');
        index++;
      }
    });
  });

  describe('#get()', () => {
    it('should properly get the configuration entries', () => {
      const configuration = new Configuration;
      expect(configuration.get('foo')).to.be.undefined;

      configuration.set('foo', 'bar');
      expect(configuration.get('foo')).to.equal('bar');
    });
  });

  describe('#has()', () => {
    it('should return `false` if the specified key is not contained', () => {
      expect(new Configuration().has('foo')).to.be.false;
    });

    it('should return `true` if the specified key is contained', () => {
      expect(new Configuration({foo: 'bar'}).has('foo')).to.be.true;
    });
  });

  describe('#merge()', () => {
    it('should have the same entries as the other configuration', () => {
      const configuration = new Configuration;
      expect(configuration).to.have.lengthOf(0);

      configuration.merge(new Configuration({bar: 'baz', foo: 'bar'}));
      expect(configuration).to.have.lengthOf(2);
      expect(configuration.get('foo')).to.equal('bar');
      expect(configuration.get('bar')).to.equal('baz');
    });
  });

  describe('#remove()', () => {
    it('should properly remove the configuration entries', () => {
      const configuration = new Configuration({bar: 'baz', foo: 'bar'});
      expect(configuration).to.have.lengthOf(2);

      expect(configuration.remove('foo'));
      expect(configuration).to.have.lengthOf(1);
      expect(configuration.remove('bar'));
      expect(configuration).to.have.lengthOf(0);
    });
  });

  describe('#set()', () => {
    it('should properly set the configuration entries', () => {
      const configuration = new Configuration;
      expect(configuration.get('foo')).to.be.undefined;

      configuration.set('foo', 'bar');
      expect(configuration.get('foo')).to.equal('bar');
    });
  });

  describe('#toJSON()', () => {
    it('should return an empty map for a newly created instance', () => {
      expect(new Configuration().toJSON()).to.be.an('object').that.is.empty;
    });

    it('should return a non-empty map for an initialized instance', () => {
      const configuration = new Configuration({baz: 'qux', foo: 'bar'});
      expect(configuration.toJSON()).to.be.an('object').that.deep.equal({
        baz: 'qux',
        foo: 'bar'
      });
    });
  });
});

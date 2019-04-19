/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {Configuration} from '../src';

/** Tests the features of the [[Configuration]] class. */
describe('Configuration', () => {

  /** Tests the `Configuration#keys` property. */
  describe('#keys', () => {
    it('should return an empty array for an empty configuration', () => {
      expect((new Configuration).keys).to.be.empty;
    });

    it('should return the list of keys for a non-empty configuration', () => {
      const keys = new Configuration({foo: 'bar', bar: 'baz'}).keys;
      expect(keys).to.have.lengthOf(2);
      expect(keys[0]).to.equal('foo');
      expect(keys[1]).to.equal('bar');
    });
  });

  /** Tests the `Configuration#length` property. */
  describe('#length', () => {
    it('should return zero for an empty configuration', () => {
      expect(new Configuration).to.have.lengthOf(0);
    });

    it('should return the number of entries for a non-empty configuration', () => {
      expect(new Configuration({bar: 'baz', foo: 'bar'})).to.have.lengthOf(2);
    });
  });

  /** Tests the `Configuration.fromEnvironment()` method. */
  describe('.fromEnvironment()', () => {
    it('should return an empty configuration for an empty environment', async () => {
      expect(await Configuration.fromEnvironment({})).to.have.lengthOf(0);
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

      expect(config.get('commit_sha')).to.equal('HEAD');
      expect(config.get('git_message')).to.equal('Hello World!');
      expect(config.get('repo_token')).to.equal('0123456789abcdef');
      expect(config.get('service_branch')).to.equal('develop');
      expect(config.get('service_name')).to.equal('travis-pro');
      expect(config.get('service_pull_request')).to.equal('123');
    });
  });

  /** Tests the `Configuration.fromYaml()` method. */
  describe('.fromYaml()', () => {
    it('should throw an exception with a non-object value', () => {
      expect(() => Configuration.fromYaml('**123/456**')).to.throw(TypeError);
      expect(() => Configuration.fromYaml('foo')).to.throw(TypeError);
    });

    it('should return an initialized instance for a non-empty map', () => {
      const config = Configuration.fromYaml('repo_token: 0123456789abcdef\nservice_name: travis-ci');
      expect(config).to.be.an.instanceof(Configuration);
      expect(config).to.have.lengthOf(2);
      expect(config.get('repo_token')).to.equal('0123456789abcdef');
      expect(config.get('service_name')).to.equal('travis-ci');
    });
  });

  /** Tests the `Configuration.loadDefaults()` method. */
  describe('.loadDefaults()', () => {
    it('should properly initialize from a `.coveralls.yml` file', async () => {
      const config = await Configuration.loadDefaults('test/fixtures/.coveralls.yml');
      expect(config).to.be.an.instanceof(Configuration);
      expect(config).to.have.length.of.at.least(2);
      expect(config.get('repo_token')).to.equal('yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');
      expect(config.get('service_name')).to.equal('travis-pro');
    });

    it('should use the environment defaults if the `.coveralls.yml` file is not found', async () => {
      const config = await Configuration.loadDefaults('.dummy/config.yml');
      const defaults = await Configuration.fromEnvironment();
      expect(config).to.be.an.instanceof(Configuration);
      expect(config.toJSON()).to.deep.equal(defaults.toJSON());
    });
  });

  /** Tests the `Configuration#[Symbol.iterator]()` method. */
  describe('#[SymbolIterator]()', () => {
    it('should return a done iterator if configuration is empty', () => {
      const config = new Configuration;
      const iterator = config[Symbol.iterator]();
      expect(iterator.next().done).to.be.true;
    });

    it('should return a value iterator if configuration is not empty', () => {
      const config = new Configuration({foo: 'bar', bar: 'baz'});
      const iterator = config[Symbol.iterator]();

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
      const config = new Configuration({foo: 'bar', bar: 'baz'});
      let index = 0;
      for (const [key, value] of config) {
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

  /** Tests the `Configuration#get()` method. */
  describe('#get()', () => {
    it('should properly get the configuration entries', () => {
      const config = new Configuration;
      expect(config.get('foo')).to.be.undefined;

      config.set('foo', 'bar');
      expect(config.get('foo')).to.equal('bar');
    });
  });

  /** Tests the `Configuration#has()` method. */
  describe('#has()', () => {
    it('should return `false` if the specified key is not contained', () => {
      expect((new Configuration).has('foo')).to.be.false;
    });

    it('should return `true` if the specified key is contained', () => {
      expect(new Configuration({foo: 'bar'}).has('foo')).to.be.true;
    });
  });

  /** Tests the `Configuration#merge()` method. */
  describe('#merge()', () => {
    it('should have the same entries as the other configuration', () => {
      const config = new Configuration;
      expect(config).to.have.lengthOf(0);

      config.merge(new Configuration({bar: 'baz', foo: 'bar'}));
      expect(config).to.have.lengthOf(2);
      expect(config.get('foo')).to.equal('bar');
      expect(config.get('bar')).to.equal('baz');
    });
  });

  /** Tests the `Configuration#remove()` method. */
  describe('#remove()', () => {
    it('should properly remove the configuration entries', () => {
      const config = new Configuration({bar: 'baz', foo: 'bar'});
      expect(config).to.have.lengthOf(2);

      expect(config.remove('foo'));
      expect(config).to.have.lengthOf(1);
      expect(config.remove('bar'));
      expect(config).to.have.lengthOf(0);
    });
  });

  /** Tests the `Configuration#set()` method. */
  describe('#set()', () => {
    it('should properly set the configuration entries', () => {
      const config = new Configuration;
      expect(config.get('foo')).to.be.undefined;

      config.set('foo', 'bar');
      expect(config.get('foo')).to.equal('bar');
    });
  });

  /** Tests the `Configuration#toJSON()` method. */
  describe('#toJSON()', () => {
    it('should return an empty map for a newly created instance', () => {
      const map = (new Configuration).toJSON();
      expect(Object.keys(map)).to.be.empty;
    });

    it('should return a non-empty map for an initialized instance', () => {
      const map = new Configuration({bar: 'baz', foo: 'bar'}).toJSON();
      expect(Object.keys(map)).to.have.lengthOf(2);
      expect(map.foo).to.equal('bar');
      expect(map.bar).to.equal('baz');
    });
  });
});

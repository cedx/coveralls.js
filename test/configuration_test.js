'use strict';

import {expect} from 'chai';
import {describe, it} from 'mocha';
import {Configuration} from '../src/index';

/**
 * @test {Configuration}
 */
describe('Configuration', () => {

  /**
   * @test {Configuration.fromEnvironment}
   */
  describe('.fromEnvironment()', () => {
    it('should return an empty configuration for an empty environment', () => {
      expect(Configuration.fromEnvironment({})).to.have.lengthOf(0);
    });

    it('should return an initialized instance for a non-empty environment', () => {
      let config = Configuration.fromEnvironment({
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

  /**
   * @test {Configuration.fromYAML}
   */
  describe('.fromYAML()', () => {
    it('should return a null reference with a non-object value', () => {
      expect(Configuration.fromYAML('**123/456**')).to.be.null;
      expect(Configuration.fromYAML('foo')).to.be.null;
    });

    it('should return an initialized instance for a non-empty map', () => {
      let config = Configuration.fromYAML('repo_token: 0123456789abcdef\nservice_name: travis-ci');
      expect(config).to.be.instanceof(Configuration);
      expect(config).to.have.lengthOf(2);
      expect(config.get('repo_token')).to.equal('0123456789abcdef');
      expect(config.get('service_name')).to.equal('travis-ci');
    });
  });

  /**
   * @test {Configuration.loadDefaults}
   */
  describe('.loadDefaults()', () => {
    it('should properly initialize from a `.coveralls.yml` file', async () => {
      let config = await Configuration.loadDefaults(`${__dirname}/fixtures/.coveralls.yml`);
      expect(config).to.have.length.of.at.least(2);
      expect(config.get('repo_token')).to.equal('yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');
      expect(config.get('service_name')).to.equal('travis-pro');
    });
  });

  /**
   * @test {Configuration#keys}
   */
  describe('#keys', () => {
    it('should return an empty array for an empty configuration', () => {
      expect((new Configuration).keys).to.be.empty;
    });

    it('should return the list of keys for a non-empty configuration', () => {
      let keys = new Configuration({foo: 'bar', bar: 'baz'}).keys;
      expect(keys).to.have.lengthOf(2);
      expect(keys[0]).to.equal('foo');
      expect(keys[1]).to.equal('bar');
    });
  });

  /**
   * @test {Configuration#length}
   */
  describe('#length', () => {
    it('should return zero for an empty configuration', () => {
      expect(new Configuration).to.have.lengthOf(0);
    });

    it('should return the number of entries for a non-empty configuration', () => {
      expect(new Configuration({bar: 'baz', foo: 'bar'})).to.have.lengthOf(2);
    });
  });

  /**
   * @test {Configuration#Symbol.iterator}
   */
  describe('#[Symbol.iterator]()', () => {
    it('should return a done iterator if configuration is empty', () => {
      let config = new Configuration;
      let iterator = config[Symbol.iterator]();
      expect(iterator.next().done).to.be.true;
    });

    it('should return a value iterator if configuration is not empty', () => {
      let config = new Configuration({foo: 'bar', bar: 'baz'});
      let iterator = config[Symbol.iterator]();

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
  });

  /**
   * @test {Configuration#get}
   */
  describe('#get()', () => {
    it('should properly get the configuration entries', () => {
      let config = new Configuration;
      expect(config.get('foo')).to.be.null;
      expect(config.get('foo', 123)).to.equal(123);

      config.set('foo', 'bar');
      expect(config.get('foo')).to.equal('bar');
    });
  });

  /**
   * @test {Configuration#has}
   */
  describe('#has()', () => {
    it('should return `false` if the specified key is not contained', () => {
      expect((new Configuration).has('foo')).to.be.false;
    });

    it('should return `true` if the specified key is contained', () => {
      expect(new Configuration({foo: 'bar'}).has('foo')).to.be.true;
    });
  });

  /**
   * @test {Configuration#merge}
   */
  describe('#merge()', () => {
    it('should have the same entries as the other configuration', () => {
      let config = new Configuration;
      expect(config).to.have.lengthOf(0);

      config.merge(new Configuration({bar: 'baz', foo: 'bar'}));
      expect(config).to.have.lengthOf(2);
      expect(config.get('foo')).to.equal('bar');
      expect(config.get('bar')).to.equal('baz');
    });
  });

  /**
   * @test {Configuration#set}
   */
  describe('#set()', () => {
    it('should properly set the configuration entries', () => {
      let config = new Configuration;
      expect(config.get('foo')).to.be.null;

      config.set('foo', 'bar');
      expect(config.get('foo')).to.equal('bar');
    });
  });

  /**
   * @test {Configuration#toJSON}
   */
  describe('#toJSON()', () => {
    it('should return an empty map for a newly created instance', () => {
      let map = (new Configuration).toJSON();
      expect(Object.keys(map)).to.be.empty;
    });

    it('should return a non-empty map for an initialized instance', () => {
      let map = new Configuration({bar: 'baz', foo: 'bar'}).toJSON();
      expect(Object.keys(map)).to.have.lengthOf(2);
      expect(map.foo).to.equal('bar');
      expect(map.bar).to.equal('baz');
    });
  });

  /**
   * @test {Configuration#toString}
   */
  describe('#toString()', () => {
    let config = String(new Configuration({bar: 'baz', foo: 'bar'}));

    it('should start with the class name', () => {
      expect(config.startsWith('Configuration {')).to.be.true;
    });

    it('should contain the instance properties', () => {
      expect(config).to.contain('"bar":"baz"').and.contain('"foo":"bar"');
    });
  });
});

/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {Configuration} from '../src';

/**
 * Tests the features of the `Configuration` class.
 */
@suite class ConfigurationTest {

  /**
   * Tests the `Configuration.fromEnvironment()` method.
   */
  @test async testFromEnvironment(): Promise<void> {
    // It should return an empty configuration for an empty environment.
    expect(await Configuration.fromEnvironment({})).to.have.lengthOf(0);

    // It should return an initialized instance for a non-empty environment.
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
  }

  /**
   * Tests the `Configuration.fromYaml()` method.
   */
  @test testFromYaml(): void {
    // It should throw an exception with a non-object value.
    expect(() => Configuration.fromYaml('**123/456**')).to.throw(TypeError);
    expect(() => Configuration.fromYaml('foo')).to.throw(TypeError);

    // It should return an initialized instance for a non-empty map.
    const config = Configuration.fromYaml('repo_token: 0123456789abcdef\nservice_name: travis-ci');
    expect(config).to.be.an.instanceof(Configuration);
    expect(config).to.have.lengthOf(2);
    expect(config.get('repo_token')).to.equal('0123456789abcdef');
    expect(config.get('service_name')).to.equal('travis-ci');
  }

  /**
   * Tests the `Configuration.loadDefaults()` method.
   */
  @test async testLoadDefaults(): Promise<void> {
    // It should properly initialize from a `.coveralls.yml` file.
    let config = await Configuration.loadDefaults('test/fixtures/.coveralls.yml');
    expect(config).to.be.an.instanceof(Configuration);
    expect(config).to.have.length.of.at.least(2);
    expect(config.get('repo_token')).to.equal('yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');
    expect(config.get('service_name')).to.equal('travis-pro');

    // It should use the environment defaults if the `.coveralls.yml` file is not found.
    const defaults = await Configuration.fromEnvironment();
    config = await Configuration.loadDefaults('.dummy/config.yml');
    expect(config).to.be.an.instanceof(Configuration);
    expect(config.toJSON()).to.deep.equal(defaults.toJSON());
  }

  /**
   * Tests the `Configuration#keys` property.
   */
  @test testKeys(): void {
    // It should return an empty array for an empty configuration.
    expect((new Configuration).keys).to.be.empty;

    // It should return the list of keys for a non-empty configuration.
    const keys = new Configuration({foo: 'bar', bar: 'baz'}).keys;
    expect(keys).to.have.lengthOf(2);
    expect(keys[0]).to.equal('foo');
    expect(keys[1]).to.equal('bar');
  }

  /**
   * Tests the `Configuration#length` property.
   */
  @test testLength(): void {
    // It should return zero for an empty configuration.
    expect(new Configuration).to.have.lengthOf(0);

    // It should return the number of entries for a non-empty configuration.
    expect(new Configuration({bar: 'baz', foo: 'bar'})).to.have.lengthOf(2);
  }

  /**
   * Tests the `Configuration#[Symbol.iterator]()` method.
   */
  @test testSymbolIterator(): void {
    // It should return a done iterator if configuration is empty.
    let config = new Configuration;
    let iterator = config[Symbol.iterator]();
    expect(iterator.next().done).to.be.true;

    // It should return a value iterator if configuration is not empty.
    config = new Configuration({foo: 'bar', bar: 'baz'});
    iterator = config[Symbol.iterator]();

    let next = iterator.next();
    expect(next.done).to.be.false;
    expect(next.value[0]).to.equal('foo');
    expect(next.value[1]).to.equal('bar');

    next = iterator.next();
    expect(next.done).to.be.false;
    expect(next.value[0]).to.equal('bar');
    expect(next.value[1]).to.equal('baz');
    expect(iterator.next().done).to.be.true;

    // It should allow the "iterable" protocol.
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
  }

  /**
   * Tests the `Configuration#get()` method.
   */
  @test testGet(): void {
    // It should properly get the configuration entries.
    const config = new Configuration;
    expect(config.get('foo')).to.be.undefined;

    config.set('foo', 'bar');
    expect(config.get('foo')).to.equal('bar');
  }

  /**
   * Tests the `Configuration#has()` method.
   */
  @test testHas(): void {
    // It should return `false` if the specified key is not contained.
    expect((new Configuration).has('foo')).to.be.false;

    // It should return `true` if the specified key is contained.
    expect(new Configuration({foo: 'bar'}).has('foo')).to.be.true;
  }

  /**
   * Tests the `Configuration#merge()` method.
   */
  @test testMerge(): void {
    // It should have the same entries as the other configuration.
    const config = new Configuration;
    expect(config).to.have.lengthOf(0);

    config.merge(new Configuration({bar: 'baz', foo: 'bar'}));
    expect(config).to.have.lengthOf(2);
    expect(config.get('foo')).to.equal('bar');
    expect(config.get('bar')).to.equal('baz');
  }

  /**
   * Tests the `Configuration#remove()` method.
   */
  @test testRemove(): void {
    // It should properly remove the configuration entries.
    const config = new Configuration({bar: 'baz', foo: 'bar'});
    expect(config).to.have.lengthOf(2);

    expect(config.remove('foo'));
    expect(config).to.have.lengthOf(1);
    expect(config.remove('bar'));
    expect(config).to.have.lengthOf(0);
  }

  /**
   * Tests the `Configuration#set()` method.
   */
  @test testSet(): void {
    // It should properly set the configuration entries.
    const config = new Configuration;
    expect(config.get('foo')).to.be.undefined;

    config.set('foo', 'bar');
    expect(config.get('foo')).to.equal('bar');
  }

  /**
   * Tests the `Configuration#toJSON()` method.
   */
  @test testToJson(): void {
    // It should return an empty map for a newly created instance.
    let map = (new Configuration).toJSON();
    expect(Object.keys(map)).to.be.empty;

    // It should return a non-empty map for an initialized instance.
    map = new Configuration({bar: 'baz', foo: 'bar'}).toJSON();
    expect(Object.keys(map)).to.have.lengthOf(2);
    expect(map.foo).to.equal('bar');
    expect(map.bar).to.equal('baz');
  }
}

/* tslint:disable: no-unused-expression */
import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import {Configuration} from '../src';

/**
 * Tests the features of the `Configuration` class.
 */
@suite class ConfigurationTest {

  /**
   * @test {Configuration.fromEnvironment}
   */
  @test('It should initialize the instance from the provided environment variables')
  public async testFromEnvironment(): Promise<void> {
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
   * @test {Configuration.fromYaml}
   */
  @test('It should initialize the instance from a YAML map')
  public testFromYaml(): void {
    // It should throw an exception with a non-object value.
    expect(() => Configuration.fromYaml('**123/456**')).to.throw(TypeError);
    expect(() => Configuration.fromYaml('foo')).to.throw(TypeError);

    // It should return an initialized instance for a non-empty map.
    const config = Configuration.fromYaml('repo_token: 0123456789abcdef\nservice_name: travis-ci');
    expect(config).to.be.instanceof(Configuration);
    expect(config).to.have.lengthOf(2);
    expect(config.get('repo_token')).to.equal('0123456789abcdef');
    expect(config.get('service_name')).to.equal('travis-ci');
  }

  /**
   * @test {Configuration.loadDefaults}
   */
  @test('It should initialize from a `.coveralls.yml` file, defaulting to the environment variables')
  public async testLoadDefaults(): Promise<void> {
    // It should properly initialize from a `.coveralls.yml` file.
    let config = await Configuration.loadDefaults('test/fixtures/.coveralls.yml');
    expect(config).to.be.instanceof(Configuration);
    expect(config).to.have.length.of.at.least(2);
    expect(config.get('repo_token')).to.equal('yYPv4mMlfjKgUK0rJPgN0AwNXhfzXpVwt');
    expect(config.get('service_name')).to.equal('travis-pro');

    // It should use the environment defaults if the `.coveralls.yml` file is not found.
    const defaults = await Configuration.fromEnvironment();
    config = await Configuration.loadDefaults('.dummy/config.yml');
    expect(config).to.be.instanceof(Configuration);
    expect(config.toJSON()).to.deep.equal(defaults.toJSON());
  }

  /**
   * @test {Configuration#keys}
   */
  @test('It should return the list of configuration keys')
  public testKeys(): void {
    // It should return an empty array for an empty configuration.
    expect((new Configuration).keys).to.be.empty;

    // It should return the list of keys for a non-empty configuration.
    const keys = new Configuration({foo: 'bar', bar: 'baz'}).keys;
    expect(keys).to.have.lengthOf(2);
    expect(keys[0]).to.equal('foo');
    expect(keys[1]).to.equal('bar');
  }

  /**
   * @test {Configuration#length}
   */
  @test('It should return the number of configuration entries')
  public testLength(): void {
    // It should return zero for an empty configuration.
    expect(new Configuration).to.have.lengthOf(0);

    // It should return the number of entries for a non-empty configuration.
    expect(new Configuration({bar: 'baz', foo: 'bar'})).to.have.lengthOf(2);
  }

  /**
   * @test {Configuration#Symbol.iterator}
   */
  @test('It should return an iterator over the keys and values of the configuration')
  public testSymbolIterator(): void {
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
  }

  /**
   * @test {Configuration#get}
   */
  @test('It should properly get the configuration entries')
  public testGet(): void {
    const config = new Configuration;
    expect(config.get('foo')).to.be.undefined;

    config.set('foo', 'bar');
    expect(config.get('foo')).to.equal('bar');
  }

  /**
   * @test {Configuration#has}
   */
  @test('It should return `true` if the specified key is contained, otherwise `false`')
  public testHas(): void {
    // It should return `false` if the specified key is not contained.
    expect((new Configuration).has('foo')).to.be.false;

    // It should return `true` if the specified key is contained.
    expect(new Configuration({foo: 'bar'}).has('foo')).to.be.true;
  }

  /**
   * @test {Configuration#merge}
   */
  @test('It should have the same entries as the other configuration')
  public testMerge(): void {
    const config = new Configuration;
    expect(config).to.have.lengthOf(0);

    config.merge(new Configuration({bar: 'baz', foo: 'bar'}));
    expect(config).to.have.lengthOf(2);
    expect(config.get('foo')).to.equal('bar');
    expect(config.get('bar')).to.equal('baz');
  }

  /**
   * @test {Configuration#remove}
   */
  @test('It should properly remove the configuration entries')
  public testRemove(): void {
    const config = new Configuration({bar: 'baz', foo: 'bar'});
    expect(config).to.have.lengthOf(2);

    expect(config.remove('foo'));
    expect(config).to.have.lengthOf(1);
    expect(config.remove('bar'));
    expect(config).to.have.lengthOf(0);
  }

  /**
   * @test {Configuration#set}
   */
  @test('It should properly set the configuration entries')
  public testSet(): void {
    const config = new Configuration;
    expect(config.get('foo')).to.be.undefined;

    config.set('foo', 'bar');
    expect(config.get('foo')).to.equal('bar');
  }

  /**
   * @test {Configuration#toJSON}
   */
  @test('It should return a JSON map corresponding to the instance properties')
  public testToJson(): void {
    // It should return an empty map for a newly created instance.
    let map = (new Configuration).toJSON();
    expect(Object.keys(map)).to.be.empty;

    // It should return a non-empty map for an initialized instance.
    map = new Configuration({bar: 'baz', foo: 'bar'}).toJSON();
    expect(Object.keys(map)).to.have.lengthOf(2);
    expect(map.foo).to.equal('bar');
    expect(map.bar).to.equal('baz');
  }

  /**
   * @test {Configuration#toString}
   */
  @test('It should return a string starting with the class name and containing the instance properties')
  public testToString(): void {
    const config = String(new Configuration({bar: 'baz', foo: 'bar'}));

    // It should start with the class name.
    expect(config.startsWith('Configuration {')).to.be.true;

    // It should contain the instance properties.
    expect(config).to.contain('"bar":"baz"').and.contain('"foo":"bar"');
  }
}

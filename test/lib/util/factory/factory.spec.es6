/**
*	@module util.factory
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import factory from 'util/factory/factory';
import logger, { Logger } from 'util/logger/logger';
import Command from 'command';
import Collection from 'util/adt/collection';

describe('util.factory.Factory', function() {

	before(() => {
		factory.reset();
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockCommand = this.sandbox.mock(Command);
		this.mockLogger = this.sandbox.mock(logger);
		this.mockProto = this.sandbox.mock(factory);
	});

	afterEach(() => {
		this.mockCommand.verify();
		this.mockLogger.verify();
		this.mockProto.verify();

		this.sandbox.restore();

		delete this.mockCommand;
		delete this.mockLogger;
		delete this.mockProto;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should not be a constructor', () => {
			assert.instanceOf(factory, Object);
			assert.isNotNull(factory._factories);
			assert.instanceOf(factory._factories, Map);
			assert.isNotNull(factory.register);
		});

	});

	describe('basePath()', () => {

		it('Should set a basePath', () => {
			const input = './lib';
			assert.typeOf(factory.basePath(input), 'object');
			assert.equal(input, factory.path);
		});

		it('Should be same basePath when importing multiple times (singleton check)', () => {
			const singleton = require('util/factory/factory').default;
			assert.deepEqual(singleton, factory);
			singleton.basePath('./lib/util/adt');
			assert.equal(singleton.path, factory.path);
		});

	});

	describe('_resolve()', () => {

		it('Should resolve a given path with the basepath', () => {
			assert.equal(factory._resolve('collection'), path.resolve(factory.path, 'collection'));
		});

	});

	describe('_validate()', () => {

		it('Should return true: path is valid', () => {
			assert.isTrue(factory._validate('collection'));
		});

		it('Should return false: path is not defined', () => {
			assert.isFalse(factory._validate());
		});

		it('Should return false: path is not a string', () => {
			assert.isFalse(factory._validate(1));
		});

		it('Should return false: path is not an empty string', () => {
			assert.isFalse(factory._validate(''));
		});

		it('Should return false: resolved path doesn\'t exists (fs.statSync)', () => {
			logger.level(Logger.level.output);
			const expLoggerOutput = this.mockLogger.expects('_stdout').atLeast(1).returns(logger);
			assert.isFalse(factory._validate('file-unexistent'));
			logger.level(Logger.level.silent);
		});

	});

	describe('_new()', () => {

		it('Should return factory verbatim', () => {
			const verbatimFactory = { option: true }
			assert.equal(factory._new(verbatimFactory), verbatimFactory);
		});

		it('Should instanciate factory using static constructor', () => {
			const expNew = this.mockCommand.expects('new').returns('Command');
			assert.equal(factory._new(Command), 'Command');
		});

		it('Should instanciate factory using operator `new`', () => {
			const FakeFactory = function() {};
			assert.instanceOf(factory._new(FakeFactory), FakeFactory);
		});

	});

	describe('register()', () => {

		it('Should register a factory', () => {
			const input = 'collection';
			const expValidate = this.mockProto.expects('_validate')
				.once()
				.withArgs(input)
				.returns(true);

			const expExists = this.mockProto.expects('exists')
				.once()
				.withArgs(input)
				.returns(false);

			assert.instanceOf(factory.register(input), Object);
		});

		it('Should NOT register a factory (not valid)', () => {
			const input = 'non-existent';
			const expValidate = this.mockProto.expects('_validate')
				.once()
				.withArgs(input)
				.returns(false);

			const expExists = this.mockProto.expects('exists').never();

			assert.instanceOf(factory.register(input), Object);
			assert.equal(1, factory._factories.size);
		});

		it('Should NOT register a factory (already registered)', () => {
			const input = 'non-existent';
			const expValidate = this.mockProto.expects('_validate')
				.once()
				.withArgs(input)
				.returns(false);

			const expExists = this.mockProto.expects('exists').never();

			assert.instanceOf(factory.register(input), Object);
			assert.equal(1, factory._factories.size);
		});

	});

	describe('registerAll()', () => {

		it('Should register a list of factories', () => {
			const input = ['stack', 'queue'];
			const expValidate = this.mockProto.expects('_validate')
				.twice()
				.withArgs(sinon.match('stack').or(sinon.match('queue')))
				.returns(true);

			const expExists = this.mockProto.expects('exists')
				.twice()
				.withArgs(sinon.match('stack').or(sinon.match('queue')))
				.returns(false);

			assert.instanceOf(factory.registerAll(input), Object);
			assert.equal(3, factory._factories.size);
		});

		it('Should register some out of a list of factories', () => {
			const input = ['stack', 'queue-async'];
			const expValidate = this.mockProto.expects('_validate')
				.twice()
				.withArgs(sinon.match('stack').or(sinon.match('queue')))
				.returns(true);

			const expExists = this.mockProto.expects('exists')
				.twice()
				.withArgs(sinon.match('stack').or(sinon.match('queue')));

			expExists.onFirstCall().returns(true); // with stack
			expExists.onSecondCall().returns(false); // with queue-async

			assert.instanceOf(factory.registerAll(input), Object);
			assert.equal(4, factory._factories.size);
		});

		it('Should NOT register an empty list of factory paths', () => {
			assert.instanceOf(factory.registerAll(), Object);
			assert.equal(4, factory._factories.size);
		});

	});

	describe('unregister()', () => {

		it('Should unregister a factory', () => {
			const input = 'queue-async';
			const expExists = this.mockProto.expects('exists')
				.once()
				.withArgs(input)
				.returns(true);

			assert.instanceOf(factory.unregister(input), Object);
			assert.equal(3, factory._factories.size);
		});

		it('Should NOT unregister a factory (doesn\'t exists)', () => {
			const input = 'non-existent';
			const expExists = this.mockProto.expects('exists')
				.once()
				.withArgs(input)
				.returns(false);

			assert.instanceOf(factory.unregister(input), Object);
			assert.equal(3, factory._factories.size);
		});

	});

	describe('unregisterAll()', () => {

		it('Should unregister a list of factories', () => {
			const input = ['stack', 'queue'];
			const expExists = this.mockProto.expects('exists')
				.twice()
				.withArgs(sinon.match('stack').or(sinon.match('queue')))
				.returns(true);

			assert.instanceOf(factory.unregisterAll(input), Object);
			assert.equal(1, factory._factories.size);
		});

		it('Should unregister some, out of a list of factories', () => {
			const input = ['collection', 'non-existent'];
			const expExists = this.mockProto.expects('exists')
				.twice()
				.withArgs(sinon.match('collection').or(sinon.match('non-existent')));

			expExists.onFirstCall().returns(true); // with collection
			expExists.onSecondCall().returns(false); // with non-existent

			assert.instanceOf(factory.unregisterAll(input), Object);
			assert.equal(0, factory._factories.size);
		});

		it('Should NOT unregister an empty list of factory paths', () => {
			assert.instanceOf(factory.unregisterAll(), Object);
			assert.equal(0, factory._factories.size);
		});

	});

	describe('find()', () => {

		it('Should return the factory (factory found)', () => {
			factory.registerAll(['collection', 'stack', 'queue']); // Setup a few factories
			const input = 'stack';

			const exp = factory.find(input);
			assert.isNotNull(exp);
			assert.equal(factory._resolve(input), exp);
		});

		it('Should return null (factory not found)', () => {
			const input = 'non-existent';
			const exp = factory.find(input);
			assert.isNull(exp);
			assert.isNull(factory.find());
		});

	});

	describe('exists()', () => {

		it('Should return true (factory exists)', () => {
			assert.isTrue(factory.exists('collection'));
		});

		it('Should return false (factory doesn\'t exists)', () => {
			assert.isFalse(factory.exists('non-existent'));
			assert.isFalse(factory.exists());
		});

	});

	describe('get()', () => {

		it('Should get a new instance', () => {
			assert.instanceOf(factory.get('collection'), Collection);
		});

		it('Should NOT get a new instance (factory is not registered)', () => {
			assert.isNull(factory.get('non-existent'));
		});

	});

});

/**
*	@module visitors
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Configuration from 'visitors/configuration';
import Command from 'command';
import Factory from 'util/factory/factory';
import QueueAsync from 'util/adt/queue-async';
import logger, { Logger } from 'util/logger/logger';

describe('visitors.Configuration', function() {

	before(() => {
		this.command = Command.new();
		if(!this.configuration) this.configuration = Configuration.new(this.command);
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockProto = this.sandbox.mock(Configuration.prototype);
		this.mockQueueAsync = this.sandbox.mock(QueueAsync.prototype);
		this.mockFactory = this.sandbox.mock(Factory);
		this.mockCommand = this.sandbox.mock(Command.prototype);
		this.mockLogger = this.sandbox.mock(Logger.prototype);
	});

	afterEach(() => {
		this.mockProto.verify();
		this.mockQueueAsync.verify();
		this.mockFactory.verify();
		this.mockCommand.verify();
		this.mockLogger.verify();

		this.sandbox.restore();

		delete this.mockProto;
		delete this.mockQueueAsync;
		delete this.mockFactory;
		delete this.mockCommand;
		delete this.mockLogger;
	});

	after(() => {
		delete this.command;
		delete this.configuration;
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get a new instance', () => {
			assert.instanceOf(this.configuration, Configuration);
			assert.equal('ConfigurationVisitor', this.configuration.name);
			assert.property(this.configuration, 'queue');
			assert.instanceOf(this.configuration.queue, QueueAsync);
		});

	});

	describe('visit()', () => {

		it('Should visit configuration visitor', () => {
			const expValidate = this.mockProto.expects('validate')
				.once()
				.withArgs(this.command)
				.returns(true);

			const exp = this.configuration.visit(this.command);
			assert.instanceOf(exp, Command);
			assert.property(exp, 'configuration');
		});

		it('Should NOT visit configuration visitor (invalid)', () => {
			const input = Command.new();
			const expValidate = this.mockProto.expects('validate')
				.once()
				.withArgs(input)
				.returns(false);

			const exp = this.configuration.visit(input);
			assert.instanceOf(exp, Command);
			assert.notProperty(exp, 'configuration');
		});

	});

	describe('_create()', () => {

		it('Should enqueue configuration decorator methods', () => {
			const options = { option: true };
			const expGet = this.mockFactory.expects('get')
				.once()
				.withArgs('visitors/configuration/remote', this.command, options)
				.returns(options);

			const expOffer = this.mockQueueAsync.expects('offer')
				.once()
				.withArgs(options)
				.returns(this.configuration.queue);

			const exp = this.configuration._create(options, 'visitors/configuration/remote');
			assert.instanceOf(exp, Configuration);
		});

	});

	describe('_format()', () => {

		it('Should apply formatter to the current configuration option', () => {
			const options = { scan: './src/**', extensions: '.js,.es6' };
			const expTransform = ['.js', '.es6'];
			const formatterPath = 'visitors/configuration/formatter/extensions';
			const expFormatterPath = this.mockProto.expects('formatterPath')
				.once()
				.withArgs('extensions')
				.returns(formatterPath);

			const expGet = this.mockFactory.expects('get')
				.once()
				.withArgs(formatterPath, options.extensions)
				.returns(expTransform);

			const expExists = this.mockFactory.expects('exists')
				.once()
				.withArgs(formatterPath)
				.returns(true);

			const exp = this.configuration._format(options, options.extensions, 'extensions');
			assert.isTrue(expFormatterPath.calledBefore(expExists));
			assert.isTrue(expExists.calledBefore(expGet));
			assert.isObject(exp);
			assert.property(exp, 'scan');
			assert.property(exp, 'extensions');
			assert.equal(expTransform, exp.extensions);
		});

		it('Should NOT apply formatter to the current configuration option', () => {
			const options = { scan: './src/**' };
			const formatterPath = 'visitors/configuration/formatter/scan';
			const expFormatterPath = this.mockProto.expects('formatterPath')
				.once()
				.withArgs('scan')
				.returns(formatterPath);

			const expGet = this.mockFactory.expects('get').never();

			const expExists = this.mockFactory.expects('exists')
				.once()
				.withArgs(formatterPath)
				.returns(false);

			const exp = this.configuration._format(options, options.scan, 'scan');
			assert.isTrue(expFormatterPath.calledBefore(expExists));
			assert.isObject(exp);
			assert.property(exp, 'scan');
			assert.equal(options.scan, exp.scan);
		});

	});

	describe('_source()', () => {

		it('Should apply source configuration options to the current command', () => {
			const options = { scan: './src/**', extensions: ['.js', '.es6'], unrecognized: true };
			assert.instanceOf(this.configuration._source(options), Configuration);

			assert.property(this.command, 'scan');
			assert.property(this.command, 'extensions');
			assert.notProperty(this.command, 'unrecognized');

			delete this.command.scan;
			delete this.command.extensions;
		});

	});

	describe('_target()', () => {

		it('Should apply target configuration options to the current command', () => {
			const options = { cjs: { destination: './dist', format: 'cjs', unrecognized: false }, unrecognized: true };
			assert.instanceOf(this.configuration._target(options), Configuration);

			assert.property(this.command, 'target');
			assert.property(this.command.target, 'cjs');
			assert.notProperty(this.command.target.cjs, 'unrecognized');
		});

	});

	describe('_logger()', () => {

		it('Should apply logger configuration option to the singleton logger', () => {
			assert.instanceOf(this.configuration._logger('silent'), Configuration);
			logger.level(Logger.level.output);
		});

	});

	describe('_override()', () => {

		it('Should override configuration options with cli options', () => {
			const options = { scan: './src/**', extensions: ['.js', '.es6'], unrecognized: true };
			const filtered = _.omit(options, 'unrecognized');
			const expFormat = this.mockProto.expects('_format')
				.exactly(2)
				.withArgs(filtered, sinon.match.any, sinon.match.string)
				.returns(filtered);

			assert.instanceOf(this.configuration._override(options), Configuration);
			assert.property(this.command, 'scan');
			assert.property(this.command, 'extensions');
			assert.notProperty(this.command, 'unrecognized');

			delete this.command.scan;
			delete this.command.extensions;
		});

	});

	describe('formatterPath()', () => {

		it('Should resolve formatter path to the factory', () => {
			const exp = 'visitors/configuration/formatter/target';
			assert.equal(exp, this.configuration.formatterPath('target'));
		});

	});

	describe('onParse()', () => {

		it('Should iterate over results gather from commander to perform transformations', () => {
			const expResults = [{ option: 1 }, { option: 2 }, null];
			const expOnOptions = this.mockProto.expects('onOptions')
				.exactly(2)
				.withArgs(sinon.match.object)
				.returns(this.configuration);

			assert.instanceOf(this.configuration.onParse(expResults), Configuration);
		});

	});

	describe('onParseError()', () => {

		it('Should output possible warning', () => {
			const expMessage = 'Warning Message';
			const expLogger = this.mockLogger.expects('_add')
				.once()
				.withArgs(expMessage)
				.returns(logger);

			const expWarn = this.mockLogger.expects('warn')
				.once()
				.returns(logger);

			assert.instanceOf(this.configuration.onParseError(expMessage), Configuration);
		});

	});

	describe('onOptions()', () => {

		it('Should perform options transformations', () => {
			const expResult = {
				source: { scan: './src/**' },
				target: { cjs: { destination: './dist', format: 'cjs' } },
				logLevel: 'silent'
			};
			const expSource = this.mockProto.expects('_source')
				.once()
				.withArgs(expResult.source)
				.returns(this.configuration);
			const expTarget = this.mockProto.expects('_target')
				.once()
				.withArgs(expResult.target)
				.returns(this.configuration);
			const expLogger = this.mockProto.expects('_logger')
				.once()
				.withArgs(expResult.logLevel)
				.returns(this.configuration);
			const expOverride = this.mockProto.expects('_override')
				.once()
				.withArgs(this.command.options)
				.returns(this.configuration);

			assert.instanceOf(this.configuration.onOptions(expResult), Configuration);
		});

		it('Should NOT perform option transformations (Parse Error)', () => {
			const expResult = { warn: 'Warning Message' };

			const expParseError = this.mockProto.expects('onParseError')
				.once()
				.withArgs(expResult.warn)
				.returns(this.configuration);
			const expSource = this.mockProto.expects('_source').never();
			const expTarget = this.mockProto.expects('_target').never();
			const expLogger = this.mockProto.expects('_logger').never();
			const expOverride = this.mockProto.expects('_override').never();

			assert.instanceOf(this.configuration.onOptions(expResult), Configuration);
		});

	});

	describe('parse()', () => {

		it('Should create methods and resolve configuration option source', () => {
			const expResult = { source: { scan: './src/**' } };
			const queueStubPromise = this.sandbox.stub().returnsPromise();
			const expCreate = this.mockProto.expects('_create')
				.exactly(2)
				.withArgs(undefined)
				.returns(this.configuration);

			const expOnParse = this.mockProto.expects('onParse')
				.once()
				.withArgs(expResult)
				.returns(this.configuration);

			const expOnParseError = this.mockProto.expects('onParseError').never();

			const expPoll = this.mockQueueAsync.expects('poll')
				.once()
				.returns(queueStubPromise.resolves(expResult)());

			const exp = this.configuration.parse();
			assert.isTrue(exp.resolved);
			assert.instanceOf(exp.resolveValue, Configuration);
		});

		it('Should create methods and reject configuration option (warn message from metthod)', () => {
			const expResult = { warn: 'Warning Message' };
			let queueStubPromise = this.sandbox.stub().returnsPromise();
			const expCreate = this.mockProto.expects('_create')
				.exactly(2)
				.withArgs(undefined, sinon.match.string)
				.returns(this.configuration);

			const expOnParse = this.mockProto.expects('onParse').never();

			const expOnParseError = this.mockProto.expects('onParseError')
				.once()
				.withArgs(expResult.warn)
				.returns(this.configuration);

			const expPoll = this.mockQueueAsync.expects('poll')
				.once()
				.returns(queueStubPromise.rejects(expResult.warn)());

			const exp = this.configuration.parse();
			assert.instanceOf(exp.resolveValue, Configuration);
		});

	});

});

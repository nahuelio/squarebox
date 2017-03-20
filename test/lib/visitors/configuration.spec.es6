/**
*	@module visitors
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Configuration from 'visitors/configuration';
import Command from 'command';
import Factory from 'util/factory/factory';
import QueueAsync from 'util/adt/queue-async';

describe('visitors.Configuration', function() {

	before(() => {
		this.command = Command.new();
		if(!this.configuration) this.configuration = Configuration.new(this.command);
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockProto = this.sandbox.mock(Configuration.prototype);
		this.mockQueueAsync = this.sandbox.mock(QueueAsync.prototype);
		this.mockCommand = this.sandbox.mock(Command.prototype);
		this.mockFactory = this.sandbox.mock(Factory);
	});

	afterEach(() => {
		this.mockProto.verify();
		this.mockQueueAsync.verify();
		this.mockFactory.verify();
		this.mockCommand.verify();

		this.sandbox.restore();

		delete this.mockProto;
		delete this.mockQueueAsync;
		delete this.mockFactory;
		delete this.mockCommand;
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

		xit('Should apply formatter to the current configuration option', () => {});
		xit('Should NOT apply formatter to the current configuration option (Factory doesn\'t exists)', () => {});

	});

	describe('_source()', () => {

		xit('Should apply source configuration options to the current command', () => {});

	});

	describe('_target()', () => {

		xit('Should apply target configuration options to the current command', () => {});

	});

	describe('_logger()', () => {

		xit('Should apply logger configuration option to the singleton logger', () => {});

	});

	describe('_override()', () => {

		xit('Should override configuration options with cli options', () => {});

	});

	describe('formatterPath()', () => {

		xit('Should resolve formatter path to the factory', () => {});

	});

	describe('onParse()', () => {

		xit('Should iterate over results gatter from commander to perform transformations', () => {});

	});

	describe('onParseError()', () => {

		xit('Should output possible warning', () => {});

	});

	describe('onOptions()', () => {

		xit('Should perform options transformations', () => {});

	});

	describe('parse()', () => {

		xit('Should parse commander options and apply configuration based on input', () => {});

	});

});

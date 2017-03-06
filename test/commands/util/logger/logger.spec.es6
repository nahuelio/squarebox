/**
*	@module commands.util.logger
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import logger, { Logger } from 'commands/util/logger/logger';

describe('commands.util.logger.Logger', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockProto = this.sandbox.mock(logger);
		this.mockProcess = this.sandbox.mock(process);
	});

	afterEach(() => {
		this.mockProto.verify();
		this.mockProcess.verify();

		this.sandbox.restore();

		delete this.mockProto;
		delete this.mockProcess;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should check the singleton instance', () => {
			assert.instanceOf(logger, Logger);
		});

		it('Should adds to the buffer by using constructor function', () => {
			const expOut = this.mockProto.expects('_stdout')
				.once()
				.withArgs(sinon.match.string)
				.returns(logger);

			logger('hello')('world').out(logger.magenta);
		});

	});

	describe('_stdout()', () => {

		it('Should use console.warn to output', () => {
			// ISOLATED: To avoid dangerous issues with unit tests  (stubbing `console.warn`)
			const stubConsoleWarn = this.sandbox.stub(console, 'warn', () => {});
			assert.instanceOf(logger._stdout('Hello'), Logger);
			stubConsoleWarn.restore();
		});

	});

	describe('_validate()', () => {

		it('Should validate to true, if level = silent and type is fatal', () => {
			logger.level(Logger.level.silent);
			assert.isTrue(logger._validate(Logger.type.fatal));
		});

		it('Should validate to true, if level = output and type is fatal, warn or output only', () => {
			logger.level(Logger.level.output);
			assert.isTrue(logger._validate(Logger.type.fatal));
			assert.isTrue(logger._validate(Logger.type.warning));
			assert.isTrue(logger._validate(Logger.type.output));
			assert.isFalse(logger._validate(Logger.type.debug));
		});

		it('Should validate to true, if level = debug with all types', () => {
			logger.level(Logger.level.debug);
			assert.isTrue(logger._validate(Logger.type.fatal));
			assert.isTrue(logger._validate(Logger.type.warning));
			assert.isTrue(logger._validate(Logger.type.output));
			assert.isTrue(logger._validate(Logger.type.debug));
		});

		it('Should validate to false, if level = silent with type is other than fatal', () => {
			logger.level(Logger.level.silent);
			assert.isFalse(logger._validate(Logger.type.warning));
			assert.isFalse(logger._validate(Logger.type.output));
			assert.isFalse(logger._validate(Logger.type.debug));
		});

	});

	describe('out()', () => {

		it('Should write to standard output (out - with event)', () => {
			logger.level(Logger.level.output);
			const expOut = this.mockProto.expects('_stdout')
				.once()
				.withArgs(sinon.match.string)
				.returns(logger);

			const expEmit = this.mockProto.expects('emit')
				.once()
				.withArgs(Logger.events.output, logger);

			assert.instanceOf(logger('hello').out(), Logger);
		});

		it('Should write to standard out (out - without event)', () => {
			logger.level(Logger.level.output);
			const expOut = this.mockProto.expects('_stdout')
				.once()
				.withArgs(sinon.match.string)
				.returns(logger);

			const expEmit = this.mockProto.expects('emit').never();

			assert.instanceOf(logger('hello').out({ silent: true }, logger.magenta), Logger);
		});

		it('Should NOT write to standard out (due to validation)', () => {
			logger.level(Logger.level.silent);
			const expOut = this.mockProto.expects('_stdout').never();

			const expEmit = this.mockProto.expects('emit')
				.once()
				.withArgs(Logger.events.output, logger);

			assert.instanceOf(logger('Not Logged').out(), Logger);
		});

	});

	describe('debug()', () => {

		it('Should write to standard output (debug - with event)', () => {
			logger.level(Logger.level.debug);
			const expOut = this.mockProto.expects('_stdout')
				.once()
				.withArgs(sinon.match.string)
				.returns(logger);

			const expEmit = this.mockProto.expects('emit')
				.once()
				.withArgs(Logger.events.debug, logger);

			assert.instanceOf(logger('hello').debug(), Logger);
		});

		it('Should write to standard out (debug - without event)', () => {
			logger.level(Logger.level.debug);
			const expOut = this.mockProto.expects('_stdout')
				.once()
				.withArgs(sinon.match.string)
				.returns(logger);

			const expEmit = this.mockProto.expects('emit').never();

			assert.instanceOf(logger('hello').debug({ silent: true }), Logger);
		});

	});

	describe('warn()', () => {

		it('Should write to standard output (warning - with event)', () => {
			logger.level(Logger.level.output);
			const expOut = this.mockProto.expects('_stdout')
				.once()
				.withArgs(sinon.match.string)
				.returns(logger);

			const expEmit = this.mockProto.expects('emit')
				.once()
				.withArgs(Logger.events.warning, logger);

			assert.instanceOf(logger('hello').warn(), Logger);
		});

		it('Should write to standard out (warning - without event)', () => {
			logger.level(Logger.level.output);
			const expOut = this.mockProto.expects('_stdout')
				.once()
				.withArgs(sinon.match.string)
				.returns(logger);

			const expEmit = this.mockProto.expects('emit').never();

			assert.instanceOf(logger('hello').warn({ silent: true }), Logger);
		});

	});

	describe('fatal()', () => {

		it('Should write to standard output (fatal - with event) and process.exit(1)', () => {
			logger.level(Logger.level.output);
			const expOut = this.mockProto.expects('_stdout')
				.once()
				.withArgs(sinon.match.string)
				.returns(logger);

			const expExit = this.mockProcess.expects('exit')
				.once()
				.withArgs(1);

			const expEmit = this.mockProto.expects('emit')
				.once()
				.withArgs(Logger.events.fatal, logger);

			assert.isUndefined(logger('hello').fatal());
		});

		it('Should write to standard out (fatal - without event) and process.exit(1)', () => {
			logger.level(Logger.level.output);
			const expOut = this.mockProto.expects('_stdout')
				.once()
				.withArgs(sinon.match.string)
				.returns(logger);

			const expExit = this.mockProcess.expects('exit')
				.once()
				.withArgs(1);

			const expEmit = this.mockProto.expects('emit').never();

			assert.isUndefined(logger('hello').fatal({ silent: true }));
		});

	});

});

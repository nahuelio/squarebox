/**
*	@module visitors.commander
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import version from 'visitors/commander/version';
import Command from 'Command';
import yargs from 'yargs';
import logger, { Logger } from 'util/logger/logger';

describe('visitors.commander.Version', function() {

	before(() => {
		this.command = Command.new();
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockYargs = this.sandbox.mock(yargs);
		this.mockLogger = this.sandbox.mock(Logger.prototype);
	});

	afterEach(() => {
		this.mockYargs.verify();
		this.mockLogger.verify();

		this.sandbox.restore();

		delete this.mockYargs;
		delete this.mockLogger;
	});

	after(() => {
		delete this.command;
		delete this.sandbox;
	});

	describe('version()', () => {

		it('Should apply version directive to yargs', () => {
			const expVersion = this.mockYargs.expects('version')
				.once()
				.withArgs(sinon.match(/^[0-9]\.[0-9]\.[0-9]$/))
				.returns(yargs);

			assert.equal(yargs, version(yargs, this.command));
		});

		it('Should NOT apply version directive to yargs', () => {
			this.command.dirname = './notexistent';
			const expVersion = this.mockYargs.expects('version').never();
			const expLogger = this.mockLogger.expects('_add')
				.once()
				.withArgs(sinon.match.string)
				.returns(logger);

			const expLoggerDebug = this.mockLogger.expects('debug')
				.once()
				.withArgs(sinon.match.func)
				.returns(logger);

			assert.equal(yargs, version(yargs, this.command));
		});

	});

});

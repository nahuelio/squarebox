/**
*	@module visitors.configuration
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Remote from 'visitors/configuration/remote';
import Command from 'command';
import logger, { Logger } from 'util/logger/logger';

describe('visitors.configuration.Remote', function() {

	before(() => {
		this.command = Command.new();
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockProto = this.sandbox.mock(Remote.prototype);
		this.mockCommand = this.sandbox.mock(Command.prototype);
		this.mockLogger = this.sandbox.mock(Logger.prototype);
	});

	afterEach(() => {
		this.mockProto.verify();
		this.mockCommand.verify();
		this.mockLogger.verify();

		this.sandbox.restore();

		delete this.mockProto;
		delete this.mockCommand;
		delete this.mockLogger;
	});

	after(() => {
		delete this.command;
		delete this.sandbox;
	});

});

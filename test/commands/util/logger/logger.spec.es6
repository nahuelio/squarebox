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
		this.mockStatic = this.sandbox.mock(Logger);
		this.mockProto = this.sandbox.mock(logger);
		this.mockProcess = this.sandbox.mock(process);
	});

	afterEach(() => {
		this.mockStatic.verify();
		this.mockProto.verify();
		this.mockProcess.verify();

		this.sandbox.restore();

		delete this.mockStatic;
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
			logger('hello')('world').debug(logger.magenta);
		});

	});

	describe('debug()', () => {

		xit('Should debug', () => {});

	});

	describe('warn()', () => {

		xit('Should warn', () => {});

	});

	describe('fatal()', () => {

		xit('Should fatal', () => {});

	});

});

/**
*	@module commands
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Command from 'commands/command';

describe('commands.Command', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {

	});

	afterEach(() => {
		this.sandbox.restore();
	});

	after(() => {
		delete this.sandbox;
	});

	describe('#constructor', () => {

		it('Should get a new instance', () => {
			assert.instanceOf(Command.new(), Command);
		});

	});

});

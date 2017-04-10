/**
*	@module
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Command from 'command';

describe('Command', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockInstance = this.sandbox.mock(Command);
	});

	afterEach(() => {
		this.mockInstance.verify();

		this.sandbox.restore();

		delete this.mockInstance;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get a new instance', () => {
			assert.instanceOf(Command.new(), Command);
		});

	});

	describe('toJSON()', () => {

		it('Should return a json representation', () => {
			const exp = Command.new({ env: 'production' }).toJSON();
			assert.property(exp, 'env');
		});

	});

});

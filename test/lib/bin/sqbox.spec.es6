/**
*	@module bin
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
describe('bin.SquareBox', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		if(this.sqbox) {
			this.mockProto = this.sandbox.mock(this.sqbox);
		}
	});

	afterEach(() => {
		if(this.mockProto) {
			this.mockProto.verify();
			this.sandbox.restore();
			delete this.mockProto;
		}
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get an instance', () => {
			this.sqbox = require('bin/sqbox');
		});

	});

});

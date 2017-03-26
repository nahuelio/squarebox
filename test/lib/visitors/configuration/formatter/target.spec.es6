/**
*	@module visitors.configuration.formatter
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import target from 'visitors/configuration/formatter/target';

describe('visitors.configuration.formatter.Target', function() {

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

	describe('target()', () => {

		xit('Should transform parameter target', () => {});
		xit('Should NOT transform parameter target', () => {});

	});

});

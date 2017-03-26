/**
*	@module visitors.configuration.formatter
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import alias from 'visitors/configuration/formatter/alias';

describe('visitors.configuration.formatter.Alias', function() {

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

	describe('alias()', () => {

		xit('Should transform parameter alias', () => {});
		xit('Should NOT transform parameter alias', () => {});

	});

});

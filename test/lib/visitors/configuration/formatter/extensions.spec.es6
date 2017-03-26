/**
*	@module visitors.configuration.formatter
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import extensions from 'visitors/configuration/formatter/extensions';

describe('visitors.configuration.formatter.Extensions', function() {

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

	describe('extensions()', () => {

		xit('Should transform parameter extensions', () => {});
		xit('Should NOT transform parameter extensions', () => {});

	});

});

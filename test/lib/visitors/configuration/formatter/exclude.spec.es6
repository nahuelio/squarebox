/**
*	@module visitors.configuration.formatter
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import exclude from 'visitors/configuration/formatter/exclude';

describe('visitors.configuration.formatter.Exclude', function() {

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

	describe('exclude()', () => {

		xit('Should transform parameter exclude', () => {});
		xit('Should NOT transform parameter exclude', () => {});

	});

});

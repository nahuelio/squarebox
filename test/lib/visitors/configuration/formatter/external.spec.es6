/**
*	@module visitors.configuration.formatter
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import external from 'visitors/configuration/formatter/external';

describe('visitors.configuration.formatter.External', function() {

	describe('external()', () => {

		it('Should transform parameter external', () => {
			const input = 'jquery,react';
			const exp = external(input);

			assert.isArray(exp);
			assert.oneOf('jquery', exp);
			assert.oneOf('react', exp);
		});

		it('Should NOT transform parameter external', () => {
			let exp = external();
			assert.isTrue(_.isEmpty(exp));

			exp = external({});
			assert.isTrue(_.isEmpty(exp));
		});

	});

});

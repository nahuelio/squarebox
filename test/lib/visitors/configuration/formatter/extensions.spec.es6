/**
*	@module visitors.configuration.formatter
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import extensions from 'visitors/configuration/formatter/extensions';

describe('visitors.configuration.formatter.Extensions', function() {

	describe('extensions()', () => {

		it('Should transform parameter extensions', () => {
			const input = '.js,.es6,.jsx';
			const exp = extensions(input);

			assert.isArray(exp);
			assert.oneOf('.js', exp);
			assert.oneOf('.es6', exp);
			assert.oneOf('.jsx', exp);
		});

		it('Should NOT transform parameter extensions', () => {
			let exp = extensions();
			assert.isTrue(_.isEmpty(exp));

			exp = extensions({});
			assert.isTrue(_.isEmpty(exp));
		});

	});

});

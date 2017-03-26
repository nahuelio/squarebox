/**
*	@module visitors.configuration.formatter
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import alias from 'visitors/configuration/formatter/alias';

describe('visitors.configuration.formatter.Alias', function() {

	describe('alias()', () => {

		it('Should transform parameter alias', () => {
			const input = 'one:./path/one,two:./path/two';
			const exp = alias(input);

			assert.isObject(exp);
			assert.property(exp, 'one');
			assert.property(exp, 'two');
			assert.propertyVal(exp, 'one', './path/one');
			assert.propertyVal(exp, 'two', './path/two');
		});

		it('Should NOT transform parameter alias', () => {
			const exp = alias();
			assert.isTrue(_.isEmpty(exp));
		});

	});

});

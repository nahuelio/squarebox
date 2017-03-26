/**
*	@module visitors.configuration.formatter
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import exclude from 'visitors/configuration/formatter/exclude';

describe('visitors.configuration.formatter.Exclude', function() {

	describe('exclude()', () => {

		it('Should transform parameter exclude', () => {
			const input = './path/one,./path/two';
			const exp = exclude(input);

			assert.isArray(exp);
			assert.oneOf('./path/one', exp);
			assert.oneOf('./path/two', exp);
		});

		it('Should NOT transform parameter exclude', () => {
			let exp = exclude();
			assert.isTrue(_.isEmpty(exp));

			exp = exclude({});
			assert.isTrue(_.isEmpty(exp));
		});

	});

});

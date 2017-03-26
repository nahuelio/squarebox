/**
*	@module visitors.configuration.formatter
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import target from 'visitors/configuration/formatter/target';

describe('visitors.configuration.formatter.Target', function() {

	describe('target()', () => {

		it('Should transform parameter target', () => {
			const input = 't1>umd:./dist/t1,t2>cjs:./dist/t2,t3>inv:./dist/t3';
			const exp = target(input);

			assert.isObject(exp);
			assert.property(exp, 't1');
			assert.property(exp, 't2');
			assert.notProperty(exp, 't3');

			assert.property(exp.t1, 'destination');
			assert.property(exp.t1, 'format');

			assert.property(exp.t2, 'destination');
			assert.property(exp.t2, 'format');
		});

		it('Should NOT transform ALL parameter targets (invalid nomenclature)', () => {
			let input = 't1>umd:./dist/t1,t2:./dist/t2';
 			let exp = target(input);

			assert.isObject(exp);
			assert.property(exp, 't1');
			assert.notProperty(exp, 't2');

			input = 't1,t2>cjs:./dist/t2';
			exp = target(input);

			assert.isObject(exp);
			assert.property(exp, 't2');
			assert.notProperty(exp, 't1');
		});

		it('Should NOT transform parameter target', () => {
			const exp = target();
			assert.isTrue(_.isEmpty(exp));
		});

	});

});

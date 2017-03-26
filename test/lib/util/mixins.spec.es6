/**
*	@module util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';

describe('util.mixins', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
		this.test = {
			str: 'one',
			num: 1,
			obj: {
				'obj-str': 'two',
				'-obj-num': 2,
				bool: false
			},
			arr: ['one', 1, true],
			bool: true,
			nul: null
		};
	});

	beforeEach(() => {
		this.mockStatic = this.sandbox.mock(_);
	});

	afterEach(() => {
		this.mockStatic.verify();

		this.sandbox.restore();

		delete this.mockStatic;
	});

	after(() => {
		delete this.test;
		delete this.sandbox;
	});

	describe('parametrize()', () => {

		it('Should parametrized object structure', () => {
			const exp = _.parametrize(this.test);
			assert.include(exp, '--str');
			assert.include(exp, '--num');
			assert.include(exp, '--obj-obj-str');
			assert.include(exp, '--obj-obj-num');
			assert.include(exp, '--obj-bool');
			assert.include(exp, '--arr');
			assert.include(exp, '--bool');
			assert.include(exp, '--nul');
		});

		it('Should return empty array (empty object)', () => {
			assert.lengthOf(_.parametrize(), 0);
		});

	});

	describe('isRealObject()', () => {

		it('Should return true', () => {
			assert.isTrue(_.isRealObject({}));
		});

		it('Should return false', () => {
			assert.isFalse(_.isRealObject(new RegExp()));
			assert.isFalse(_.isRealObject([]));
			assert.isFalse(_.isRealObject("String"));
			assert.isFalse(_.isRealObject(1));
		});

	});

	describe('isAdt()', () => {

		it('Should return true', () => {
			assert.isTrue(_.isAdt({}));
			assert.isTrue(_.isAdt([]));
		});

		it('Should return false', () => {
			assert.isFalse(_.isAdt());
			assert.isFalse(_.isAdt(1));
			assert.isFalse(_.isAdt("string"));
			assert.isFalse(_.isAdt(new RegExp()));
		});

	});

	describe('instanceOf()', () => {

		it('Should return true', () => {
			assert.isTrue(_.instanceOf({}, Object));
			assert.isTrue(_.instanceOf([], Array));
			assert.isTrue(_.instanceOf([], Object));
			assert.isTrue(_.instanceOf(new Number(1), Number));
			assert.isTrue(_.instanceOf(new String("string"), String));
		});

		it('Should return false', () => {
			assert.isFalse(_.instanceOf());
			assert.isFalse(_.instanceOf({}, Array));
			assert.isFalse(_.instanceOf([], String));
			assert.isFalse(_.instanceOf(new Number(1), String));
			assert.isFalse(_.instanceOf(new String("string"), RegExp));
		});

	});

	describe('defined()', () => {

		it('Should return true', () => {
			assert.isTrue(_.defined(-1));
			assert.isTrue(_.defined(0));
			assert.isTrue(_.defined(false));
			assert.isTrue(_.defined(""));
			assert.isTrue(_.defined(NaN));
		});

		it('Should return false', () => {
			assert.isFalse(_.defined(null));
			assert.isFalse(_.defined(undefined));
		});

	});

});

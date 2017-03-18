/**
*	@module util.visitor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Visitor from 'util/visitor/visitor';
import Visited from 'util/visitor/visited';
import InterfaceException from 'util/exception/proxy/interface';

describe('util.visitor.Visitor', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockProto = this.sandbox.mock(Visitor.prototype);
	});

	afterEach(() => {
		this.mockProto.verify();
		this.sandbox.restore();
		delete this.mockProto;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get a new instance', () => {
			const exp = Visitor.new();
			assert.instanceOf(exp, Visitor);
			assert.equal(exp.name, 'Visitor');
		});

	});

	describe('validate()', () => {

		it('Should return true', () => {
			const exp = Visitor.new();
			const input = Visited.new({});
			assert.isTrue(exp.validate(input));
		});

		it('Should return false: visited not defined', () => {
			const exp = Visitor.new();
			assert.isFalse(exp.validate());
		});

		it('Should throw InterfaceException: visited doesn\'t implement his interface', () => {
			const exp = Visitor.new();
			assert.throws(() => exp.validate({}),
				InterfaceException.type.interface({ name: 'util.visitor.Visited' }));
		});

	});

	describe('_methods()', () => {

		it('Should filter visitor internal methods', () => {
			const vi = Visitor.new({ someMethod: () => {} });
			const exp = vi._methods();
			assert.lengthOf(exp, 1);
			assert.equal('someMethod', exp[0]);
		});

	});

	describe('_decorate()', () => {

		it('Should decorate visited object', () => {
			const arg = { prop: 'one' };
			const exp = Visitor.new({ func: this.sandbox.spy() });
			const input = Visited.new();

			const spyWith = exp.func.withArgs(input, arg);

			const expMethods = this.mockProto.expects('_methods')
				.once()
				.returns(['func']);

			assert.instanceOf(exp._decorate(input), Visited);

			input.func(arg);

			assert.isTrue(spyWith.calledOnce);
			assert.isTrue(spyWith.calledOn(exp));
			assert.isTrue(spyWith.calledWith(input, arg));
		});

		it('Should skip methods already defined in visited', () => {
			const exp = Visitor.new({ func: () => {}, existent: this.sandbox.spy() });
			const input = Visited.new({ existent: () => {} });

			assert.instanceOf(exp._decorate(input), Visited);
			input.existent();
			assert.isFalse(exp.existent.calledOnce);
		});

	});

	describe('visit', () => {

		it('Should visit the visted instance', () => {
			const exp = Visitor.new();
			const input = Visited.new({});
			const expDecorate = this.mockProto.expects('_decorate')
				.once()
				.withArgs(input)
				.returns(input);

			const expValidate = this.mockProto.expects('validate')
				.once()
				.withArgs(input)
				.returns(true);

			assert.instanceOf(exp.visit(input), Object);
			assert.isTrue(expValidate.calledBefore(expDecorate));
		});

		it('Should NOT visit the visted instance', () => {
			const exp = Visitor.new();
			const input = {};
			const expDecorate = this.mockProto.expects('_decorate').never();

			const expValidate = this.mockProto.expects('validate')
				.once()
				.withArgs(input)
				.returns(false);

			assert.isNull(exp.visit(input));
		});

	});

});

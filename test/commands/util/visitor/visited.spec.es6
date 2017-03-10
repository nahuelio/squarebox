/**
*	@module commands.util.visitor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Visited from 'commands/util/visitor/visited';
import Visitor from 'commands/util/visitor/visitor';
import InterfaceException from 'commands/util/exception/proxy/interface';

describe('commands.util.visitor.Visited', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockProto = this.sandbox.mock(Visited.prototype);
		this.mockVisitor = this.sandbox.mock(Visitor.prototype);
	});

	afterEach(() => {
		this.mockProto.verify();
		this.mockVisitor.verify();
		this.sandbox.restore();
		delete this.mockProto;
		delete this.mockVisitor;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor', () => {

		it('Should get a new instance', () => {
			const input = { option: true };
			assert.instanceOf(Visited.new(input, { property: 'Visited' }), Object);
			assert.equal('Visited', input.property);
		});

	});

	describe('_valid()', () => {

		it('Should throw InterfaceException: target is not defined', () => {
			assert.throws(() => Visited.new(), InterfaceException.type.proxy());
		});

	});

	describe('proxy->get()', () => {

		it('Should proxify input with Visited: access to target property', () => {
			const input = { option: true, method: this.sandbox.spy() };
			const exp = Visited.new(input, { property: 'fromVisited' });
			exp.method();

			assert.equal(true, exp.option);
			assert.equal('fromVisited', exp.property);
			assert.isTrue(input.method.calledOnce);
			assert.isNotNull(exp.accept);
		});

	});

	describe('validate()', () => {

		it('Should return true', () => {
			const inputVisitor = Visitor.new();
			const exp = Visited.new({});
			assert.isTrue(exp.validate(inputVisitor));
		});

		it('Should return false: visitor not defined', () => {
			const exp = Visited.new({});
			assert.isFalse(exp.validate());
		});

		it('Should return false: visitor not implementing Visited', () => {
			const exp = Visited.new({});
			assert.isFalse(exp.validate({}));
		});

	});

	describe('accept()', () => {

		it('Should accept visitor', () => {
			const inputVisitor = Visitor.new();
			const exp = Visited.new({});

			const expValidate = this.mockProto.expects('validate')
				.once()
				.withArgs(inputVisitor)
				.returns(true);

			const expVisit = this.mockVisitor.expects('visit')
				.once()
				.withArgs(exp)
				.returns(exp);

			assert.instanceOf(exp.accept(inputVisitor), Object);
			assert.isTrue(expValidate.calledBefore(expVisit));
		});

		it('Should NOT accept visitor', () => {
			const inputVisitor = Visitor.new();
			const exp = Visited.new({});

			const expValidate = this.mockProto.expects('validate')
				.once()
				.withArgs(inputVisitor)
				.returns(false);

			const expVisit = this.mockVisitor.expects('visit').never();

			assert.instanceOf(exp.accept(inputVisitor), Object);
		});

	});

});

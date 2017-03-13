/**
*	@module util.visitor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Visited from 'util/visitor/visited';
import Visitor from 'util/visitor/visitor';
import InterfaceException from 'util/exception/proxy/interface';

describe('util.visitor.Visited', function() {

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
			const exp = Visited.new({ property: 'Visited' });
			assert.instanceOf(exp, Visited);
			assert.equal('Visited', exp.property);
		});

	});

	describe('getPrototypeOf', () => {

		it('Should return visited prototype when instanceOf evaluation occur', () => {
			const target = function() {};
			const exp = Visited.new({});
			assert.equal(exp.getPrototypeOf(target), exp.constructor.prototype);
		});

	});

	describe('ownKeys()', () => {

		it('Should always return visited own keys on proxified target', () => {
			const target = { name: 'Target' };
			const exp = Visited.new({ name: 'visited' });
			assert.lengthOf(_.keys(exp), exp.ownKeys(target).length);
		});

	});

	describe('get()', () => {

		it('Should proxify input with Visited: access to target property', () => {
			const input = { target: 'fromTarget', targetMethod: this.sandbox.spy() };
			const exp = Visited.new({ visited: 'fromVisited', visitedMethod: this.sandbox.spy() });

			// Target Visitor
			exp.get(input, 'targetMethod')();
			assert.equal('fromTarget', exp.get(input, 'target'));
			assert.isTrue(input.targetMethod.calledOnce);
			assert.equal(input.targetMethod.getCall(0).args[0], exp);

			// Visited
			exp.get(input, 'visitedMethod')();
			assert.equal('fromVisited', exp.get(input, 'visited'));
			assert.isTrue(exp.visitedMethod.calledOnce);
			assert.lengthOf(exp.visitedMethod.getCall(0).args, 0);

			assert.isNotNull(exp.accept);
		});

		it('Should proxify the visited always if property/function names have the same name/key', () => {
			const input = { property: 'fromTarget', method: this.sandbox.spy() };
			const exp = Visited.new({ property: 'fromVisited', method: this.sandbox.spy() });

			// Always Visited
			exp.get(input, 'method')();
			assert.equal('fromVisited', exp.get(input, 'property'));
			assert.isTrue(exp.method.calledOnce);
			assert.isFalse(input.method.called);

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

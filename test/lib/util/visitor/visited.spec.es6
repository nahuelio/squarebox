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

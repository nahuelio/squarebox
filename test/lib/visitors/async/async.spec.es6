/**
*	@module visitors.async
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import Asynchronous from 'visitors/async/async';
import Visited from 'util/visitor/visited';
import InterfaceException from 'util/exception/proxy/interface';

describe('visitors.async.Asynchronous', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.target = () => { return { next: (adt, resolve, reject) => {} }; };
		this.mockAsync = this.sandbox.mock(Asynchronous.prototype);
	});

	afterEach(() => {
		this.sandbox.restore();
		delete this.target;
		delete this.mockAsync;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get a new instance', () => {
			const exp = Asynchronous.new(this.target());
			assert.instanceOf(exp, Asynchronous);
			assert.equal('AsynchronousVisitor', exp.name);
		});

	});

	describe('next()', () => {

		it('Should call promise\'s resolve as a default strategy', () => {
			const resolveSpy = this.sandbox.spy();
			const exp = Asynchronous.new({});
			assert.instanceOf(exp.next(resolveSpy), Asynchronous);
			assert.isTrue(resolveSpy.calledOnce);
		});

	});

	describe('visit()', () => {

		it('Should visit the target', () => {
			const input = Visited.new({ property: 'target', next: this.sandbox.spy() });
			const exp = Asynchronous.new();
			assert.instanceOf(exp.visit(input), Visited);
		});

		it('Should NOT visit the target: super.validate returns false', () => {
			const exp = Asynchronous.new();
			assert.isNull(exp.visit());
		});

	});

	describe('execute()', () => {

		it('Should return a decorated target with asynchronous capabilities', () => {
			const input = this.target();
			const visited = Visited.new(input);
			const exp = Asynchronous.new().visit(visited);
			assert.isNotNull(exp.execute);
			assert.instanceOf(exp.execute(), Promise);
		});

	});

});

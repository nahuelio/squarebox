/**
*	@module util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Stack from 'util/adt/stack';
import Command from 'command';

describe('util.adt.Stack', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockStack = this.sandbox.mock(Stack.prototype);
	});

	afterEach(() => {
		this.mockStack.verify();
		this.sandbox.restore();
		delete this.mockStack;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('#constructor()', () => {

		it('Should get an instance (initial emtpy elements)', () => {
			const exp = Stack.new();
			assert.instanceOf(exp, Stack);
			assert.isTrue(exp.isEmpty());
		});

		it('Should get an instance (with initial elements)', () => {
			const exp = Stack.new([1,2,3]);
			assert.instanceOf(exp, Stack);
			assert.isFalse(exp.isEmpty());
		});

	});

	describe('#push()', () => {

		it('Should push a new element', () => {
			const toPush = { option: true };
			const exp = Stack.new([], { interface: Command });
			const expEmit = this.mockStack.expects('emit')
				.once()
				.withArgs(Stack.events.push, exp, sinon.match.instanceOf(Command))
				.returns(exp);

			assert.isTrue(exp.push(toPush));
			assert.isFalse(exp.isEmpty());
		});

		it('Should NOT push a new element', () => {
			const exp = Stack.new();
			const expEmit = this.mockStack.expects('emit').never();

			assert.isFalse(exp.push());
			assert.isTrue(exp.isEmpty());
		});

	});

	describe('#peek()', () => {

		it('Should get the first element', () => {
			const exp = Stack.new([1,2,3]);
			assert.isNotNull(exp.peek());
			assert.equal(1, exp.peek());
		});

		it('Should NOT get the first element', () => {
			const exp = Stack.new();
			assert.isNull(exp.peek());
		});

	});

	describe('#pop()', () => {

		it('Should remove and get the first element', () => {
			const exp = Stack.new([{ env: 'dev' }, { env: 'stage' }], { interface: Command });
			const expPop = exp.last();
			const expEmit = this.mockStack.expects('emit')
				.once()
				.withArgs(Stack.events.pop, exp, expPop)
				.returns(exp);

			assert.equal(expPop, exp.pop());
			assert.instanceOf(exp.peek(), Command);
			assert.equal(1, exp.size());
		});

		it('Should NOT remove and get the first element', () => {
			const exp = Stack.new([], { interface: Command });
			assert.isNull(exp.pop());
			assert.isTrue(exp.isEmpty());
		});

	});

	describe('#search()', () => {

		it('Should search and retrieve the position of an element', () => {
			const exp = Stack.new(['a','b','c']);
			const expPos = exp.search('b');
			assert.equal(1, expPos);
		});

		it('Should NOT search (invalid element)', () => {
			const exp = Stack.new(['a','b','c']);
			const expPos = exp.search();
			assert.equal(-1, expPos);
		});

		it('Should search and retrieve -1 position (element not found)', () => {
			const newCommand = Command.new({ env: 'production' });
			const exp = Stack.new([{ env: 'staging' }, newCommand], { interface: Command });
			const expPos1 = exp.search(newCommand.toJSON());
			const expPos2 = exp.search(exp.get(0).toJSON());
			assert.equal(1, expPos1);
			assert.equal(0, expPos2);
		});

	});

});

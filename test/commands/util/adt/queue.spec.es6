/**
*	@module commands.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Queue from 'commands/util/adt/queue';
import Command from 'commands/command';
import QueueException from 'commands/util/exception/adt/queue';

describe('commands.util.adt.Queue', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockStatic = this.sandbox.mock(Queue);
		this.mockQueue = this.sandbox.mock(Queue.prototype);
	});

	afterEach(() => {
		this.mockStatic.verify();
		this.mockQueue.verify();

		this.sandbox.restore();

		delete this.mockStatic;
		delete this.mockQueue;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get a new instance', () => {
			assert.instanceOf(Queue.new(), Queue);
		});

	});

	describe('_valid()', () => {

		it('Should ERROR: elements is array and length is >= than capacity', () => {
			const exp = Queue.new([], { capacity: 2 });
			assert.throws(() => exp._valid([1,2,3]), QueueException.type.capacityViolation({ capacity: 2 }));
		});

		it('Should NOT be valid - element is null', () => {
			const exp = Queue.new([], { capacity: 2 });
			assert.isFalse(exp._valid());
		});

	});

	describe('_validCapacity()', () => {

		it('Should validate capacity to true - current size is <= than capacity', () => {
			const exp = Queue.new([], { capacity: 2 });
			const expSize = this.mockQueue.expects('size').once().returns(2);
			assert.isFalse(exp._validCapacity());
		});

	});

	describe('set()', () => {

		it('Should set elements', () => {
			const toSet = [1, 2];
			const exp = Queue.new([], { capacity: 2 });
			const expEmit = this.mockQueue.expects('emit')
				.once()
				.withArgs(Queue.events.set, exp, toSet)
				.returns(exp);

			assert.instanceOf(exp.set(toSet), Queue);
			assert.equal(2, exp.size());
		});

		it('Should NOT set elements (not valid)', () => {
			const exp = Queue.new([], { capacity: 2 });
			const expEmit = this.mockQueue.expects('emit').never();
			assert.instanceOf(exp.set(), Queue);
			assert.instanceOf(exp.set({}), Queue);
		});

	});

	describe('offer()', () => {

		it('Should push elements into the queue', () => {
			const toOffer = { env: 'stage' };
			const exp = Queue.new([{ env: 'dev' }], { capacity: 3, interface: Command, silent: true });
			const expEmit = this.mockQueue.expects('emit')
				.once()
				.withArgs(Queue.events.offer, exp, sinon.match.instanceOf(Command))
				.returns(exp);

			assert.isTrue(exp.offer(toOffer));
			assert.equal(2, exp.size());
		});

		it('Should NOT push elements into the queue', () => {
			const toOffer = { env: 'stage' };
			const exp = Queue.new([{ env: 'dev' }], { capacity: 1, interface: Command, silent: true });
			const expEmit = this.mockQueue.expects('emit').never();

			assert.isFalse(exp.offer(toOffer));
			assert.equal(1, exp.size());
		});

	});

	describe('peek()', () => {

		it('Should retrieve, but not remove the next element in the queue', () => {
			const exp = Queue.new([{ env: 'dev' }, { env: 'stage' }], { capacity: 2, interface: Command, silent: true });
			let next = exp.peek();
			assert.instanceOf(next, Command);
			assert.equal('dev', next.env);
			assert.equal(2, exp.size());
		});

		it('Should NOT retrieve the next element in the queue', () => {
			const exp = Queue.new([], { capacity: 2, interface: Command, silent: true });
			let next = exp.peek();
			assert.isNull(next);
			assert.isTrue(exp.isEmpty());
		});

	});

	describe('poll()', () => {

		it('Should retrieve and remove the next element in the queue', () => {
			const exp = Queue.new([{ env: 'dev' }, { env: 'stage' }], { capacity: 3, interface: Command, silent: true });
			const expEmit = this.mockQueue.expects('emit')
				.once()
				.withArgs(Queue.events.poll, exp, sinon.match.instanceOf(Command))
				.returns(exp);

			let next = exp.poll();
			assert.instanceOf(next, Command);
			assert.equal('dev', next.env);
			assert.equal(1, exp.size());
		});

		it('Should NOT retrieve (nor remove) the next element in the queue', () => {
			const exp = Queue.new([], { capacity: 2, interface: Command, silent: true });
			const expEmit = this.mockQueue.expects('emit').never();

			assert.isNull(exp.poll());
			assert.isTrue(exp.isEmpty());
		});

	});

});

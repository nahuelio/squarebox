/**
*	@module commands.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import QueueAsync from 'commands/util/adt/queue-async';
import Command from 'commands/command';
import QueueException from 'commands/util/exception/adt/queue';

describe('commands.util.adt.QueueAsync', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockStatic = this.sandbox.mock(QueueAsync);
		this.mockProto = this.sandbox.mock(QueueAsync.prototype);
	});

	afterEach(() => {
		this.mockStatic.verify();
		this.mockProto.verify();

		this.sandbox.restore();

		delete this.mockStatic;
		delete this.mockProto;
	});

	after(() => {
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get a new instance', () => {
			assert.instanceOf(QueueAsync.new([], { capacity: 3 }), QueueAsync);
		});

	});

	describe('async->start()', () => {

		it('Should start asynchronous queue', (done) => {
			const exp = QueueAsync.new([{ env: 'dev' }, { env: 'stage' }], { capacity: 2, interface: Command });

			exp.on(QueueAsync.events.next, (element) => {
				// TODO: assertions
			});
			exp.on(QueueAsync.events.end, (result) => {
				// TODO: assertions
				done();
			});

			assert.instanceOf(exp.poll(), Promise);
		});

	});

});

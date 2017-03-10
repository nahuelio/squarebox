/**
*	@module commands.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import QueueAsync from 'commands/util/adt/queue-async';
import Command from 'commands/command';
import InterfaceException from 'commands/util/exception/proxy/interface';

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

		it('Should get a new instance (no initial and no opts)', () => {
			assert.instanceOf(QueueAsync.new(), QueueAsync);
		});

	});

	describe('async->poll()', () => {

		it('Should poll all elements asynchronously from queue (with Events)', (done) => {
			const exp = QueueAsync.new([{ env: 'dev' }, { env: 'stage' }], { capacity: 2, interface: Command });

			exp.on(QueueAsync.events.next, (element) => {
				assert.instanceOf(element, Command);
			});

			exp.on(QueueAsync.events.end, (result) => {
				assert.isArray(result);
				assert.lengthOf(result, 2);
				assert.instanceOf(result[0], Command);

				done();
			});

			assert.instanceOf(exp.poll(), Promise);
		});

		it('Should poll all elements asynchronously from queue (without Events)', (done) => {
			const exp = QueueAsync.new([], { capacity: 2, interface: Command });
			const expEmit = this.mockProto.expects('emit').never();

			assert.isTrue(exp.offer({ env: 'dev' }, { silent: true }));
			assert.isTrue(exp.offer({ env: 'stage' }, { silent: true }));

			const result = exp.poll({ silent: true }).then((queue) => {
				assert.instanceOf(queue, QueueAsync);
				assert.isTrue(queue.isEmpty());
				done();
			}).catch((err) => console.log(err));
		});

		it('Should Error: Element doesn\'t implement commands.util.proxy.Asynchronous#next()', (done) => {
			const message = InterfaceException.type.interface({ name: 'commands.util.proxy.Asynchronous' });
			const exp = QueueAsync.new([{ simple: true }], { capacity: 1 });

			exp.poll().catch((err) => {
				assert.instanceOf(err, Error);
				assert.equal(err.message, message);
				done();
			});
		});

	});

});

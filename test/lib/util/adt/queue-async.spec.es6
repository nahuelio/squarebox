/**
*	@module util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import QueueAsync from 'util/adt/queue-async';
import Command from 'command';
import Asynchronous from 'visitors/async/async';
import InterfaceException from 'util/exception/proxy/interface';

describe('util.adt.QueueAsync', function() {

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
			const exp = QueueAsync.new([], { capacity: 3 });
			assert.instanceOf(exp, QueueAsync);
			assert.instanceOf(exp._visitor, Asynchronous);
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

			const result = exp.poll({ silent: true }).then((results) => {
				assert.instanceOf(results, Array);
				assert.lengthOf(results, 2);
				assert.instanceOf(results[0], Command);
				assert.isTrue(exp.isEmpty());

				done();
			}).catch((err) => console.log(err));
		});

		it('Should Error: Element doesn\'t implement interface util.visitor.Visited', () => {
			const message = InterfaceException.type.interface({ name: 'util.visitor.Visited' });
			assert.throws(() => QueueAsync.new([{ simple: true }], { capacity: 1 }), message);
		});

	});

});

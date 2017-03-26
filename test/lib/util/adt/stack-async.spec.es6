/**
*	@module util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import StackAsync from 'util/adt/stack-async';
import Command from 'command';
import Asynchronous from 'visitors/async/async';
import InterfaceException from 'util/exception/proxy/interface';

describe('util.adt.StackAsync', function() {

	before(() => {
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockStatic = this.sandbox.mock(StackAsync);
		this.mockProto = this.sandbox.mock(StackAsync.prototype);
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
			const exp = StackAsync.new([]);
			assert.instanceOf(exp, StackAsync);
			assert.instanceOf(exp._visitor, Asynchronous);
		});

		it('Should get a new instance (no initial and no opts)', () => {
			assert.instanceOf(StackAsync.new(), StackAsync);
		});

	});

	describe('async->pop()', () => {

		it('Should pop all elements asynchronously from the stack (with Events)', (done) => {
			const exp = StackAsync.new([{ env: 'dev' }, { env: 'stage' }], { interface: Command });

			exp.on(StackAsync.events.next, (element) => {
				assert.instanceOf(element, Command);
			});

			exp.on(StackAsync.events.end, (result) => {
				assert.isArray(result);
				assert.lengthOf(result, 2);
				assert.instanceOf(result[0], Command);

				done();
			});

			assert.instanceOf(exp.pop(), Promise);
		});

		it('Should pop all elements asynchronously from the stack (without Events)', (done) => {
			const exp = StackAsync.new([], { interface: Command });
			const expEmit = this.mockProto.expects('emit').never();

			assert.isTrue(exp.push({ env: 'dev' }, { silent: true }));
			assert.isTrue(exp.push({ env: 'stage' }, { silent: true }));

			const result = exp.pop({ silent: true }).then((results) => {
				assert.instanceOf(results, Array);
				assert.lengthOf(results, 2);
				assert.instanceOf(results[0], Command);
				assert.isTrue(exp.isEmpty());

				done();
			}).catch((err) => console.log(err));
		});

		it('Should Error: Element doesn\'t implement interface util.visitor.Visited', () => {
			const message = InterfaceException.type.interface({ name: 'util.visitor.Visited' });
			assert.throws(() => StackAsync.new([{ simple: true }]), message);
		});

	});

});

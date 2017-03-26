/**
*	@module visitors.configuration
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Remote from 'visitors/configuration/remote';
import Command from 'command';
import QueueAsync from 'util/adt/queue-async';
import request from 'request-promise';
import logger, { Logger } from 'util/logger/logger';

describe('visitors.configuration.Remote', function() {

	before(() => {
		this.remote = null;
		this.options = { url: 'http://squarebox.nahuel.io/.sqboxrc' };
		this.command = Command.new();
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockProto = this.sandbox.mock(Remote.prototype);
		this.mockCommand = this.sandbox.mock(Command.prototype);
		this.mockLogger = this.sandbox.mock(Logger.prototype);
	});

	afterEach(() => {
		this.mockProto.verify();
		this.mockCommand.verify();
		this.mockLogger.verify();

		this.sandbox.restore();

		delete this.mockProto;
		delete this.mockCommand;
		delete this.mockLogger;
	});

	after(() => {
		delete this.remote;
		delete this.options;
		delete this.command;
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get a new instance', () => {
			this.remote = Remote.new(this.command);
			assert.instanceOf(this.remote, Remote);
			assert.property(this.remote, 'command');
		});

	});

	describe('onResponse()', () => {

		it('Should resolve promise successfuly', (done) => {
			const output = { option: true };
			const expPromise = this.sandbox.stub().returnsPromise();
			const bindResolves = _.bind(expPromise.resolves, expPromise);
			const bindRejects = _.bind(expPromise.rejects, expPromise);

			const exp = this.remote.onResponse(bindResolves, bindRejects, output)();
			exp.then((result) => {
				assert.equal(output, result);
				done();
			});
		});

	});

	describe('onResponseError()', () => {

		it('Should resolve promise with Error', () => {
			const err = 'Remote Error';
			const output = { warn: Remote.messages.error({ err }) };
			const expPromise = this.sandbox.stub().returnsPromise();
			const bindResolves = _.bind(expPromise.resolves, expPromise);
			const bindRejects = _.bind(expPromise.rejects, expPromise);

			const exp = this.remote.onResponseError(bindResolves, bindRejects, err)();
			exp.then((result) => {
				assert.deepEqual(output, result);
				done();
			});
		});

	});

	describe('load()', () => {

		it('Should execute a remote request (resolves)', () => {
			const output = { option: true };
			const expPromise = this.sandbox.stub(request, 'get').returnsPromise();

			const spyInnerResolve = this.sandbox.spy();
			const spyInnerReject = this.sandbox.spy();

			const expOnResponseError = this.mockProto.expects('onResponseError').never();
			const expOnResponse = this.mockProto.expects('onResponse')
				.once()
				.withArgs(spyInnerResolve, spyInnerReject, output)
				.returns(spyInnerResolve(output));

			const exp = this.remote.load(this.options.url, spyInnerResolve, spyInnerReject);
			expPromise.resolves(output);

			assert.isTrue(spyInnerResolve.called);
			assert.isFalse(spyInnerReject.called);
		});

		it('Should execute a remote request (rejects)', () => {
			const output = 'Remote Error';
			const expPromise = this.sandbox.stub(request, 'get').returnsPromise();

			const spyInnerResolve = this.sandbox.spy();
			const spyInnerReject = this.sandbox.spy();

			const expOnResponse = this.mockProto.expects('onResponse').never();
			const expOnResponseError = this.mockProto.expects('onResponseError')
				.once()
				.withArgs(spyInnerResolve, spyInnerReject, output)
				.returns(spyInnerResolve(output));

			const exp = this.remote.load(this.options.url, spyInnerResolve, spyInnerReject);
			expPromise.rejects(output);

			assert.isTrue(spyInnerResolve.called);
			assert.isFalse(spyInnerReject.called);
		});

	});

	describe('next()', () => {

		it('Should resolve promise with not warning (Url available)', () => {
			const output = { option: true };
			const spyResolve = this.sandbox.spy();
			const spyReject = this.sandbox.spy();

			const expGetOptions = this.mockCommand.expects('getOptions')
				.once()
				.returns(this.options);

			const expLoad = this.mockProto.expects('load')
				.once()
				.withArgs(this.options.url, spyResolve, spyReject)
				.returns(spyResolve(output));

			const exp = this.remote.next({}, spyResolve, spyReject);

			assert.equal(output.option, spyResolve.firstCall.args[0].option);
			assert.isTrue(spyResolve.called);
			assert.isFalse(spyReject.called);
		});

		it('Should resolve promise with warning (No Url available)', () => {
			const spyResolve = this.sandbox.spy();
			const spyReject = this.sandbox.spy();

			const expGetOptions = this.mockCommand.expects('getOptions')
				.once()
				.returns({});

			const exp = this.remote.next({}, spyResolve, spyReject);

			assert.equal(Remote.messages.noUrl, spyResolve.firstCall.args[0].warn);
			assert.isTrue(spyResolve.called);
			assert.isFalse(spyReject.called);
		});

	});

});

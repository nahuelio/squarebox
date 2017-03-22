/**
*	@module visitors.configuration
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Local from 'visitors/configuration/local';
import Command from 'command';
import QueueAsync from 'util/adt/queue-async';
import logger, { Logger } from 'util/logger/logger';

describe('visitors.configuration.Local', function() {

	before(() => {
		this.local = null;
		this.options = { config: 'test/specs/.sqboxrc' };
		this.command = Command.new();
		this.configPath = path.resolve(this.command.cwd, this.options.config);
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockProto = this.sandbox.mock(Local.prototype);
		this.mockCommand = this.sandbox.mock(Command.prototype);
		this.mockLogger = this.sandbox.mock(Logger.prototype);
		this.mockFs = this.sandbox.mock(fs);
	});

	afterEach(() => {
		this.mockProto.verify();
		this.mockCommand.verify();
		this.mockLogger.verify();
		this.mockFs.verify();

		this.sandbox.restore();

		delete this.mockProto;
		delete this.mockCommand;
		delete this.mockLogger;
		delete this.mockFs;
	});

	after(() => {
		delete this.local;
		delete this.options;
		delete this.command;
		delete this.configPath;
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get a new instance', () => {
			this.local = Local.new(this.command, this.options);
			assert.instanceOf(this.local, Local);
		});

	});

	describe('resolvePath()', () => {

		it('Should resolve absolute path to a file', () => {
			const exp = this.local.resolvePath(this.options.config);
			assert.equal(this.configPath, exp);
		});

	});

	describe('exists()', () => {

		it('Should return true: file exists', () => {
			const expStatSync = this.mockFs.expects('statSync')
				.once()
				.withArgs(this.configPath)
				.returns({});

			assert.isTrue(this.local.exists(this.configPath));
		});

		it('Should return false: file doesn\'t exists (file is undefined)', () => {
			const expStatSync = this.mockFs.expects('statSync').never();
			assert.isFalse(this.local.exists());
		});

		it('Should return false: file doesn\'t exists (file not found in path)', () => {
			const expStatSync = this.mockFs.expects('statSync')
				.once()
				.withArgs(this.configPath)
				.throws(new Error('Not Found'));

			assert.isFalse(this.local.exists(this.configPath));
		});

	});

	describe('tryJson()', () => {

		it('Should return an object: valid json', () => {
			const expReadJsonSync = this.mockFs.expects('readJsonSync')
				.once()
				.withArgs(this.configPath)
				.returns({ valid: true });
			assert.isObject(this.local.tryJson(this.configPath));
		});

		it('Should return null: invalid json', () => {
			const expReadJsonSync = this.mockFs.expects('readJsonSync')
				.once()
				.withArgs(this.configPath)
				.throws(new Error('Invalid JSON'));
			assert.isNull(this.local.tryJson(this.configPath));
		});

	});

	describe('tryJs()', () => {

		it('Should return an object: valid javascript', () => {
			const jspath = path.resolve(this.command.cwd, 'test/specs/.sqbox.js');
			assert.isObject(this.local.tryJs(jspath));
		});

		it('Should return null: invalid javascript (file not found)', () => {
			const jspath = path.resolve(this.command.cwd, 'test/specs/.sqbox.ext');
			assert.isNull(this.local.tryJs(jspath));
		});

	});

	describe('load()', () => {

		it('Should load configuration file', () => {
			const input = { source: { scan: './src/**' } };
			const expExists = this.mockProto.expects('exists')
				.once()
				.withArgs(sinon.match.string)
				.returns(true);

			const expTryJson = this.mockProto.expects('tryJson')
				.once()
				.withArgs(sinon.match.string)
				.returns(input);

			const exp = this.local.load(this.options.config);
			assert.isObject(exp);
			assert.deepEqual(input, exp);
		});

		it('Should NOT load configuration file (file doesn\'t exists)', () => {
			const input = { warn: Local.messages.notFound };
			const expExists = this.mockProto.expects('exists')
				.once()
				.withArgs(sinon.match.string)
				.returns(false);

			const expTryJson = this.mockProto.expects('tryJson').never();
			const expTryJs = this.mockProto.expects('tryJs').never();

			const exp = this.local.load(this.options.config);
			assert.isObject(exp);
			assert.deepEqual(input, exp);
		});

		it('Should NOT load configuration file (Invalid Json && Javascript)', () => {
			const input = { warn: Local.messages.invalid };
			const expExists = this.mockProto.expects('exists')
				.once()
				.withArgs(sinon.match.string)
				.returns(true);

			const expTryJson = this.mockProto.expects('tryJson')
				.once()
				.withArgs(sinon.match.string)
				.returns(null);

			const expTryJs = this.mockProto.expects('tryJs')
				.once()
				.withArgs(sinon.match.string)
				.returns(null);

			const exp = this.local.load(this.options.config);
			assert.isObject(exp);
			assert.deepEqual(input, exp);
		});

	});

	describe('next()', () => {

		it('Should resolve promise for asynchronous operation', () => {
			const expResolved = { result: true };
			const resolvePromise = this.sandbox.stub().returnsPromise();
			const spyReject = this.sandbox.spy();

			const expGetOptions = this.mockCommand.expects('getOptions')
				.once()
				.returns(this.options);

			const expLoad = this.mockProto.expects('load')
				.once()
				.withArgs(this.options.config)
				.returns(expResolved);

			const exp = this.local.next({}, resolvePromise.resolves(expResolved), spyReject);
			assert.isTrue(exp.resolved);
			assert.deepEqual(expResolved, exp.resolveValue);
			assert.isTrue(spyReject.notCalled);
		});

	});

});

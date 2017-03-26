/**
*	@module visitors.commander
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import parse from 'visitors/commander/parse';
import Command from 'command';
import yargs from 'yargs';

describe('visitors.commander.Parse', function() {

	before(() => {
		this.command = Command.new();
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockYargs = this.sandbox.mock(yargs);
	});

	afterEach(() => {
		this.mockYargs.verify();

		this.sandbox.restore();

		delete this.mockYargs;
	});

	after(() => {
		delete this.command;
		delete this.sandbox;
	});

	describe('parse()', () => {

		it('Should call yargs parse', () => {
			const input = [process.argv[0], this.cwd].concat(['sqbox', 'bundle']);
			const ctx = {
				_args: this.sandbox.stub().returns(input),
				onParse: this.sandbox.spy()
			};
			const expParse = this.mockYargs.expects('parse')
				.once()
				.withArgs(input, sinon.match.func)
				.returns(yargs);

			assert.equal(yargs, parse(yargs, this.command, ctx));
			expParse.callArg(1);

			assert.isTrue(ctx._args.called);
			assert.isTrue(ctx.onParse.called);
		});

	});

});

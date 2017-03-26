/**
*	@module visitors.commander
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import usage from 'visitors/commander/usage';
import yargs from 'yargs';
import chalk from 'chalk';

describe('visitors.commander.Usage', function() {

	before(() => {
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
		delete this.sandbox;
	});

	describe('usage()', () => {

		it('Should apply usage directive to yargs', () => {
			const expUsage = this.mockYargs.expects('usage')
				.once()
				.withArgs(chalk.white('sqbox <command> [args]'))
				.returns(yargs);

			assert.equal(yargs, usage(yargs));
		});

	});

});

/**
*	@module visitors.commander
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import epilogue from 'visitors/commander/epilogue';
import chalk from 'chalk';
import yargs from 'yargs';

describe('visitors.commander.Epilogue', function() {

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

	describe('epilogue()', () => {

		it('Should apply epilogue directive to yargs', () => {
			const expEpilogue = this.mockYargs.expects('epilogue')
				.once()
				.withArgs(chalk.cyan('For more information, please visit http://squarebox.nahuel.io/'))
				.returns(yargs);

			assert.equal(yargs, epilogue(yargs));
		});

	});

});

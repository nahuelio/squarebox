/**
*	@module visitors.commander
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import helper from 'visitors/commander/commands';
import Collection from 'util/adt/collection';
import yargs from 'yargs';

describe('visitors.commander.Commands', function() {

	before(() => {
		this.command = {
			constructor: {
				commands: Collection.new([{
					name: 'one',
					aliases: ['uno'],
					description: 'Description One',
					options: { optionOne: {} }
				}, {
					name: 'two',
					aliases: ['dos'],
					description: 'Description Two',
					options: { optionTwo: {} }
				}])
			}
		};
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

	describe('commands()', () => {

		it('Should build and apply a list of commands to yargs', () => {
			const { commands } = this.command.constructor;
			const matcher = sinon.match((value) => {
				const { command } = value;
				return (_.has(command, 'name') &&
					_.has(command, 'aliases') &&
					_.has(command, 'description') &&
					_.has(command, 'options'));
			});

			const fake = {
				_command: this.sandbox.stub(),
				_aliases: this.sandbox.stub(),
				_desc: this.sandbox.stub(),
				_builder: this.sandbox.stub(),
				_handler: this.sandbox.stub()
			};

			fake._command.withArgs(sinon.match.object)
				.onFirstCall().returns(commands.get(0))
				.onSecondCall().returns(commands.get(1));

			fake._aliases.withArgs(sinon.match.object)
				.onFirstCall().returns(commands.get(0))
				.onSecondCall().returns(commands.get(1));

			fake._desc.withArgs(sinon.match.object)
				.onFirstCall().returns(commands.get(0))
				.onSecondCall().returns(commands.get(1));

			fake._builder.withArgs(sinon.match.object)
				.onFirstCall().returns(commands.get(0))
				.onSecondCall().returns(commands.get(1));

			fake._handler.withArgs(sinon.match.object)
				.onFirstCall().returns(commands.get(0))
				.onSecondCall().returns(commands.get(1));

			const expYargsCommand = this.mockYargs.expects('command')
				.twice()
				.withArgs(matcher)
				.returns(yargs);

			assert.equal(yargs, helper(yargs, this.command, fake));

			assert.isTrue(fake._command.calledWith(commands.get(0)));
			assert.isTrue(fake._aliases.calledWith(commands.get(0)));
			assert.isTrue(fake._desc.calledWith(commands.get(0)));
			assert.isTrue(fake._builder.calledWith(commands.get(0)));
			assert.isTrue(fake._handler.calledWith(commands.get(0)));
		});

	});

});

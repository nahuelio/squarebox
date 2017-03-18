/**
*	@module visitors
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Commander from 'visitors/commander';
import Command from 'command';
import chalk from 'chalk';

describe('visitors.Commander', function() {

	before(() => {
		this.command = Command.new();
		if(!this.commander) this.commander = Commander.new(this.command);
		this.sandbox = sinon.sandbox.create();
	});

	beforeEach(() => {
		this.mockProto = this.sandbox.mock(Commander.prototype);
	});

	afterEach(() => {
		this.mockProto.verify();

		this.sandbox.restore();

		delete this.mockProto;
	});

	after(() => {
		delete this.command;
		delete this.commander;
		delete this.sandbox;
	});

	describe('constructor()', () => {

		it('Should get an instance', () => {
			assert.instanceOf(this.commander, Commander);
			assert.instanceOf(this.commander.command, Command);
			assert.equal('CommanderVisitor', this.commander.name);
		});

	});

	describe('_args()', () => {

		it('Should return default arguments', () => {
			const res = this.commander._args();
			assert.isArray(res);
		});

		it('Should return custom arguments', () => {
			const res = this.commander._args(['param', '--value']);
			assert.isArray(res);
			assert.lengthOf(res, 2);
		});

	});

	describe('_command()', () => {

		it('Should return string representation of a command for yargs (with abbr)', () => {
			const input =  { name: 'bundle', abbr: 'be' };
			const exp = chalk.green(`${input.name}, -${input.abbr}`);
			const res = this.commander._command(input);
			assert.equal(exp, res);
		});

		it('Should return string representation of a command for yargs (without abbr)', () => {
			const input =  { name: 'bundle' };
			const exp = chalk.green(`${input.name}`);
			const res = this.commander._command(input);
			assert.equal(exp, res);
		});

	});

	describe('_aliases()', () => {

		it('Should return aliases', () => {
			const input = { aliases: ['b'] };
			assert.equal(this.commander._aliases(input), input.aliases);
		});

	});

	describe('_desc()', () => {

		it('Should return command description', () => {
			const input = { description: 'my description' };
			assert.equal(this.commander._desc(input), chalk.yellow(input.description));
		});

	});

	describe('_builder()', () => {

		it('Should return options (defaults)', () => {
			const input = { options: { url: { default: 'http://squarebox.nahuel.io/' } } };
			assert.deepEqual(this.commander._builder(input), input.options);
		});

	});

	describe('_handler()', () => {

		it('Should return a function handler for the command', () => {
			const input = { option: 1, option: 2 };
			const command = {};
			const expHandler = this.mockProto.expects('_onHandler')
				.once()
				.withArgs(command, input)
				.returns(this.commander);

			const exp = this.commander._handler(command, {});
			assert.isFunction(exp);
			exp(input);
		});

	});

	describe('_onHandler()', () => {

		xit('Should execute command handler for yargs', () => {

		});

	});

	describe('visit()', () => {

		it('Should visit commander visitor', () => {
			const expValidate = this.mockProto.expects('validate')
				.once()
				.withArgs(this.command)
				.returns(true);

			const exp = this.commander.visit(this.command);
			assert.instanceOf(exp, Command);
			assert.property(exp, 'commander');
		});

		it('Should NOT visit commander visitor (invalid)', () => {
			const input = Command.new();
			const expValidate = this.mockProto.expects('validate')
				.once()
				.withArgs(input)
				.returns(false);

			const exp = this.commander.visit(input);
			assert.instanceOf(exp, Command);
			assert.notProperty(exp, 'commander');
		});

	});

	describe('onParse()', () => {

		xit('Should execute onParse handler', () => {});

	});

	describe('read()', () => {

		xit('Should read CLI arguments via this visitor', () => {});

	});

});

/**
*	@module visitors
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { resolve } from 'path';
import _ from 'underscore';
import extend from 'extend';
import yargs from 'yargs';
import chalk from 'chalk';
import Factory from 'util/factory/factory';
import Visitor from 'util/visitor/visitor';
import logger from 'util/logger/logger';

/**
*	Class Commander
*	@extends {util.visitor.Visitor}
**/
class Commander extends Visitor {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param {Command} command - command visited by this visitor
	*	@return {util.visitor.Visitor}
	**/
	constructor(command) {
		return super({ command });
	}

	/**
	*	Default Strategy to add version option to the CLI
	*	@public
	*	@return {visitors.Commander}
	**/
	_version() {
		try {
			yargs.version(require(resolve(this.command.dirname, '..', 'package.json')).version);
		} catch(ex) {
			logger(`[WARN] SquareBox Version not detected caused by ${ex.message}`).debug(logger.yellow);
		}
		return this;
	}

	/**
	*	Default Strategy to add usage to the CLI
	*	@public
	*	@param {String} [message = 'sqbox <command> [args]'] - usage message to display
	*	@return {visitors.Commander}
	**/
	_usage(message = 'sqbox <command> [args]') {
		yargs.usage(chalk.white(message));
		return this;
	}

	/**
	*	Default Strategy to add commands into the CLI via yargs
	*	@private
	*	@return {visitors.Commander}
	**/
	_commands() {
		this.command.constructor.commands.reduce(_.bind(this._new, this), yargs);
		return this;
	}

	/**
	*	Reducer appends a command into the memoized yargs reference
	*	@public
	*	@param {yargs} memo - memoized yargs reference
	*	@param {Command} command - command instance
	*	@return {yargs}
	**/
	_new(memo, command) {
		return memo.command(_.reduce(Commander.builder(), _.bind(this._create, this, command), {}));
	}

	/**
	*	Build a new command object and
	*	@public
	*	@param {Command} command - command instance
	*	@param {Object} memo - memoized object
	*	@param {String} option - Yargs command option
	*	@return {Object}
	**/
	_create(command, memo, option) {
		memo[option] = this[`_${option}`](command);
		return memo;
	}

	/**
	*	Default Strategy that adds an epilogue information
	*	@private
	*	@return {visitors.Commander}
	**/
	_epilogue() {
		yargs.epilogue(chalk.cyan(`For more information, please visit http://squarebox.nahuel.io/`));
		return this;
	}

	/**
	*	Default Strategy that controls yargs width used for displaying information
	*	@private
	*	@return {visitors.Commander}
	**/
	_width() {
		yargs.wrap(120);
		return this;
	}

	/**
	*	Default Strategy for yargs argument parsing and returns the reference to the visited
	*	@public
	*	@return {util.visitor.Visited}
	**/
	_parse() {
		yargs.parse(this.programArgv(), (err, argv, output) =>
			this.command.emit(Commander.events.parse, err, argv, output));
		return this.command;
	}

	/**
	*	Parses Configuration options
	*	@public
	*	@return {yargs}
	**/
	build() {
		yargs.reset();
		return this._version()._usage()._commands()._epilogue()._width()._parse();
	}

	/**
	*	Default Strategy to retrieve program arguments
	*	@private
	*	@param {util.visitor.Visited} ctx - context reference
	*	@param {Any} [args = process.argv] - optional arguments
	*	@return {Array}
	**/
	programArgv(ctx, args = process.argv) {
		return args;
	}

	/**
	*	Creates command nomenclature for yargs
	*	@private
	*	@param {Command} command - command instance
	*	@return {String}
	**/
	_command(command) {
		const { name, abbr } = command;
		return chalk.green(`${name}` + (_.defined(abbr) ? `, -${abbr}` : ''));
	}

	/**
	*	Default Strategy that returns Command's aliases
	*	@public
	*	@param {Command} command - command instance
	*	@return {Array}
	**/
	_aliases(command) {
		return command.aliases;
	}

	/**
	*	Default Strategy that returns Command Description
	*	@private
	*	@param {Command} command - command instance
	*	@return {String}
	**/
	_desc(command) {
		return chalk.yellow(command.description);
	}

	/**
	*	Default Strategy that returns command options
	*	@private
	*	@param {Command} command - command instance
	*	@return {Object}
	**/
	_builder(command) {
		return command.options;
	}

	/**
	*	Default Strategy that returns Command Handler
	*	@private
	*	@param {Command} command - command instance
	*	@return {Function}
	**/
	_handler(command) {
		return (argv) => {
			Factory.register(command.path);
			this.command.settings({ options: extend(false, _.omit(argv, Commander.ignore), { path: command.path }) });
		};
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'CommanderVisitor';
	}

	/**
	*	Commander Events
	*	@static
	*	@type {Object}
	**/
	static events = {
		/**
		*	@event read
		**/
		parse: 'visitors:commander:read'
	}

	/**
	*	Yargs arguments to ignore
	*	@static
	*	@type {Array}
	**/
	static ignore = ['$0', '_', 'version']

	/**
	*	Yargs Command Builder option names
	*	@static
	*	@return {Array}
	**/
	static builder() {
		return ['command', 'aliases', 'desc', 'builder', 'handler'];
	}

}

export default Commander;

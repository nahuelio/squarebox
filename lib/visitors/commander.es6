/**
*	@module visitors
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import yargs from 'yargs';
import chalk from 'chalk';
import Factory from 'util/factory/factory';
import Collection from 'util/adt/collection';
import Visitor from 'util/visitor/visitor';

/**
*	Class Commander
*	@extends {util.visitor.Visitor}
**/
class Commander extends Visitor {

	/**
	*	Adds Program Version
	*	@public
	*	@param {String} version - program version
	*	@return {yargs}
	**/
	_version() {
		// FIXME: Get it from package.json
		return yargs.version('1.0.0');
	}

	/**
	*	Adds Usage message
	*	@public
	*	@param {String} [message = 'sqbox <command> [args]'] - usage message to display
	*	@return {yargs}
	**/
	_usage(message = 'sqbox <command> [args]') {
		yargs.usage(chalk.white(message));
		return this;
	}

	/**
	*	Default Strategy that returns Command name using yargs convention format
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
	*	Default Strategy that returns Command Options defaults
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
	*	@param {util.visitor.Visited} ctx - context reference
	*	@return {Function}
	**/
	_handler(command, ctx) {
		const instance = Factory.register(command.path).get(command.path);
		return _.bind(instance.run, instance);
	}

	/**
	*	Epilogue Information to show at the end
	*	@private
	*	@return {String}
	**/
	_epilogue() {
		return chalk.cyan(`For more information about the configuration, please visit http://squarebox.nahuel.io/`);
	}

	/**
	*	Parses Configuration options
	*	@public
	*	@param {util.visitor.Visited} ctx - context reference
	*	@param {Function} parse -
	*	@return {yargs}
	**/
	build(ctx, parse) {
		const { commands } = ctx.constructor;
		yargs.reset();
		return commands.reduce(_.bind(this.command, this, ctx), this._usage()._version())
			.epilogue(this._epilogue())
			.wrap(120)
			.parse(this.programArgv(), this.onParse);
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
	*	Default Parse Handler
	*	@public
	*	@param {Error} [err] - error reference while parsing
	*	@param {Object} argv - arguments parsed
	*	@param {Object} output - output reference
	*	@return {visitors.Commander}
	**/
	onParse(err, argv, output) {
		return this;
	}

	/**
	*	Reducer appends a command into the memoized yargs reference
	*	@public
	*	@param {util.visitor.Visited} ctx - context reference
	*	@param {yargs} memo - memoized yargs reference
	*	@param {Command} command - command instance
	*	@param {String} [description = ''] - command description
	*	@return {yargs}
	**/
	command(ctx, memo, command, description = '') {
		return memo.command(_.reduce(Commander.builder(), _.bind(this.newCommand, this, command), {}, this));
	}

	/**
	*	Build a new command object and
	*	@public
	*	@param {Command} command - command instance
	*	@param {Object} memo - memoized object
	*	@param {String} option - Yargs command option
	*	@return {Object}
	**/
	newCommand(command, memo, option) {
		memo[option] = this[`_${option}`](command);
		return memo;
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
	*	Yargs Command Builder option names
	*	@static
	*	@return {Array}
	**/
	static builder() {
		return ['command', 'aliases', 'desc', 'builder', 'handler'];
	}

	/**
	*	Move to Configuration - Available Artifacts
	*	@static
	*	@type {Array}
	**/
	static artifacts = [
		'visitors/configuration/remote',
		'visitors/configuration/local'
	];

}

export default Commander;

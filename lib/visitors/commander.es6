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
	*	Visit Strategy
	*	@public
	*	@override
	*	@param {util.visitor.Visited} vi - instance to be visited by this visitor
	*	@param {Any} [...args] - arguments passed to the visitor
	*	@return {util.visitor.Visited}
	**/
	visit(vi, ...args) {
		return this.validate(vi) ? extend(false, vi, { commander: this }) : vi;
	}

	/**
	*	Reads CLI arguments and build yargs interface
	*	@public
	*	@return {yargs}
	**/
	read() {
		return _.reduce(Commander.decorators, (memo, decorator) => {
			return Factory.get(decorator, memo, this.command, this);
		}, yargs.reset().wrap(120));
	}

	/**
	*	Commander CLI Options Parse Handler
	*	@public
	*	@param {Error} [err] - Parse Error
	*	@param {Object} argv - parsed options
	*	@param {Object} output - yargs output
	*	@return {visitors.Commander}
	**/
	onParse(err, argv, output) {
		return this.emit(Commander.events.parse, err, argv, output);
	}

	/**
	*	Commander Arguments
	*	@private
	*	@param {Array} [args = process.argv] - command line arguments verbatim
	*	@return {Array}
	**/
	_args(args = process.argv) {
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
		return (argv) => { return this._onHandler(command, argv); };
	}

	/**
	*	Default Command Handler
	*	@private
	*	@param {Command} command - command instance
	*	@param {Object} argv - yargs parsed arguments
	*	@return {viitors.Commander}
	**/
	_onHandler(command, argv) {
		Factory.register(command.path);
		this.command.settings({ options: extend(false, _.omit(argv, Commander.ignore), { path: command.path }) });
		return this;
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
	*	Commander decorators
	*	@static
	*	@type {Array}
	**/
	static decorators = [
		'visitors/commander/version',
		'visitors/commander/usage',
		'visitors/commander/epilogue',
		'visitors/commander/commands',
		'visitors/commander/parse'
	];

	/**
	*	Commander Events
	*	@static
	*	@type {Object}
	**/
	static events = {
		/**
		*	@event parse
		**/
		parse: 'visitors:commander:parse'
	}

	/**
	*	Yargs arguments to ignore
	*	@static
	*	@type {Array}
	**/
	static ignore = ['$0', '_', 'version'];

	/**
	*	Static Constructor
	*	@static
	*	@override
	*	@param {Any} [...args] - constructor arguments
	*	@return {visitors.Commander}
	**/
	static new(...args) {
		Factory.registerAll(Commander.decorators);
		return new this(...args);
	}

}

export default Commander;

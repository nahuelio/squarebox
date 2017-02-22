/**
*	@module commands
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import './util/mixins';
import _ from 'underscore';
import extend from 'extend';
import yargs from 'yargs';
import Collection from './util/adt/collection';
import CommandException from './util/exception/command';

/**
*	Class Command
*	@extends {events.EventEmitter}
**/
export default class Command extends EventEmitter {

	/**
	*	Commands Collection
	*	@private
	*	@type {commands.util.adt.Collection}
	**/
	_commands = new Collection([], { interface: Command })

	/**
	*	Constructor
	*	@public
	*	@param [args = {}] {Object} Constructor arguments
	*	@return {commands.Command}
	**/
	constructor(args) {
		super();
		return extend(true, this, this.defaults, _.pick(args, this.constructor.options));
	}

	/**
	*	Command Chainning
	*	@public
	*	@throws {commands.util.exceptions.CommandException}
	*	@param command {commands.Command} command used to chain
	*	@return {commands.Command}
	**/
	chain(command) {
		if(!_.defined(command) || !_.instanceOf(command, Command))
			throw CommandException.new({ type: 'chain', level: CommandException.fatal });
		this._commands.add(command);
		return this;
	}

	/**
	*	Default Command Run
	*	@public
	*	@return {commands.Command}
	**/
	run() {
		return this;
	}

	/**
	*	Retrieves source
	*	@public
	*	@return {Object}
	**/
	source() {
		return this.source;
	}

	/**
	*	Retrieves and resolves scan directory (glob)
	*	@public
	*	@return {String}
	**/
	scan() {
		return this.source().scan;
	}

	/**
	*	Retrieves list of extensions to scan
	*	@public
	*	@return {Array}
	**/
	extensions() {
		return this.source().extensions;
	}

	/**
	*	Retrieves aliases for modules
	*	@public
	*	@return {Object}
	**/
	alias() {
		return this.source().alias;
	}

	/**
	*	Retrieves target
	*	@public
	*	@return {Object}
	**/
	target() {
		return this.target;
	}

	/**
	*	Retrieves and resolves destination
	*	@public
	*	@return {String}
	**/
	destination() {
		return this.target().destination;
	}

	/**
	*	Retrieves export format
	*	@public
	*	@return {String}
	**/
	format() {
		return this.target().format;
	}

	/**
	*	Retrieves Yargs Arguments
	*	@public
	*	@return {Object}
	**/
	args() {
		return yargs.argv;
	}

	/**
	*	Returns a json representation of the instance of this class
	*	@public
	*	@return {Object}
	**/
	toJSON() {
		return this;
	}

	/**
	*	Command Defaults
	*	@static
	*	@type {Object}
	**/
	static defaults = {
		env: 'development'
	};

	/**
	*	Command options
	*	@static
	*	@type {Array}
	**/
	static options = [
		'env'
	];

	/**
	*	Command Events
	*	@static
	*	@type {Object}
	**/
	static events = {
		start: 'commands:command:start',
		end: 'commands:command:end'
	};

	/**
	*	Default Yargs setup
	*	@static
	*	@return {commands.Command}
	**/
	static setup() {
		return this;
	}

	/**
	*	Static Constructor
	*	@static
	*	@return {commands.Command}
	**/
	static new() {
		return new this();
	}

}

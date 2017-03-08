/**
*	@module commands
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from './util/mixins';
import extend from 'extend';
import JSON from './util/proxy/json';
import Collection from './util/adt/collection';
import CommandException from './util/exception/command/command';

/**
*	Class Command
*	@extends {events.EventEmitter}
*
*	@uses {commands.util.proxy.JSON}
**/
class Command extends EventEmitter {

	/**
	*	Constructor
	*	@public
	*	@param {Object} [args = {}] - constructor arguments
	*	@return {commands.Command}
	**/
	constructor(args = {}) {
		super();
		return JSON.proxy(this.settings(args));
	}

	/**
	*	Set settings
	*	@public
	*	@param {Object} [options = {}] - command options
	*	@return {commands.Command}
	**/
	settings(options) {
		return extend(true, this, Command.defaults, _.pick(options, this.constructor.options));
	}

	/**
	*	Proxified asynchronous next strategy
	*	@public
	*	@param adt {commands.util.proxy.Asynchronous} adt used for asynchronous operations
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@return {Promise}
	**/
	next(adt, resolve, reject) {
		this.once(Command.events.done, resolve);
		return this.run();
	}

	/**
	*	Default Command Run
	*	@public
	*	@return {commands.Command}
	**/
	run() {
		this.pending();
		return this.done();
	}

	/**
	*	Command Pending exeuction state
	*	@public
	*	@return {command.Command}
	**/
	pending() {
		return this.emit(Command.events.pending, this);
	}

	/**
	*	Command Done exeuction state
	*	@public
	*	@return {command.Command}
	**/
	done() {
		return this.emit(Command.events.done, this);
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
		'env',
		'cwd'
	];

	/**
	*	Command Events
	*	@static
	*	@type {Object}
	**/
	static events = {
		pending: 'commands:command:pending',
		done: 'commands:command:done'
	};

	/**
	*	Static Constructor
	*	@static
	*	@param [...agrs] {Any} constructor arguments
	*	@return {commands.Command}
	**/
	static new(...args) {
		return new this(...args);
	}

}

export default Command;

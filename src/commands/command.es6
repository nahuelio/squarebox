/**
*	@module commands
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from './util/mixins';
import extend from 'extend';
import Factory from 'commands/util/factory/factory';
import Visited from 'commands/util/visitor/visited';

/**
*	Class Command
*	@extends {commands.util.visitor.Visited}
*
*	@uses {commands.util.proxy.JSON}
*	@uses {commands.util.proxy.Asynchronous} - TODO: Convert Asynchronous into Visitor for QueueAsync/StackAysnc
**/
class Command extends Visited {

	/**
	*	Constructor
	*	@public
	*	@param {Object} [args = {}] - constructor arguments
	*	@return {commands.Command}
	**/
	constructor(args = {}) {
		super();
		return this.settings(args).register().acceptAll();
	}

	/**
	*	Set settings
	*	@public
	*	@param {Object} [options = {}] - command options
	*	@return {commands.Command}
	**/
	settings(options) {
		return extend(true, this, Command.defaults, _.pick(options, Command.options));
	}

	/**
	*	Registers Visitors
	*	@public
	*	@return {commands.Command}
	**/
	register() {
		Factory.basePath(this.dirname).registerAll(this.constructor.visitors);
		return this;
	}

	/**
	*	Accepts All Visitors
	*	@public
	*	@return {command.Command}
	**/
	acceptAll() {
		return _.reduce(this.constructor.visitors, (memo, v) => memo.accept(Factory.get(v)), this);
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
	*	Command Visitors
	*	@static
	*	@type {Array}
	**/
	static visitors = [
		'util/proxy/json'
	];

	/**
	*	Command Defaults
	*	@static
	*	@type {Object}
	**/
	static defaults = {
		env: 'development',
		dirname: __dirname,
		cwd: process.cwd()
	};

	/**
	*	Command options
	*	@static
	*	@type {Array}
	**/
	static options = [
		'env',
		'dirname',
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

/**
*	@module
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'util/mixins';
import extend from 'extend';
import Collection from 'util/adt/collection';
import Factory from 'util/factory/factory';
import StackAsync from 'util/adt/stack-async';
import Visited from 'util/visitor/visited';
import logger from 'util/logger/logger';

/**
*	Class Command
*	@extends {util.visitor.Visited}
*
*	@uses {visitors.formatter.Json}
*	@uses {visitors.async.Asynchronous}
**/
class Command extends Visited {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param {Object} [args = {}] - constructor arguments
	*	@return {Command}
	**/
	constructor(args = {}) {
		super();
		return extend(true, this.settings(args).registerAll(this.dirname), { stack: StackAsync.new([]) });
	}

	/**
	*	Set settings
	*	@see {visitors.Configuration}
	*	@public
	*	@param {Object} [options = {}] - command options
	*	@return {Command}
	**/
	settings(options) {
		return extend(true, this, _.defaults(_.pick(options, this.constructor.options), this.constructor.defaults));
	}

	/**
	*	Push a dependent subcommand onto this command
	*	@public
	*	@param {Command} memo - memoized version of this command
	*	@param {String} path - dependent command factory path
	*	@return {Command}
	**/
	push(memo, path) {
		let opts = extend(true, { parent: memo }, _.pick(memo.toJSON(), this.constructor.options));
		memo.stack.push(Factory.register(path).get(path, opts));
		return memo;
	}

	/**
	*	Proxified asynchronous next strategy
	*	@public
	*	@override
	*	@param adt {visitors.async.Asynchronous} adt used for asynchronous operations
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@return {Promise}
	**/
	next(adt, resolve, reject) {
		this.once(Command.events.done, resolve)
			.once(Command.events.error, reject);
		return this.run(resolve, reject);
	}

	/**
	*	Default hook before run
	*	@public
	*	@return {Command}
	**/
	before() {
		if(_.defined(this.getParent())) this.getParent().emit(Command.events.pending, this);
		return this.pending();
	}

	/**
	*	Default Run
	*	@public
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@return {Command}
	**/
	run(resolve, reject) {
		return this.before().after();
	}

	/**
	*	Default hook after run
	*	@public
	*	@return {Command}
	**/
	after() {
		this.done();
		if(_.defined(this.getParent())) this.getParent().emit(Command.events.done, this);
		return this;
	}

	/**
	*	Command Pending exeuction state
	*	@public
	*	@return {Command}
	**/
	pending() {
		logger(`[${this.constructor.name}] Started`).out();
		this.emit(Command.events.pending, this);
		return this;
	}

	/**
	*	Command Done exeuction state
	*	@public
	*	@return {Command}
	**/
	done() {
		logger(`[${this.constructor.name}] Finished`).out();
		this.emit(Command.events.done, this);
		return this;
	}

	/**
	*	Retrieves command depedents
	*	@public
	*	@return {Array}
	**/
	getDependsOn() {
		return this.constructor.dependsOn;
	}

	/**
	*	Retrieves command options
	*	@public
	*	@return {Object}
	**/
	getOptions() {
		return this.options;
	}

	/**
	*	Retrieves parent command
	*	@public
	*	@return {Command}
	**/
	getParent() {
		return this.parent;
	}

	/**
	*	Command Visitors
	*	@static
	*	@override
	*	@type {util.adt.Collection}
	**/
	static visitors = Collection.new(Visited.visitors.toJSON().concat([
		'visitors/async/async',
		'visitors/command/properties'
	]));

	/**
	*	List of commands that depends on
	*	@static
	*	@property dependsOn
	*	@type {Array}
	**/
	static dependsOn = [];

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
		'cwd',
		'scan',
		'exclude',
		'extensions',
		'alias',
		'external',
		'target',
		'logLevel',
		'parent'
	];

	/**
	*	Command Events
	*	@static
	*	@type {Object}
	**/
	static events = {
		pending: 'command:pending',
		error: 'command:error',
		done: 'command:done'
	};

}

export default Command;

/**
*	@module
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'util/mixins';
import extend from 'extend';
import Factory from 'util/factory/factory';
import Visited from 'util/visitor/visited';

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
	*	@param {Object} [args = {}] - constructor arguments
	*	@return {Command}
	**/
	constructor(args = {}) {
		super();
		return this.settings(args).register().acceptAll();
	}

	/**
	*	Set settings
	*	@see {visitors.Configuration}
	*	@public
	*	@param {Object} [options = {}] - command options
	*	@return {Command}
	**/
	settings(options) {
		return extend(true, this, this.constructor.defaults, _.pick(options, this.constructor.options));
	}

	/**
	*	Registers Visitors
	*	@public
	*	@return {Command}
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
		return _.reduce(this.constructor.visitors, (memo, v) => memo.accept(Factory.get(v, this)), this);
	}

	/**
	*	Proxified asynchronous next strategy
	*	FIXME: Implement when the command gets rejected.
	*	@public
	*	@override
	*	@param adt {util.proxy.Asynchronous} adt used for asynchronous operations
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@return {Promise}
	**/
	next(adt, resolve, reject) {
		this.once(Command.events.done, resolve);
		return this.run();
	}

	/**
	*	Default hook before run
	*	@public
	*	@return {Command}
	**/
	before() {
		return this.pending();
	}

	/**
	*	Default Run
	*	@public
	*	@return {Command}
	**/
	run() {
		return this.before().after();
	}

	/**
	*	Default hook after run
	*	@public
	*	@return {Command}
	**/
	after() {
		return this.done();
	}

	/**
	*	Command Pending exeuction state
	*	@public
	*	@return {command.Command}
	**/
	pending() {
		this.emit(Command.events.pending, this);
		return this;
	}

	/**
	*	Command Done exeuction state
	*	@public
	*	@return {command.Command}
	**/
	done() {
		this.emit(Command.events.done, this);
		return this;
	}

	/**
	*	Command Visitors
	*	@static
	*	@type {Array}
	**/
	static visitors = [
		'visitors/formatter/json',
		'visitors/async/async'
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

}

export default Command;

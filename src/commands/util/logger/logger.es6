/**
*	@module commands.util.logger
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';
import _s from 'underscore.string';
import extend from 'extend';
import chalk from 'chalk';

/**
*	Class Logger
*	@extends events.EventEmitter
**/
export class Logger extends EventEmitter {

	/**
	*	Constructor
	*	@public
	*	@param {Object} [opts = {}] - constructor options
	*	@return {commands.util.logger.Logger}
	**/
	constructor() {
		super();
		return extend(true, this, { _buffer: [] });
	}

	/**
	*	Proxy's 'getPrototypeOf' trap override
	*	@public
	*	@param {Any} target - constructor reference
	*	@return {Object}
	**/
	getPrototypeOf(target) {
		return this.constructor.prototype;
	}

	/**
	*	Proxy's 'get' trap override
	*	@public
	*	@param {Any} target - logger class reference
	*	@param {String} property - property to resolve
	*	@return {commands.util.logger.Logger}
	**/
	get(target, property) {
		if(_.defined(this[property])) return _.bind(this[property], this);
		if(_.defined(chalk[property])) return chalk[property];
		return null;
	}

	/**
	*	Proxy's 'apply' trap override
	*	@private
	*	@param {commands.util.logger.Logger} target - logger instance reference
	*	@param {Any} thisArg - this context reference
	*	@param {Array} args - arguments list
	*	@return
	**/
	apply(target, thisArg, args) {
		this._add(...args);
		return Logger.ref;
	}

	/**
	*	Appends Message to the internal buffer
	*	@public
	*	@param {String} [message = ''] - message to add
	*	@param {String} [style = chalk.white] - message style override
	*	@return {commands.util.logger.Logger}
	**/
	_add(message = '') {
		this._buffer.push(message);
		return this;
	}

	/**
	*	Flushes message buffer
	*	@private
	*	@emits {Logger.events.flush}
	*	@return {commands.util.logger.Logger}
	**/
	_flush() {
		this._buffer = [];
		return this;
	}

	/**
	*	Fires Event
	*	@public
	*	@param {String} name - event name
	*	@param [...args] {Any} - arguments to pass to the event being dispatch
	*	@return {commands.util.logger.Logger}
	**/
	_fire(name, opts) {
		if(!opts.silent) this.emit(name, this);
		return this;
	}

	/**
	*	Outputs message to the stdout
	*	@private
	*	@param {Function} style - chalk style override
	*	@param {String} [level = Logger.level.debug] - level
	*	@return {commands.util.logger.Logger}
	**/
	_output(style, level = Logger.level.debug) {
		level = _.defined(style) ? style : level;
		console.log(level(this._buffer.join('\n')));
		return this._flush();
	}

	/**
	*	Debug message
	*	@public
	*	@emits {Logger.events.debug}
	*	@param {Object} [opts = {}] - additional options
	*	@return {commands.util.logger.Logger}
	**/
	debug(style, opts = {}) {
		return this._output(style)._fire(Logger.events.debug, opts);
	}

	/**
	*	Warning message
	*	@public
	*	@emits {Logger.events.warning}
	*	@param {Object} [opts = {}] - additional options
	*	@return {commands.util.logger.Logger}
	**/
	warn(opts = {}) {
		return this._output(null, Logger.level.warning)._fire(Logger.events.warning, opts);
	}

	/**
	*	Fatal message
	*	@public
	*	@emits {Logger.events.fatal}
	*	@param {Object} [opts = {}] - additional options
	**/
	fatal(opts = {}) {
		this._output(null, Logger.level.fatal)._fire(Logger.events.fatal, opts);
		process.exit(1);
	}

	/**
	*	Logger Levels
	*	@static
	*	@type {Object}
	**/
	static level = {
		debug: chalk.green,
		warning: chalk.yellow,
		fatal: chalk.red
	}

	/**
	*	Logger Events
	*	@static
	*	@type {Object}
	**/
	static events = {

		/**
		*	@event flush
		**/
		flush: 'commands:util:logger:flush',

		/**
		*	@event debug
		**/
		debug: 'commands:util:logger:debug',

		/**
		*	@event warning
		**/
		warning: 'commands:util:logger:warning',

		/**
		*	@event fatal
		**/
		fatal:'commands:util:logger:fatal'

	}

	/**
	*	Sets an static reference of an instance of this class
	*	@private
	*	@static
	*	@param {commands.util.logger.Logger} logger - logger instance reference
	*	@return {Any}
	**/
	static _instance(logger) {
		return (this.ref = logger);
	}

	/**
	*	Static Constructor
	*	@static
	*	@param {Any} [...args] - constructor arguments
	*	@return {commands.util.logger.Logger}
	**/
	static new(...args) {
		return new this(...args);
	}

}

export default Logger._instance(new Proxy(Logger, Logger.new()));

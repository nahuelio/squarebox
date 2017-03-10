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
	*	@return {commands.util.logger.Logger}
	**/
	constructor() {
		super();
		this.level();
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
	*	@param {commands.util.logger.Logger} target - logger instance reference
	*	@param {String} property - property to resolve
	*	@return {commands.util.logger.Logger}
	**/
	get(target, property) {
		if(_.defined(this[property])) return this[property];
		if(_.defined(chalk[property])) return chalk[property];
		return null;
	}

	/**
	*	Proxy's 'set' trap override
	*	@public
	*	@param {commands.util.logger.Logger} target - logger instance reference
	*	@param {String} property - property to resolve
	*	@param {Any} value - value to set
	*	@return {Boolean}
	**/
	set(target, property, value) {
		this[property] = value;
		return true;
	}

	/**
	*	Proxy's 'defineProperty' trap override
	*	@public
	*	@param {commands.util.logger.Logger} target - logger instance reference
	*	@param {String} property - property to define
	*	@return {Boolean}
	**/
	defineProperty(target, property) {
		this[property] = null;
		return true;
	}

	/**
	*	Proxy's 'deleteProperty' trap override
	*	@public
	*	@param {commands.util.logger.Logger} target - logger instance reference
	*	@param {String} property - property to delete
	*	@return {Boolean}
	**/
	deleteProperty(target, property) {
		delete this[property];
		return true;
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
	*	Validates level of output provided
	*	Validation Rules:
	*		- If level equals `silent` -> will output only fatal logs
	*		- If level equals `output` -> will output warn, fatal and output (except debug).
	*		- If level equals `debug` -> will print all logs (warn, fatal, output  and debug).
	*	@public
	*	@param {Object} type - log's type
	*	@return {Boolean}
	**/
	_validate(type) {
		const { fatal, debug } = Logger.type;
		if(this._level === Logger.level.silent && _.isEqual(type.name, fatal.name)) return true;
		if(this._level === Logger.level.output && !_.isEqual(type.name, debug.name)) return true;
		if(this._level === Logger.level.debug) return true;
		return false;
	}

	/**
	*	Appends Message to the internal buffer
	*	@public
	*	@param {String} message - message to add
	*	@return {commands.util.logger.Logger}
	**/
	_add(message) {
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
	*	@param opts {Object} - additional options
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
	*	@param {Object} type - Logger type
	*	@return {commands.util.logger.Logger}
	**/
	_output(style, type) {
		if(!this._validate(type)) return this._flush();
		let format = _.defined(style) ? style : type.style;
		return this._stdout(format(this._buffer.join('\n')))._flush();
	}

	/**
	*	Standard Out (console.log wrapper)
	*	@private
	*	@param {String} content - content to output in stdout
	*	@return {commands.util.logger.Logger}
	**/
	_stdout(content) {
		console.warn(content);
		return this;
	}

	/**
	*	Output message
	*	@public
	*	@emits {Logger.events.debug}
	*	@param {Object} [opts = {}] - additional options
	*	@param {Object} style - chalk optional style
	*	@return {commands.util.logger.Logger}
	**/
	out(opts = {}, style) {
		return this._output(style, Logger.type.output)._fire(Logger.events.output, opts);
	}

	/**
	*	Debug message
	*	@public
	*	@emits {Logger.events.debug}
	*	@param {Object} [opts = {}] - additional options
	*	@param {Object} style - chalk optional style
	*	@return {commands.util.logger.Logger}
	**/
	debug(opts = {}, style) {
		return this._output(style, Logger.type.debug)._fire(Logger.events.debug, opts);
	}

	/**
	*	Warning message
	*	@public
	*	@emits {Logger.events.warning}
	*	@param {Object} [opts = {}] - additional options
	*	@return {commands.util.logger.Logger}
	**/
	warn(opts = {}) {
		return this._output(null, Logger.type.warning)._fire(Logger.events.warning, opts);
	}

	/**
	*	Fatal message
	*	@public
	*	@emits {Logger.events.fatal}
	*	@param {Object} [opts = {}] - additional options
	**/
	fatal(opts = {}) {
		this._output(null, Logger.type.fatal)._fire(Logger.events.fatal, opts);
		process.exit(1);
	}

	/**
	*	Sets Logger Level
	*	@public
	*	@param {String} [level = Logger.level.output] - log's level
	*	@return {Function}
	**/
	level(lvl = Logger.level.output) {
		this._level = lvl;
		return this;
	}

	/**
	*	Logger Types
	*	@static
	*	@type {Object}
	**/
	static type = {
		debug: {
			name: 'debug',
			style: chalk.white
		},
		output: {
			name: 'output',
			style: chalk.green
		},
		warning: {
			name: 'warning',
			style: chalk.yellow
		},
		fatal: {
			name: 'fatal',
			style: chalk.red
		}
	}

	/**
	*	Logger Levels
	*	@static
	*	@type {Object}
	**/
	static level = {
		output: 'logger:output', // Default
		debug: 'logger:debug',
		silent: 'logger:silent'
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
		*	@event output
		**/
		output: 'commands:util:logger:output',

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

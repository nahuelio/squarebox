/**
*	@module visitors
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Factory from 'util/factory/factory';
import Visitor from 'util/visitor/visitor';
import QueueAsync from 'util/adt/queue-async';
import logger, { Logger } from 'util/logger/logger';

/**
*	Class Configuration
*	@extends {util.visitor.Visitor}
**/
class Configuration extends Visitor {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param {Command} command - command visited by this visitor
	*	@return {visitors.Configuration}
	**/
	constructor(command) {
		super({ command });
		return extend(true, this, { queue: QueueAsync.new([], { capacity: Configuration.methods.length }) });
	}

	/**
	*	Create configuration retrieval method
	*	@private
	*	@param {String} method - configuration method path
	*	@return {util.visitor.Visitor}
	**/
	_create(method) {
		this.queue.offer(Factory.get(method, this.command));
		return this;
	}

	/**
	*	Format and overrides command options from the CLI arguments
	*	@private
	*	@param {Object} opts - cli options for source
	*	@return {visitors.Configuration}
	**/
	_override(opts) {
		let toOverride = _.pick(opts, Configuration.cliOptions);
		extend(true, this.command, _.reduce(toOverride, this._format, toOverride, this));
		return this;
	}

	/**
	*	Format a given CLI option by evaluating the key to load the factory formatter and passing the value
	*	to the formatter.
	*	@public
	*	@param {Object} memo - options being memoized
	*	@param {Any} memo - options being memoized
	*	@param {String} memo - options being memoized
	*	@return {Object}
	**/
	_format(memo, value, key) {
		let ph = this.formatterPath(key);
		if(Factory.exists(ph)) memo[key] = Factory.get(ph, value);
		return memo;
	}

	/**
	*	Merge configuration options (and possibly) applies overrides by CLI arguments.
	*	@private
	*	@param {Object} opts - configuration options for target
	*	@return {visitors.Configuration}
	**/
	_source(opts) {
		extend(true, this.command, _.pick(opts, Configuration.cliOptions))
		return this;
	}

	/**
	*	Merge configuration options (and possibly) applies overrides by CLI arguments.
	*	@private
	*	@param {Object} opts - configuration options for target
	*	@return {visitors.Configuration}
	**/
	_target(opts) {
		extend(true, this.command, {
			target: _.reduce(opts, (memo, cfg, name) => {
				memo[name] = _.pick(cfg, Configuration.cliOptions);
				return memo;
			}, opts)
		});
		return this;
	}

	/**
	*	Sets Logger level
	*	@private
	*	@param {String} level - logger level
	*	@return {visitors.Configuration}
	**/
	_logger(level) {
		logger.level(Logger.level[level]);
		return this;
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
		return this.validate(vi) ? extend(false, vi, { configuration: this }) : vi;
	}

	/**
	*	Parse Configuration based on source
	*	@public
	*	@return {Promise}
	**/
	parse() {
		Configuration.methods.forEach(_.bind(this._create, this));
		return this.queue.poll().then(_.bind(this.onParse, this), _.bind(this.onParseError, this));
	}

	/**
	*	Configuration Parse Complete Handler
	*	@public
	*	@param {Array} results - configuration results
	*	@return {visitors.Configuration}
	**/
	onParse(results) {
		_.each(_.compact(results), this.onOptions, this);
		return this;
	}

	/**
	*	Configuration options handler based on results
	*	@public
	*	@param {Object} result - result
	*	@return
	**/
	onOptions(result) {
		if(_.defined(result.warn)) return this.onParseError(result.warn);
		this._source(result.source)
			._target(result.target)
			._logger(result.logLevel)
			._override(this.command.options);
		return this;
	}

	/**
	*	Configuration Parse Error Handler
	*	@public
	*	@param {String} message - error message reference
	*	@return {visitors.Configuration}
	**/
	onParseError(message) {
		logger(message).warn();
		return this;
	}

	/**
	*	Resolves and return full formatter path
	*	@public
	*	@param {String} name - formatter name
	*	@return {String}
	**/
	formatterPath(name) {
		return `visitors/configuration/formatter/${name}`;
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'ConfigurationVisitor';
	}

	/**
	*	Factory
	*	@static
	*	@type {util.factory.Factory}
	**/
	static methods = [
		'visitors/configuration/remote',
		'visitors/configuration/local'
	];

	/**
	*	Factory Formatters for Options
	*	@static
	*	@type {Array}
	**/
	static formatters = [
		'visitors/configuration/formatter/alias',
		'visitors/configuration/formatter/exclude',
		'visitors/configuration/formatter/extensions',
		'visitors/configuration/formatter/target'
	];

	/**
	*	CLI Argument Options
	*	@static
	*	@type {Array}
	**/
	static cliOptions = ['scan', 'exclude', 'extensions', 'alias', 'target', 'destination', 'format'];

	/**
	*	Configuration Events
	*	@static
	*	@type {Object}
	**/
	static events = {
		/**
		*	@event parse
		**/
		parse: 'visitors:configuration:parse'
	};

	/**
	*	Static Constructor
	*	@static
	*	@override
	*	@param {Any} [...args] - constructor arguments
	*	@return {visitors.Configuration}
	**/
	static new(...args) {
		Factory.registerAll(Configuration.methods.concat(Configuration.formatters));
		return new this(...args);
	}

}

export default Configuration;

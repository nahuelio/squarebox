/**
*	@module visitors
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Factory from 'util/factory/factory';
import Visitor from 'util/visitor/visitor';
import QueueAsync from 'util/adt/queue-async';
import logger from 'util/logger/logger';

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
	*	@param {On}
	*	@param {String} method - configuration method path
	*	@return {util.visitor.Visitor}
	**/
	_create(options, method) {
		this.queue.offer(Factory.get(method, this.command, options));
	}

	/**
	*	Parse Configuration based on source
	*	@public
	*	@return {Promise}
	**/
	parse() {
		Configuration.methods.forEach(_.bind(this._create, this, this.command.options));
		return this.queue.poll().then(_.bind(this.onParse, this));
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
	*	Default Options
	*	@public
	*	@type {Array}
	**/
	defaultOptions() {
		return [
			'config',
			'source-scan',
			'source-extensions',
			'source-alias',
			'target-destination',
			'target-format'
		];
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
	*	Configuration Defaults
	*	@static
	*	@type {Object}
	**/
	static defaults = {
		'config': '.sqboxrc',
		'source-scan': '.',
		'source-extensions': ['.js', '.jsx', '.es6', '.es'],
		'source-alias': {},
		'target-destination': './dist',
		'target-format': 'ifie'
	};

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
	*	Configuration Events
	*	@static
	*	@type {Object}
	**/
	static events = {
		/**
		*	@event parse
		**/
		parse: 'visitors:configuration:parse'
	}

	/**
	*	Static Constructor
	*	@static
	*	@override
	*	@param {Any} [...args] - constructor arguments
	*	@return {visitors.Configuration}
	**/
	static new(...args) {
		Factory.registerAll(Configuration.methods);
		return new this(...args);
	}

}

export default Configuration;

/**
*	@module visitors
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Factory from 'util/factory/factory';
import Visitor from 'util/visitor/visitor';
import QueueAsync from 'util/adt/queue-async';

/**
*	Class Configuration
*	@extends {util.visitor.Visitor}
**/
class Configuration extends Visitor {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param {Command} commnand - command reference
	*	@return {visitors.Configuration}
	**/
	constructor(command) {
		super();
		return extend(true, this, { queue: QueueAsync.new() });
	}

	/**
	*	Load Configuration
	*	@public
	*	@param {util.visitor.Visited} ctx - context reference
	*	@return {visitors.Commander}
	**/
	load(ctx) {
		// TODO: [js,json,uri] QueueAsync for executing for configuration
		return this;
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
	*	Configuration options
	*	@static
	*	@type {Array}
	**/
	static options = [
		'config',
		'source-scan',
		'source-extensions',
		'source-alias',
		'target-destination',
		'target-format'
	];

}

export default Configuration;

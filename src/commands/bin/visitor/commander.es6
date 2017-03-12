/**
*	@module commands.bin.visitor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import yargs from 'yargs';
import Visitor from 'commands/util/visitor/visitor';
import QueueAsync from 'commands/util/adt/queue-async';

/**
*	Class Commander
*	@extends {commands.util.visitor.Visitor}
**/
class Commander extends Visitor {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param {Any} [...args] - constructor arguments
	*	@return {commands.bin.visitor.Commander}
	**/
	constructor(...args) {
		super(...args);
		return extend(true, this, { queue: QueueAsync.new() });
	}

	/**
	*	Parses Configuration options
	*	@public
	*	@param {commands.util.proxy.Json} ctx - context reference
	*	@return {commands.bin.visitor.Commander}
	**/
	parse(ctx) {
		// TODO: [js,json,uri] QueueAsync for executing for configuration
		return this;
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'CommanderVisitor';
	}

	/**
	*	Available Artifacts
	*	@static
	*	@type {Array}
	**/
	static artifacts = [
		'configuration'
	]; // TODO

	/**
	*	Commander Defaults
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
	*	Commander options
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

export default Commander;

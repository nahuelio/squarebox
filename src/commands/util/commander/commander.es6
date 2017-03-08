/**
*	@module commands.util.commander
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';
import extend from 'extend';
import yargs from 'yargs';

/**
*	Class Commander
*	@extends {events.Emitter}
**/
class Commander extends EventEmitter {

	/**
	*	Constructor
	*	@public
	*	@param [...args] {Any} - additional arguments
	*	@return {commands.util.commander.Commander}
	**/
	constructor(...args) {
		super();
		return extend(true, this, ...args);
	}

	/**
	*	Default Proxy getPropertyOf trap
	*	@public
	*	@param {commands.Command} target - command reference
	*	@return {Object}
	**/
	getPropertyOf(target) {
		return target.constructor.protoype;
	}

	/**
	*	Default Proxy get trap
	*	@public
	*	@param {commands.Command} target - command reference
	*	@param {String} property - command reference
	*	@return {Any}
	**/
	get(target, property) {
		// TODO
		return target[property];
	}

	/**
	*	Default Proxy get trap
	*	@public
	*	@param {commands.Command} target - command reference
	*	@param {String} property - property name
	*	@param {Any} value - value to set
	*	@return {Any}
	**/
	set(target, property, value) {
		return (target[property] = value);
	}

	/**
	*	Default arguments parsing
	*	@public
	*	@return {commands.util.commander.Commander}
	**/
	async parse() {
		// TODO: [js,json,uri]
		return this;
	}

	/**
	*	Available Artifacts
	*	@static
	*	@type {Array}
	**/
	static artifacts = []; // TODO

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
		'source-extensions'
		'source-alias',
		'target-destination',
		'target-format'
	];

	/**
	*	Static Constructor
	*	@static
	*	@param [...args] {Any} constructor arguments
	*	@return {commands.util.command.Commander}
	**/
	static new(...args) {
		return new this(...args);
	}

}

export default Commander.new();

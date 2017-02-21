/**
*	Squarebox Build
*	@module Build
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import Package from '../../../package.json';
import _ from 'underscore';
import extend from 'extend';
import yargs from 'yargs';
import { EventEmitter } from 'events';

/**
*	Class Build
*	@extends events.EventEmiter
**/
class Build extends EventEmitter {

	/**
	*	Constructor
	*	@public
	*	@param [args = {}] {Object} Constructor arguments
	*	@return Build
	**/
	constructor(args) {
		super();
		console.log(args);
		return extend(true, this);
	}

	/**
	*	Build Run
	*	@public
	*	@return Build
	**/
	run() {
		return this;
	}

	/**
	*	Default Argument Options
	*	@static
	*	@type {Object}
	**/
	static defaults = {
		env: 'development'
	};

	/**
	*	Filter Arguments to options
	*	@static
	*	@type {Array}
	**/
	static options = [
		'env'
	];

	/**
	*	Static Constructor
	*	@static
	*	@return Build
	**/
	static new() {
		return new this(yargs.argv).run();
	}

}

export default Build.new();

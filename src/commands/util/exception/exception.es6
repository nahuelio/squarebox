/**
*	@module commands.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Logger from '../logger/logger';

/**
*	Class Exception
*	@extends {Error}
**/
export default class Exception extends Error {

	/**
	*	Exception Name
	*	@public
	*	@type {String}
	**/
	name = 'Exception';

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param message {Function} message template function
	*	@param [...args] {Any} constructor attribute
	*	@return {commands.util.exception.Exception}
	**/
	constructor(message, ...args) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		return this;
	}

	/**
	*	Command Exception types
	*	@public
	*	@type {Object}
	**/
	static type = {
		unknown: _.template('Unknown Exception')
	};

	/**
	*	Static Constructor
	*	@static
	*	@param [type = 'unknown']
	*	@param [...args] {Any} additional arguments
	*	@return {commands.util.exception.Exception}
	**/
	static new(type, ...args) {
		return new this(this.type[type](...args), ...args);
	}

}

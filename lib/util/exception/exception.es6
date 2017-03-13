/**
*	@module util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Logger from 'util/logger/logger';

/**
*	Class Exception
*	@extends {Error}
**/
class Exception extends Error {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param message {Function} message template function
	*	@param [...args] {Any} constructor attribute
	*	@return {util.exception.Exception}
	**/
	constructor(message, ...args) {
		super(message);
		this.name = 'Exception';
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
	*	@return {util.exception.Exception}
	**/
	static new(type, ...args) {
		return new this(this.type[type](...args), ...args);
	}

}

export default Exception;

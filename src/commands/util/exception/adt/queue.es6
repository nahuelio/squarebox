/**
*	@module commands.util.exception.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Exception from '../exception';

/**
*	Class QueueException
*	@extends {commands.util.exception.Exception}
**/
class QueueException extends Exception {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param [...args] {Any} constructor attribute
	*	@return {commands.util.exception.adt.QueueException}
	**/
	constructor(...args) {
		super(...args);
		this.name = 'QueueException';
		return this;
	}

	/**
	*	Command Exception types
	*	@public
	*	@type {Object}
	**/
	static type = extend(true, {}, Exception.type, {
		capacityViolation: _.template(`Queue element's collection passed overflows the current capacity <%= capacity %>`)
	});

}

export default QueueException;

/**
*	@module util.exception.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Exception from 'util/exception/exception';

/**
*	Class QueueException
*	@extends {util.exception.Exception}
**/
class QueueException extends Exception {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param [...args] {Any} constructor attribute
	*	@return {util.exception.adt.QueueException}
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
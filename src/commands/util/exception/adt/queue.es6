/**
*	@module commands.util.adt.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Exception from '../exception';

/**
*	Class QueueException
*	@extends {commands.util.exception.Exception}
**/
export default class QueueException extends Exception {

	/**
	*	Exception Name
	*	@public
	*	@type {String}
	**/
	name = 'QueueException';

	/**
	*	Command Exception types
	*	@public
	*	@type {Object}
	**/
	static type = extend(true, {}, Exception.type, {
		capacityViolation: _.template(`Queue element's collection passed overflows the current capacity <%= capacity %>`)
	});

}

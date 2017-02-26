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
	*	Command Exception types
	*	@public
	*	@type {Object}
	**/
	static type = extend(true, Exception.type, {
		capacityUndefined: _.template(`Queue requires a 'capacity' property in order to be instanciate it`),
		capacityViolation: _.template(`Queue element's collection passed overflows the current capacity
			<%= capacity %>`)
	});

}

/**
*	@module commands.visitors.async
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';
import Visitor from 'commands/util/visitor/visitor';

/**
*	Class Asynchronous
*	@extends {commands.util.visitor.Visitor}
**/
class Asynchronous extends Visitor {

	/**
	*	Default Next Strategy to always resolve the promise.
	*	Note: This method was designed (and it's most likely) to be overriden by
	*	{@link commands.util.visitor.Visited} subclasses that use this visitor.
	*	@public
	*	@param adt {commands.util.proxy.Asynchronous} adt used for asynchronous operations
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@return {Promise}
	**/
	next(adt, resolve, reject) {
		return resolve();
	}

	/**
	*	Default strategy to perform an asynchronous operation
	*	@public
	*	@param {commands.util.visitor.Visited} [ctx] - context reference
	*	@param {commands.visitors.async.Asynchronous} adt - reference to adt using this interface on their elements
	*	@return {Promise}
	**/
	execute(ctx, adt) {
		return new Promise((resolve, reject) => ctx.next(adt, resolve, reject));
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'AsynchronousVisitor';
	}

}

export default Asynchronous;

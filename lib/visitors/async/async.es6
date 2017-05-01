/**
*	@module visitors.async
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';
import Visitor from 'util/visitor/visitor';

/**
*	Class Asynchronous
*	@extends {util.visitor.Visitor}
**/
class Asynchronous extends Visitor {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param {Any} [...args] - constructor arguments
	*	@return {visitors.async.Asynchronous}
	**/
	constructor(...args) {
		return super();
	}

	/**
	*	Default Next Strategy to always resolve the promise.
	*	Note: This method was designed (and it's most likely) to be overriden by
	*	{@link util.visitor.Visited} subclasses that use this visitor.
	*	@public
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@param {Any} [...args] additonal arguments
	*	@return {visitors.async.Asynchronous}
	**/
	next(resolve, reject) {
		resolve();
		return this;
	}

	/**
	*	Default strategy to perform an asynchronous operation
	*	@public
	*	@param {util.visitor.Visited} [ctx] - context reference
	*	@param {visitors.async.Asynchronous} adt - reference to adt using this interface on their elements
	*	@param {Any} [...args] additonal arguments
	*	@return {Promise}
	**/
	execute(ctx, adt, ...args) {
		return new Promise((resolve, reject) => ctx.next(resolve, reject, ...args));
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

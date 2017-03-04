/**
*	@module commands.util.proxy
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';
import InterfaceException from 'commands/util/exception/proxy/interface';

/**
*	Interface Asynchronous
*	@extends events.EventEmitter
**/
class Asynchronous extends EventEmitter {

	/**
	*	Proxy's `get` trap strategy
	*	@public
	*	@param target {Any} proxy target
	*	@param property {String} property name
	*	@param receiver {Any} proxy receiver
	*	@return {Any}
	**/
	get(target, property) {
		let value = _.defined(this[property]) ? this[property] : target[property];
		return _.isFunction(value) ? this._context(target, property, value) : value;
	}

	/**
	*	Resolves proxified function binding with context
	*	@private
	*	@param target {Any} proxy target
	*	@param property {String} property name
	*	@param func {Function} proxified function
	*	@return {Function}
	**/
	_context(target, property, func) {
		return _.defined(this[property]) ? _.bind(func, target, this) : _.bind(func, target);
	}

	/**
	*	Default strategy to perform an asynchronous operation
	*	@public
	*	@param [ctx] {commands.util.proxy.Asynchronous} context reference
	*	@param adt {commands.util.proxy.Asynchronous} reference to adt using this proxy on their elements
	*	@return {Promise}
	**/
	do(ctx, adt) {
		return new Promise((resolve, reject) => this.next(adt, resolve, reject));
	}

	/**
	*	Proxifies a given target with an instance of this class
	*	@static
	*	@throws {commands.util.exception.proxy.InterfaceException}
	*	@param target {Any} instance to proxify
	*	@param [...args] {Any} constructor arguments
	*	@return {commands.util.proxy.Asynchronous}
	**/
	static proxy(target, ...args) {
		if(!_.defined(target)) throw InterfaceException.new('proxy');
		return new Proxy(target, new this(...args));
	}

}

export default Asynchronous;

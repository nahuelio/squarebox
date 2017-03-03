/**
*	@module commands.util.interface
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import InterfaceException from 'commands/util/exception/proxy/interface';

/**
*	Interface JSON
**/
class Json {

	/**
	*	Proxy's `getPrototypeOf` trap strategy
	*	@public
	*	@param target {Any} proxy's target
	*	@return {Object}
	**/
	getPrototypeOf(target) {
		return target.constructor.prototype;
	}

	/**
	*	Proxy's `get` trap strategy
	*	@public
	*	@param target {Any} proxy target
	*	@param property {String} property name
	*	@param receiver {Any} proxy receiver
	*	@return {Any}
	**/
	get(target, property, receiver) {
		let value = _.defined(this[property]) ? this[property] : target[property];
		return _.isFunction(value) ? _.bind(value, target, this) : value;
	}

	/**
	*	Reducer Strategy to iterate over properties
	*	@public
	*	@param m {Object} memoized object reference
	*	@param v {Any} current object's value
	*	@param k {String} current object's key
	*	@return {Object}
	**/
	_reduce(m, v, k) {
		if(_.isAdt(v)) this._clean(v, v);
		if(!_.isFunction(v)) { m[k] = v; return m; }
		if(_.isArray(m)) m.splice(k, 1)
		if(_.isRealObject(m)) delete m[k];
		return m;
	}

	/**
	*	Clean Functions from JSON representation
	*	@public
	*	@param current {Any} current object
	*	@param [memo = {}] {Object} memoized object
	*	@return {Object}
	**/
	_clean(current, memo = {}) {
		return _.reduce(current, this._reduce, memo, this);
	}

	/**
	*	Returns a json representation of the instance of this class
	*	This method uses recursion
	*	@public
	*	@param ctx {commands.util.proxy.Json} reference to the instance of this class
	*	@return {Object}
	**/
	toJSON(ctx) {
		return JSON.parse(JSON.stringify(ctx._clean(this)));
	}

	/**
	*	Proxifies a given target with an instance of this class
	*	@static
	*	@throws {commands.util.exception.proxy.InterfaceException}
	*	@param target {Any} instance to proxify
	*	@param [...args] {Any} constructor arguments
	*	@return {commands.util.proxy.Json}
	**/
	static proxy(target, ...args) {
		if(!_.defined(target)) throw InterfaceException.new('proxy');
		return new Proxy(target, new this(...args));
	}

}

export default Json;

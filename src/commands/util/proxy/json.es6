/**
*	@module commands.util.proxy
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import Visitor from 'commands/util/visitor/visitor';
import InterfaceException from 'commands/util/exception/proxy/interface';

/**
*	Class JSON
*	@extends {commands.util.visitor.Visitor}
**/
class Json extends Visitor {

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
		let keys = Object.getOwnPropertyNames(current);
		return _.reduce(keys, (m, k) => this._reduce(m, current[k], k), memo, this);
	}

	/**
	*	Returns a json representation of the instance of this class
	*	This method uses recursion
	*	@public
	*	@param [ctx] {commands.util.proxy.Json} context reference
	*	@return {Object}
	**/
	toJSON(ctx) {
		return JSON.parse(JSON.stringify(this._clean(ctx)));
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'JsonVisitor';
	}

}

export default Json;

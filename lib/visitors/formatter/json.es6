/**
*	@module visitors.formatter
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import Visitor from 'util/visitor/visitor';
import InterfaceException from 'util/exception/proxy/interface';

/**
*	Class JSON
*	@extends {util.visitor.Visitor}
**/
class Json extends Visitor {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param {Any} [...args] - constructor arguments
	*	@return {visitors.formatter.Json}
	**/
	constructor(...args) {
		return super();
	}

	/**
	*	Reducer Strategy to iterate over properties
	*	@public
	*	@param {Object} m - memoized object reference
	*	@param {Any} v - current object's value
	*	@param {String} k - current object's key
	*	@return {Object}
	**/
	_filterObject(m, v, k) {
		if(_.isNative(v)) {
			m[k] = v;
			return m;
		}
		return m;
	}

	/**
	*	Clean Functions from JSON representation
	*	@public
	*	@param {Any} current - current object
	*	@param {Object} [memo = {}] - memoized object
	*	@return {Object}
	**/
	_clean(current, memo = {}) {
		let keys = Object.getOwnPropertyNames(current);
		return _.reduce(keys, (m, k) => this._filterObject(m, current[k], k), memo, this);
	}

	/**
	*	Returns a json representation of the instance of this class
	*	This method uses recursion
	*	@public
	*	@param {visitors.formatter.Json} [ctx] - context reference
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

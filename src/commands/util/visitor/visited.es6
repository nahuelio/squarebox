/**
*	@module commands.util.visitor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';
import extend from 'extend';
import Visitor from 'commands/util/visitor/visitor';
import InterfaceException from 'commands/util/exception/proxy/interface';

/**
*	Class Visited
*	@extends {events.EventEmitter}
**/
class Visited extends EventEmitter {

	/**
	*	Constructor
	*	@public
	*	@param {Any} [...args] - constructor arguments
	*	@return {commands.util.visitor.Visited}
	**/
	constructor(...args) {
		super();
		return extend(true, this, ...args);
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
		return _.defined(this[property]) ? this[property] : _.bind(func, target, this);
	}

	/**
	*	Proxy getPrototypeOf trap override
	*	@public
	*	@param {Any} target - target reference
	*	@return {Object}
	**/
	getPrototypeOf(target) {
		return this.constructor.prototype;
	}

	/**
	*	Proxy ownKeys trap override
	*	@public
	*	@param {Any} target - visited proxy target
	*	@return {Array}
	**/
	ownKeys(target) {
		return _.keys(this);
	}

	/**
	*	Proxy get trap override
	*	@public
	*	@param {Any} target - visited target reference
	*	@param {String} property - visited target property
	*	@param {Any} receiver - visited target constructor
	*	@return {Any}
	**/
	get(target, property, receiver) {
		let value = _.defined(this[property]) ? this[property] : target[property];
		return _.isFunction(value) ? this._context(target, property, value) : value;
	}

	/**
	*	Returns true if a given visitor is defined and an instance of commands.util.visitor.Visitor, false otherwise
	*	@public
	*	@param {commands.util.visitor.Visitor} visitor - visitor to validate
	*	@return {Boolean}
	**/
	validate(visitor) {
		return _.defined(visitor) && _.instanceOf(visitor, Visitor);
	}

	/**
	*	Default strategy that accepts visitor by this visited instance
	*	@public
	*	@param {commands.util.visitor.Visitor} vi - visitor to accept
	*	@return {commands.util.visitor.Visited}
	**/
	accept(visitor) {
		return this.validate(visitor) ? visitor.visit(this) : this;
	}

	/**
	*	Static Constructor
	*	@static
	*	@param [...args] {Any} constructor arguments
	*	@return {commands.util.visitor.Visited}
	**/
	static new(...args) {
		return new this(...args);
	}

}

export default Visited;

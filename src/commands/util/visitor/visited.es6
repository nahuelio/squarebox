/**
*	@module commands.util.visitor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';
import extend from 'extend';
import Visitor from 'commands/util/visitor/visitor';

/**
*	Class Visited
*	@extends {events.EventEmitter}
**/
class Visited extends  EventEmitter {

	/**
	*	Constructor
	*	@public
	*	@param {Any} [...args] - constructor arguments
	*	@return {commands.util.visitor.Visited}
	**/
	constructor(...args) {
		super();
		return new Proxy(extend(true, this, ...args), this);
	}

	/**
	*	Proxy get trap override
	*	@public
	*	@override
	*	@param {Any} target - visited target reference
	*	@param {String} property - visited target property
	*	@param {Any} receiver - visited target constructor
	*	@return {Any}
	**/
	get(target, property, receiver) {
		return _.defined(target[property]) ? target[property] : this[property];
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

/**
*	@module util.visitor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';
import extend from 'extend';
import Visitor from 'util/visitor/visitor';
import InterfaceException from 'util/exception/proxy/interface';

/**
*	Class Visited
*	@extends {events.EventEmitter}
**/
class Visited extends EventEmitter {

	/**
	*	Constructor
	*	@public
	*	@param {Any} [...args] - constructor arguments
	*	@return {util.visitor.Visited}
	**/
	constructor(...args) {
		super();
		return extend(true, this, ...args);
	}

	/**
	*	Returns true if a given visitor is defined and an instance of util.visitor.Visitor, false otherwise
	*	@public
	*	@param {util.visitor.Visitor} visitor - visitor to validate
	*	@return {Boolean}
	**/
	validate(visitor) {
		return _.defined(visitor) && _.instanceOf(visitor, Visitor);
	}

	/**
	*	Default strategy that accepts visitor by this visited instance
	*	@public
	*	@param {util.visitor.Visitor} vi - visitor to accept
	*	@return {util.visitor.Visited}
	**/
	accept(visitor) {
		return this.validate(visitor) ? visitor.visit(this) : this;
	}

	/**
	*	Static Constructor
	*	@static
	*	@param {Any} [...args] - constructor arguments
	*	@return {util.visitor.Visited}
	**/
	static new(...args) {
		return new this(...args);
	}

}

export default Visited;

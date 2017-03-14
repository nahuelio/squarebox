/**
*	@module util.visitor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';
import extend from 'extend';
import Visited from 'util/visitor/visited';
import InterfaceException from 'util/exception/proxy/interface';

/**
*	Class Visitor
*	@extends {events.EventEmitter}
**/
class Visitor extends EventEmitter {

	/**
	*	Constructor
	*	@public
	*	@param {Any} [...args] - constructor arguments
	*	@return {util.visitor.Visitor}
	**/
	constructor(...args) {
		super();
		return extend(true, this, ...args);
	}

	/**
	*	Returns true if the visited instance implements Visited interface.
	*	Otherwise, this method will raise an InterfaceException.
	*	@public
	*	@throws {util.exception.proxy.InterfaceException}
	*	@param {util.visitor.Visited} vi - visited instance
	*	@return {Boolean}
	**/
	validate(vi) {
		if(!_.defined(vi)) return false;
		if(!_.defined(vi.accept))
			throw InterfaceException.new('interface', { name: 'util.visitor.Visited' });
		return true;
	}

	/**
	*	Default Visit Strategy will return the visited object verbatim.
	*	This method is likely to be overriden by subsclasses of this visitor when needed.
	*	@public
	*	@param {util.visitor.Visited} vi - instance to be visited by this visitor
	*	@param {Any} [...args] - arguments passed to the vistior who visit the current visited instance
	*	@return {util.visitor.Visited}
	**/
	visit(vi, ...args) {
		return this.validate(vi) ? new Proxy(this, vi) : null;
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'Visitor';
	}

	/**
	*	Static Constructor
	*	@static
	*	@param {Any} [...args] - constructor arguments
	*	@return {util.visitor.Visitor}
	**/
	static new(...args) {
		return new this(...args);
	}

}

export default Visitor;

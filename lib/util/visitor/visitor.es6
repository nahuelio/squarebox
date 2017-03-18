/**
*	@module util.visitor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';
import _s from 'underscore.string';
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
	*	Filter private methods declared on this visitor
	*	@public
	*	@return {Array}
	**/
	_methods() {
		const { prototype } = this.constructor;
		return _.filter(_.methods(prototype).concat(_.methods(this)), (func) => {
			return !_s.startsWith(func, '_') && !_.contains(Visitor._methods, func);
		});
	}

	/**
	*	Decorates visited instance with methods declared on this visitor
	*	@private
	*	@param {util.visitor.Visited} vi - instance to be visited by this visitor
	*	@param {Any} [...args] - arguments passed to the visitor who visit the current visited instance
	*	@return {util.visitor.Visited}
	**/
	_decorate(vi, ...args) {
		return _.reduce(this._methods(), (memo, method) => {
			if(!_.defined(memo[method])) memo[method] = _.bind(this[method], this, vi, ...args);
			return memo;
		}, vi);
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
	*	@param {Any} [...args] - arguments passed to the visitor who visit the current visited instance
	*	@return {util.visitor.Visited}
	**/
	visit(vi, ...args) {
		return this.validate(vi) ? this._decorate(vi, ...args) : null;
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
	*	Visitor Methods to filter out of the proxifing visit strategy
	*	@static
	*	@type {Array}
	**/
	static _methods = [
		'visit',
		'validate',
		'name',
		'constructor'
	].concat(_.functions(EventEmitter.prototype));

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

/**
*	@module util.visitor
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';
import extend from 'extend';
import Visitor from 'util/visitor/visitor';
import Factory from 'util/factory/factory';
import Collection from 'util/adt/collection';
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
	*	Default all visitors registration
	*	@public
	*	@param {String} dirname - factory base directory name
	*	@return {util.visitor.Visited}
	**/
	registerAll(dirname) {
		if(_.defined(dirname)) Factory.basePath(dirname);
		return this.constructor.visitors.reduce(this.register, this, this);
	}

	/**
	*	Default single visitor registration
	*	@public
	*	@param {util.visitor.Visited} memo memoized reference of the instance of this class
	*	@param {String} path visitor path to register and load.
	*	@return {util.visitor.Visited}
	**/
	register(memo, path) {
		return memo.accept(Factory.register(path).get(path, this));
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
	*	Default list of visitors
	*	@static
	*	@property visitors
	*	@type {util.adt.Collection}
	**/
	static visitors = Collection.new([
		'visitors/formatter/json'
	]);

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

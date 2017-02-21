/**
*	@module commands.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';

/**
*	Class Collection
*	@extends events.EventEmitter
**/
export default class Collection extends EventEmitter {

	/**
	*	Internal Array
	*	@private
	*	@type {Array}
	**/
	_collection: [],

	/**
	*	Constructor
	*	@public
	*	@param [initial = []] {Array} Initial Array
	*	@param [opts = {}] {Object} collection options
	*	@return commands.util.adt.Collection
	**/
	constructor(initial = [], opts = {}) {
		super();
		return this;
	}

	/**
	*	Underscore aggregation
	*	@static
	*	@return {commands.util.adt.Collection}
	**/
	static _aggregate() {
		return this;
	}

	/**
	*	Static constructor
	*	@static
	*	@param [...args] {Any} Constructor arguments
	*	@return {commands.}
	**/
	static new(...args) {

	}

}

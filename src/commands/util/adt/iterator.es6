/**
*	@module commands.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';

/**
*	Class Iterator
*	@extends events.EventEmitter
**/
class Iterator extends EventEmitter {

	/**
	*	Internal collection
	*	@public
	*	@type {Array}
	**/
	_collection = []

	/**
	*	Internal pointer
	*	@public
	*	@type {Number}
	**/
	_pointer = 0

	/**
	*	Constructor
	*	@public
	*	@param [initial = []] {Array} initial elements in the collection
	*	@return {commands.util.adt.Iterator}
	**/
	constructor(initial = []) {
		super();
		if(this._valid(initial)) this.set(initial);
		return this;
	}

	/**
	*	Returns true if the given element is not null or undefined and if it is an array, false otherwise
 	*	@public
 	*	@param element {Any} element to evaluate
 	*	@return {Boolean}
	**/
	_valid(element) {
		if(!_.defined(element) || !_.isArray(element)) return false;
		return true;
	}

	/**
	*	Set elements
	*	@public
	*	@param [col = []] {Array} elements to set to this iterator
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.Iterator}
	**/
	set(col = [], opts = {}) {
		if(!this._valid(col) || col.length === 0) return this;
		this._collection = col.slice(0);
		return !opts.silent ? this.emit(Iterator.events.set, this) : this;
	}

	/**
	*	Returns true if there is still an element in the list at the current cursor position, false otherwise
	*	@public
	*	@return {Boolean}
	**/
	hasNext() {
		return (this._pointer <= (this._collection.length - 1));
	}

	/**
	*	Returns the current element in the collection and move the cursor position 1 step forward
	*	@public
	*	@return {Any}
	**/
	next() {
		return (this._pointer <= this._collection.length - 1) ? this._collection[this._pointer++] : null;
	}

	/**
	*	Reset the cursor to the beginning to the index 0
	*	@public
	*	@return {commands.util.adt.Iterator}
	**/
	rewind() {
		this._pointer = 0;
		return this;
	}

	/**
	*	Removes from the underlying collection the last element returned by this iterator
	*	@public
	*	@fires {Iterator.events.remove}
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.Iterator}
	**/
	remove(opts = {}) {
		if(this._collection.length === 0) return this;
		let e = this._collection.splice(this._pointer, 1)[0];
		return !opts.silent ? this.emit(Iterator.events.remove, this, e) : this;
	}

	/**
	*	Iterator Events
	*	@static
	*	@type events
	**/
	static events = {
		/**
		*	@event set
		**/
		set: 'commands:util:adt:iterator:set',

		/**
		*	@event remove
		**/
		remove: 'commands:util:adt:iterator:remove'
	}

	/**
	*	Static Constructor
	*	@static
	*	@param [...args] {Any} constructor arguments
	*	@return {commands.util.adt.Iterator}
	**/
	static new(...args) {
		return new this(...args);
	}

}

export default Iterator;

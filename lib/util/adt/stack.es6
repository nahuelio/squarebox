/**
*	@module util.adt.Stack
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
'use strict';

import _ from 'underscore';
import extend from 'extend';
import Collection from 'util/adt/collection';

/**
*	Class Stack
*		Defines the interface of a Stack LIFO (LastIn-FirstOut)
*	@example
*		<h5>Usage</h5>
*
*		let mystack = new Stack([1,2,3]); // set initial elements
*			mystack.push(4); // Adds one more element into the stack
*			mystack.peek(); // Outputs 1 without removing the element
*
*		let mystack = new Stack([{ name: 'one' }, { name: 'two' }], { interface: MyClass });
*			mystack.push({ name: 3 }); // Adds one more element into the stack
*			mystack.pop(); // Outputs { name: 3 } of MyClass, removing the element
*	@extends util.adt.Collection
**/
class Stack extends Collection {

	/**
	*	Constructor
	*	@public
	*	@param [initial = []] {Array} initial collection of elements on this stack
	*	@param [opts = {}] {Object} additional options
	*	@return {util.adt.Stack}
	**/
	constructor(initial = [], opts = {}) {
		super(initial, opts);
		return this;
	}

	/**
	*	Inserts a given element into this stack
	*	@public
	*	@param element {Any} element to be inserted
	*	@param [opts = {}] {Object} additional options
	*	@return {Boolean}
	**/
	push(element, opts = {}) {
		if(!this._valid(element)) return false;
		this._fire(Stack.events.push, opts, this.add(element, extend(true, {}, opts, { silent: true })));
		return true;
	}

	/**
	*	Retrieves, but does not remove, the head of this stack, or returns null if this stack is empty
	*	@public
	*	@return {Object}
	**/
	peek() {
		return (this.size() > 0) ? this._collection[0] : null;
	}

	/**
	*	Retrieves and removes the head of this stack, or returns null if this stack is empty
	*	@public
	*	@param [opts = {}] {Object} additional options
	*	@return {Any}
	**/
	pop(opts = {}) {
		if(this.size() <= 0) return null;
		let popped = this.remove(this.get(this.size() - 1), { silent: true });
		this._fire(Stack.events.pop, opts, popped);
		return popped;
	}

	/**
	*   Returns the 1-based position where an object is on this stack
	*	@public
	*	@param element {Any} element to get 1-based position
	*	@return Number
	**/
	search(element) {
		if(!this._valid(element)) return -1;
		return this.findIndex((e) => _.isEqual(this._toJSON(e), this._toJSON(element)));
	}

	/**
	*	Stack Events
	*	@static
	*	@type {Object}
	**/
	static events = extend(false, {}, Collection.events, {
		/**
		*	@event push
		**/
		push: 'util:adt:stack:push',

		/**
		*	@event pop
		**/
		pop: 'util:adt:stack:pop'
	});

}

export default Stack;
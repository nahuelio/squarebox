/**
*	@module commands.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Stack from 'commands/util/adt/stack';
import Asynchronous from 'commands/visitors/async/async';

/**
*	Class StackAsync
*		Defines the interface of a Stack LIFO (LastIn-FirstOut)
*		Interface for objects on this stack, must implement method `next` of {@link commands.util.proxy.Asynchronous}
*		for promise resolution.
*	@example
*		<h5>Usage</h5>
*
*		let mystack = StackAsync.new([1,2,3], { interface: [Class] })
*			.on(StackAsync.events.next, (element) => console.log('Next: ', element))
*			.on(StackAsync.events.end, (results) => console.log('End: ', results))
*		const mypromise = mystack.pop(); // asynchronous
*	@extends commands.util.adt.Stack
**/
class StackAsync extends Stack {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param [initial = []] {Array} Initial Array
	*	@param [opts = {}] {Object} collection options
	*	@return {commands.util.adt.StackAsync}
	**/
	constructor(initial = [], opts = {}) {
		return super(initial, extend(true, opts, { _visitor: Asynchronous.new(), _last: [] }));
	}

	/**
	*	Default instanciation strategy for new elements added in this collection
	*	@private
	*	@override
	*	@param e {Any} element to instanciate
	*	@param opts {Object} additional options
	*	@return {Any}
	**/
	_new(e, opts) {
		let element = super._new(e, opts);
		this._visitor.validate(element);
		return element.accept(this._visitor);
	}

	/**
	*	Resets Last Results
	*	@public
	*	@return {commands.util.adt.StackAsync}
	**/
	_resetLast() {
		this._last = [];
		return this;
	}

	/**
	*	Retrieves and removes the head of this stack, or returns null if this stack is empty
	*	@public
	*	@async
	*	@override
	*	@param [opts = {}] {Object} additional options
	*	@return {Promise}
	**/
	async pop(opts = {}) {
		const res = await this.next(opts);
		return this.onNext(res, opts);
	}

	/**
	*	Asynchronous Queue next
	*	@public
	*	@emits {StackAsync.events.next} - when opts.silent = false or undefined
	*	@param [opts] {Object} additional options
	*	@return {Promise}
	**/
	next(opts) {
		let element = super.pop(opts);
		if(!opts.silent) this.emit(StackAsync.events.next, element);
		return element.execute(this);
	}

	/**
	*	Retrieves and removes the head of this queue, or returns null if this queue is empty
	*	@public
	*	@param res {Promise} promise reference with resolution (resolved or rejected)
	*	@param [opts] {Object} additional options
	*	@return {Promise}
	**/
	onNext(res, opts) {
		this._last.push(res);
		return this.isEmpty() ? this.end(opts) : this.pop(opts);
	}

	/**
	*	Asynchronous Queue end
	*	@public
	*	@emits {StackAsync.events.end} - when opts.silent is false or undefined
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.StackAsync}
	**/
	end(opts) {
		if(!opts.silent) this.emit(StackAsync.events.end, this._last);
		return this._resetLast();
	}

	/**
	*	Queue Events
	*	@static
	*	@type {Object}
	**/
	static events = extend(false, {}, Stack.events, {

		/**
		*	@event next
		**/
		next: 'commands:util:adt:stack-async:next',

		/**
		*	@event end
		**/
		end: 'commands:util:adt:stack-async:end'

	});

}

export default StackAsync;

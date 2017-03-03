/**
*	@module commands.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Collection from 'commands/util/adt/collection';
import QueueException from 'commands/util/exception/adt/queue';

/**
*	Class Queue
*		Defines the interface of a FIFO Queue (FirstIn-FirstOut)
*	@example
*		<h5>Usage</h5>
*
*		let myqueue = new Queue([1,2,3], { capacity: 4 }); // initial is set to capacity was set to 4
*			myqueue.offer(4); // Adds one more element without violating capacity (3)
*			myqueue.peek();
*
*		let myqueue = new Queue([{ name: 'one' }, { name: 'two' }], { capacity: 3, interface: MyClass });
*			myqueue.offer({ name: 3 }); // Adds one more element without violating capacity (3)
*			myqueue.poll();
*	@extends commands.util.adt.Collection
**/
export default class Queue extends Collection {

	/**
	*	Constructor
	*	@public
	*	@param [initial = []] {Array} Initial Array
	*	@param [opts = {}] {Object} collection options
	*	@return {commands.util.adt.Collection}
	**/
	constructor(initial = [], opts = {}) {
		const { capacity } = opts;
		return super(initial, extend(true, opts, _.defined(capacity) ? { capacity } : { capacity: 0 }));
	}

	/**
	*	Validates element or array of elements to decide either, to add or not the elements on this queue
	*	@private
	*	@override
	*	@throws {commands.util.exceptions.QueueException}
	*	@param element {Any} element to validate
	*	@return {Boolean}
	**/
	_valid(element) {
		const { capacity } = this;
		if(_.isArray(element) && (element.length > capacity))
			throw QueueException.new('capacityViolation', { level: QueueException.fatal, capacity });
		return super._valid(element);
	}

	/**
	*	Returns true if the current size has reached the capacity of the queye, false otherwise
 	*	@private
	*	@return {Boolean}
	**/
	_validCapacity() {
		return (this.size() < this.capacity);
	}

	/**
	*	Set initial collection of elements on this queue
	*	@public
	*	@override
	*	@param [col = []] {Array} collection of elements
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.Queue}
	**/
	set(col = [], opts = {}) {
		if(!this._validCapacity() || !this._valid(col) || !_.isArray(col) || col.length === 0) return this;
		return super.set(col, opts);
	}

	/**
	*	Inserts the specified element into this queue if it is possible to do so immediately without violating
	*	capacity restrictions
	*	@public
	*	@fires {Queue.events.offer}
	*	@param element {Any} element to insert
	*	@param [opts = {}] {Object} additional element
	*	@return {Boolean}
	**/
	offer(element, opts = {}) {
		if(!this._validCapacity() || !this._valid(element)) return false;
		this._fire(Queue.events.offer, opts, this.add(element, extend(true, {}, opts, { silent: true })));
		return true;
	}

	/**
	*	Retrieves, but does not remove, the head of this queue, or returns null if this queue is empty
	*	@public
	*	@return {Object}
	**/
	peek() {
		return (this.size() > 0) ? this._collection[0] : null;
	}

	/**
	*	Retrieves and removes the head of this queue, or returns null if this queue is empty
	*	@public
	*	@param [opts = {}] {Object} additional options
	*	@return {Object}
	**/
	poll(opts = {}) {
		if(this.size() > 0) {
			let polled = this.remove(this.get(0), { silent: true });
			this._fire(Queue.events.poll, opts, polled);
			return polled;
		}
		return null;
	}

	/**
	*	Queue Events
	*	@static
	*	@type {Object}
	**/
	static events = extend(false, {}, Collection.events, {
		/**
		*	@event offer
		**/
		offer: 'commands:util:adt:queue:offer',

		/**
		*	@event poll
		**/
		poll: 'commands:util:adt:queue:poll'
	});

}

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
*			myqueue.poll();
*
*		let myqueue = new Queue([{ name: 'one' }, { name: 'two' }], { capacity: 3, interface: MyClass });
*			myqueue.offer({ name: 3 }); // Adds one more element without violating capacity (3)
*			myqueue.poll();
*	@extends commands.util.adt.Collection
**/
export default class Queue extends Collection {

	/**
	*	Queue capacity
	*	@public
	*	@type {Number}
	**/
	capacity = 0

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param [intial = []] {Array} initial collection of elements
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.Queue}
	**/
	constructor(initial = [], opts = {}) {
		super(initial, opts);
		return extend(true, this, { capacity: opts.capacity });
	}

	/**
	*	Validates capacity of the queue to either decide, to add or not the element on this queue
	*	@TODO: Keep an eye on the order of validations while unit testing...
	*	@private
	*	@override
	*	@throws {commands.util.exceptions.QueueException}
	*	@param element {Any} element to validate
	*	@param opts {Object} additional options
	*	@return {Boolean}
	**/
	_valid(element, opts) {
		if(this.size() >= this.capacity) return false;
		if(!_.defined(opts.capacity))
			throw QueueException.new({ type: 'capacityUndefined', level: QueueException.fatal });
		if(_.isArray(element) && element.length > this.capacity)
			throw QueueException.new({ type: 'capacityViolation', level: QueueException.fatal },
				{ capacity: this.capacity });
		return super._valid(element);
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
		if(!this._valid(col, opts)) return this;
		this.capacity = opts.capacity;
		return super.set(col);
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
		if(!this._valid(element, opts)) return false;
		this.add(element, extend(true, opts, { silent true }))
			._fire(Queue.events.offer, this, element);
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
	*	@return {Object}
	**/
	poll() {
		return (this.size() > 0) ? this.remove(0, { silent: true })._fire(Queue.events.poll) : null;
	}

	/**
	*	Queue Events
	*	@static
	*	@type {Object}
	**/
	static events = extend(false, Collection.events, {
		/**
		*	@event offer
		**/
		offer: 'commands:util:adt:queue:offer',

		/**
		*	@event poll
		**/
		poll: 'commands:util:adt:queue:poll'
	})

	/**
	*	Static constructor
	*	@static
	*	@param [...args] {Any} Constructor arguments
	*	@return {commands.util.adt.Queue}
	**/
	static new(...args) {
		return new this(...args);
	}

}

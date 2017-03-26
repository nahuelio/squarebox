/**
*	@module util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Queue from 'util/adt/queue';
import Asynchronous from 'visitors/async/async';

/**
*	Class QueueAsync
*		Defines the interface of an asynchronous FIFO Queue (FirstIn-FirstOut).
*		Interface for objects on this queue, **must** implement method `next` of
*		{@link visitors.async.Asynchronous} for promise resolution.
*	@example
*		<h5>Usage</h5>
*
*		let myqueue = QueueAsync.new([1,2,3], { capacity: 3, interface: [Class] })
*			.on(QueueAsync.events.next, (element) => console.log('Next: ', element))
*			.on(QueueAsync.events.end, (results) => console.log('End: ', results))
*		const mypromise = p.poll(); // asynchronous
*	@extends util.adt.Queue
**/
class QueueAsync extends Queue {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param {Array} [initial = []] - initial elements
	*	@param {Object} [opts = {}] - collection options
	*	@return {util.adt.QueueAsync}
	**/
	constructor(initial = [], opts = {}) {
		return super(initial, extend(true, opts, { _visitor: Asynchronous.new(), _last: [] }));
	}

	/**
	*	Default instanciation strategy for new elements added in this collection
	*	@private
	*	@override
	*	@param {Any} e - element to instanciate
	*	@param {Object} opts - additional options
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
	*	@return {util.adt.QueueAsync}
	**/
	_resetLast() {
		this._last = [];
		return this;
	}

	/**
	*	Retrieves and removes the head of this queue, or returns null if this queue is empty
	*	@public
	*	@async
	*	@override
	*	@param {Object} [opts = {}] - additional options
	*	@param {Boolean} [next = false] - async queue already started
	*	@return {Promise}
	**/
	async poll(opts = {}, next = false) {
		if(!next) this._resetLast();
		const res = await this.next(opts);
		return this.onNext(res, opts);
	}

	/**
	*	Asynchronous Queue next
	*	@public
	*	@emits {QueueAsync.events.next} - when opts.silent is false or undefined
	*	@param {Object} [opts] - additional options
	*	@return {Promise}
	**/
	next(opts) {
		let element = super.poll(opts);
		if(!opts.silent) this.emit(QueueAsync.events.next, element);
		return element.execute(this);
	}

	/**
	*	Retrieves and removes the head of this queue, or returns null if this queue is empty
	*	@public
	*	@param {Promise} res - current promise (resolved or rejected)
	*	@param {Object} [opts] - additional options
	*	@return {Any}
	**/
	onNext(res, opts) {
		this._last.push(res);
		return this.isEmpty() ? this.end(opts) : this.poll(opts, true);
	}

	/**
	*	Asynchronous Queue end will return last results.
	*	@public
	*	@emits {QueueAsync.events.end} - when opts.silent is false or undefined
	*	@param {Object} [opts = {}] - additional options
	*	@return {Array}
	**/
	end(opts) {
		if(!opts.silent) this.emit(QueueAsync.events.end, this._last);
		return this._last;
	}

	/**
	*	Queue Events
	*	@static
	*	@type {Object}
	**/
	static events = extend(false, {}, Queue.events, {

		/**
		*	@event next
		**/
		next: 'util:adt:queue-async:next',

		/**
		*	@event end
		**/
		end: 'util:adt:queue-async:end'

	});

}

export default QueueAsync;

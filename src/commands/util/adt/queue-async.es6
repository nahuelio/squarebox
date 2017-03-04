/**
*	@module commands.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Queue from 'commands/util/adt/queue';
import Asynchronous from 'commands/util/proxy/async';

/**
*	Class QueueAsync
*		Defines the interface of an asynchronous FIFO Queue (FirstIn-FirstOut).
*		Interface for objects on this queue, must implement method `next` of {@link commands.util.proxy.Asynchronous}
*		for promise resolution.
*	@example
*		<h5>Usage</h5>
*
*		let myqueue = QueueAsync.new([1,2,3], { capacity: 3, interface: [Class] })
*			.on(QueueAsync.events.next, (element) => console.log('Next: ', element))
*			.on(QueueAsync.events.end, (results) => console.log('End: ', results))
*		const mypromise = p.poll(); // asynchronous
*	@extends commands.util.adt.Queue
**/
class QueueAsync extends Queue {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param [initial = []] {Array} Initial Array
	*	@param [opts = {}] {Object} collection options
	*	@return {commands.util.adt.QueueAsync}
	**/
	constructor(initial = [], opts = {}) {
		super(initial, opts);
		return extend(true, this, { _last: [] });
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
		return Asynchronous.proxy(super._new(e, opts), this);
	}

	/**
	*	Resets Last Results
	*	@public
	*	@return {commands.util.adt.QueueAsync}
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
	*	@param [opts = {}] {Object} additional options
	*	@return {Promise}
	**/
	async poll(opts = {}) {
		const res = await this.next(opts);
		return this.onNext(res, opts);
	}

	/**
	*	Asynchronous Queue next
	*	@public
	*	@emits {QueueAsync.events.next} - when opts.silent is false or undefined
	*	@param [opts = {}] {Object} additional options
	*	@return {Promise}
	**/
	next(opts) {
		let element = super.poll(opts);
		if(!opts.silent) this.emit(QueueAsync.events.next, element);
		return element.do(this);
	}

	/**
	*	Retrieves and removes the head of this queue, or returns null if this queue is empty
	*	@public
	*	@param res {Promise} current promise (resolved or rejected)
	*	@param [opts = {}] {Object} additional options
	*	@return {Any}
	**/
	onNext(res, opts) {
		this._last.push(res);
		return this.isEmpty() ? this.end(opts) : this.poll(opts);
	}

	/**
	*	Asynchronous Queue end
	*	@public
	*	@emits {QueueAsync.events.end} - when opts.silent is false or undefined
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.QueueAsync}
	**/
	end(opts) {
		if(!opts.silent) this.emit(QueueAsync.events.end, this._last);
		return this._resetLast();
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
		next: 'commands:util:adt:queue-async:next',

		/**
		*	@event end
		**/
		end: 'commands:util:adt:queue-async:end'

	});

}

export default QueueAsync;

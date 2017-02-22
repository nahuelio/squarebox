/**
*	@module commands.util.adt
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import _ from 'underscore';
import extend from 'extend';
import Iterator from './iterator';

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
	_collection = []

	/**
	*	Interface for objects
	*	@private
	*	@type {Function}
	**/
	_interface = null

	/**
	*	Constructor
	*	@public
	*	@param [initial = []] {Array} Initial Array
	*	@param [opts = {}] {Object} collection options
	*	@return {commands.util.adt.Collection}
	**/
	constructor(initial = [], opts = {}) {
		super();
		Collection._aggregate(extend(true, this, { _interface: opts.interface }))
		return this.set(initial);
	}

	/**
	*	Default Element Validation
	*	@private
	*	@param [element] {Any} element to validate
	*	@return {Boolean}
	**/
	_valid(element) {
		if(!_.defined(element)) return false;
		return true;
	}

	/**
	*	Fires event to this collection
	*	@private
	*	@param name {String} event name
	*	@param opts {Object} additional options
	*	@return {commands.util.adt.Collection}
	**/
	_fire(name, opts) {
		return !opts.silent ? this.emit(name, this) : this;
	}

	/**
	*	Resolves and executes either `withInterface` handler or `withoutInterface`, if this collection
	*	defines or not an interface for the type of objects this collection can contain.
	*	@private
	*	@param w {Function} withInterface handler
	*	@param wo {Function} withoutInterface Handler
	*	@return {Any}
	**/
	_when(w, wo) {
		return this.hasInterface() ? w() : wo();
	}

	/**
	*	Default instanciation strategy for new elements added in this collection
	*	@private
	*	@param e {Any} element to instanciate
	*	@param [opts = {}] {Object} additional options
	*	@return {Any}
	**/
	_new(e, opts = {}) {
		if(!this._valid(e)) return null;
		return this._when(() => _.defined(opts.new) ? opts.new(e) : new this._interface(e), () => e);
	}

	/**
	*	Resets and Sets a new collection of elements
	*	@public
	*	@fires {Collection.events.set}
	*	@param [col = []] {Array} collection of new elements
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.Collection}
	**/
	set(col = [], opts = {}) {
		if(!this._valid(col) || !_.isArray(col)) return this;
		this.reset({ silent: true });
		_.each(col, (e) => this.add(e, extend(true, opts, { silent: true })));
		return this._fire(Collection.events.set, opts);
	}

	/**
	*	Adds a new element
	*	@public
	*	@fires {Collection.events.add}
	*	@param element {Object|Any} new element to add
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.Collection}
	**/
	add(element, opts = {}) {
		this._collection.push(this._new(element, opts));
		return this._fire(Collection.events.add, opts);
	}

	/**
	*	Add a collection of elements at the tail of this collection
	*	@public
	*	@fires {Collection.events.addall}
	*	@param [col = []] {Array} collection of new elements to add
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.Collection}
	**/
	addAll(col = [], opts = {}) {
		_.each(col, (e) => this.add(e, extend(true, opts, { silent: true })));
		return this._fire(Collection.events.addall, opts);
	}

	/**
	*	Retrieves the element at the given index
	*	@public
	*	@param [ix = 0] {Number} index
	*	@return {Any}
	**/
	get(ix = 0) {
		return this._collection[ix];
	}

	/**
	*	Returns true if the a given element existis in this collection, false otherwise
	*	@public
	*	@param element {Any} element to evaluate
	*	@return {Boolean}
	**/
	contains(element) {
		if(!this._valid(element)) return false;
		return this.some((e) => _.isEqual(e, element));
	}

	/**
	*	Returns true if all the elements of a given list exists in this collection, false otherwise.
	*	@public
	*	@param [elements = []] {Array} list of elements to evaluate
	*	@return {Boolean}
	**/
	containsAll(elements = []) {
		if(!this._valid(elements)) return false;
		return _.every(_.map(elements, this.contains, this));
	}

	/**
	*	Returns true if any element in this collection, have at least one property specified in the condition
	*	passed as parameter, where the condition is an object.
	*	@public
	*	@param [condition = {}] {Object} condition object used to evaluate
	*	@return {Boolean}
	**/
	containsWhere(condition = {}) {
		return _.defined(this.findWhere(condition));
	}

	/**
	*	Removes an element at the given index. If no index is passed, this method will remove the last element in
	*	this collection.
	*	@public
	*	@fires {Collection.events.remove}
	*	@param [ix = (this._collection.size() - 1)] {Number} index used to remove
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.Collection}
	**/
	remove(ix = (this._collection.size() - 1), opts = {}) {
		if(!this._valid(ix) || !_.isNumber(ix) || ix > (this.size() - 1)) return this;
		this._collection.splice(ix, 1);
		return this._fire(Collection.events.remove, opts);
	}

	/**
	*	Removes all the elements in this collection
	*	@public
	*	@fires {Collection.events.removeall}
	*	@param [col = []] {Array} collection of elements to remove
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.Collection}
	**/
	removeAll(col = [], opts = {}) {
		// TODO
		return this._fire(Collection.events.removeall, opts);
	}

	/**
	*	Removes elements by a given predicate
	*	@public
	*	@param predicate {Function} predicate used to evaluate
	*	@return {commands.util.adt.Collection}
	**/
	removeBy() {
		// TODO
		return this;
	}

	/**
	*	Sorts this collection by a given comparator.
	*	If comparator is omitted, not sort will ocurr.
	*	@public
	*	@fires {Collection.events.sort}
	*	@param [opts = {}] {Object} additional options
	*	@param comparator {Function} comparator reference
	*	@return {commands.util.adt.Collection}
	**/
	sort(comparator, opts = {}) {
		// TODO
		return this._fire(Collection.events.sort, opts);
	}

	/**
	*	Returns a new iterator instance of this collection
	*	@public
	*	@return {commands.util.adt.Iterator}
	**/
	iterator() {
		return Iterator.new(this._collection);
	}

	/**
	*	Resets the collection
	*	@public
	*	@fires {Collection.events.reset}
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.Collection}
	**/
	reset(opts = {}) {
		// TODO
		return this._fire(Collection.events.reset, opts);
	}

	/**
	*	Returns the size of this collection
	*	@public
	*	@return {Number}
	**/
	size() {
		return this._collection.length;
	}

	/**
	*	Returns true if the collection is empty, false otherwise
	*	@public
	*	@return {Boolean}
	**/
	isEmpty() {
		return (this._collection.length === 0);
	}

	/**
	*	Returns true if this collection has an interface defined, false otherwise
	*	@public
	*	@return {Boolean}
	**/
	hasInterface() {
		return _.defined(this._interface);
	}

	/**
	*	Returns a json representation of this collection
	*	@public
	*	@return {Object}
	**/
	toJSON() {
		return this.hasInterface() ? this.invoke('toJSON') : this._collection;
	}

	/**
	*	Collection Events
	*	@static
	*	@type {Object}
	**/
	static events = {
		/**
		*	@event set
		**/
		set: 'commands:util:adt:collection:set',

		/**
		*	@event add
		**/
		add: 'commands:util:adt:collection:add',

		/**
		*	@event addall
		**/
		addall: 'commands:util:adt:collection:addall',

		/**
		*	@event remove
		**/
		remove: 'commands:util:adt:collection:remove',

		/**
		*	@event removeall
		**/
		removeall: 'commands:util:adt:collection:removeall',

		/**
		*	@event reset
		**/
		reset: 'commands:util:adt:collection:reset',

		/**
		*	@event sort
		**/
		sort: 'commands:util:adt:collection:sort'
	}

	/**
	*	Underscore interface methods for aggregation
	*	@static
	*	@type Array
	**/
	static UNDERSCORE = [
		'each',
		'map',
		'findWhere',
		'pluck',
		'reduce',
		'reduceRight',
		'find',
		'findIndex',
		'findLastIndex',
		'filter',
		'reject',
		'every',
		'some',
		'invoke',
		'max',
		'min',
		'sortBy',
		'groupBy',
		'shuffle',
		'toArray',
		'first',
		'initial',
		'rest',
		'last',
		'without',
		'indexOf',
		'lastIndexOf',
		'chain',
		'difference',
		'sample',
		'partition',
		'countBy',
		'indexBy'
	]

	/**
	*	Underscore aggregation
	*	@static
	*	@param instance {commands.util.adt.Collection}
	*	@return {commands.util.adt.Collection}
	**/
	static _aggregate(instance) {
		_.each(this.UNDERSCORE, function(method) {
			if(_[method] && !_.defined(instance[method])) {
				instance[method] = _.bind(function() {
					return _[method].apply(this, [this._collection].concat(_.toArray(arguments)));
				}, instance);
			}
		}, this);
	}

	/**
	*	Static constructor
	*	@static
	*	@param [...args] {Any} Constructor arguments
	*	@return {commands.util.adt.Collection}
	**/
	static new(...args) {
		return new this(...args);
	}

}

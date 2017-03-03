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
class Collection extends EventEmitter {

	/**
	*	Constructor
	*	@public
	*	@param [initial = []] {Array} Initial Array
	*	@param [opts = {}] {Object} collection options
	*	@return {commands.util.adt.Collection}
	**/
	constructor(initial = [], opts = {}) {
		super();
		extend(true, this, _.omit(opts, 'silent', 'interface'), { _collection: [], _interface: opts.interface });
		return (initial.length > 0) ? this.set(initial) : this;
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
	*	@param [opts = {}] {Object} additional options
	*	@param [...args] {Any} additional arguments to pass to the emit
	*	@return {commands.util.adt.Collection}
	**/
	_fire(name, opts, ...args) {
		if(!opts.silent) this.emit(name, this, ...args);
		return this;
	}

	/**
	*	Resolves and executes either `withInterface` handler or `withoutInterface`, if this collection
	*	defines or not an interface for the type of objects this collection can contain.
	*	@private
	*	@param element {Any} element to evaluate
	*	@param w {Function} withInterface handler
	*	@param wo {Function} withoutInterface Handler
	*	@return {Any}
	**/
	_when(e, w, wo) {
		return (this.hasInterface() && !_.instanceOf(e, this._interface)) ? w() : wo();
	}

	/**
	*	Returns a json representation of a given element only if this collection has defined an interface
	*	and the given element implements {commands.util.proxy.Json} interface
	*	@private
	*	@param element {Any} element to get json representation
	*	@return {Any}
	**/
	_toJSON(element) {
		return (this.hasInterface() && element.toJSON) ? element.toJSON() : element;
	}

	/**
	*	Default instanciation strategy for new elements added in this collection
	*	@private
	*	@param e {Any} element to instanciate
	*	@param opts {Object} additional options
	*	@return {Any}
	**/
	_new(e, opts) {
		return this._when(e, () => _.defined(opts.new) ? opts.new(e) : new this._interface(e), () => e);
	}

	/**
	*	Resets and Sets a new collection of elements
	*	@public
	*	@fires {Collection.events.set}
	*	@param col {Array} collection of new elements
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.Collection}
	**/
	set(col, opts = {}) {
		if(!this._valid(col) || !_.isArray(col)) return this;
		this.reset({ silent: true });
		let set = _.map(col, (e) => this.add(e, extend(true, {}, opts, { silent: true })));
		return this._fire(Collection.events.set, opts, set);
	}

	/**
	*	Adds a new element
	*	@public
	*	@fires {Collection.events.add}
	*	@param element {Any} element to add
	*	@param [opts = {}] {Object} additional options
	*	@return {Any}
	**/
	add(element, opts = {}) {
		if(!this._valid(element)) return null;
		let added = this._new(element, opts);
		this._collection.push(added);
		this._fire(Collection.events.add, opts, added);
		return added;
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
		if(!_.isArray(col) || col.length === 0) return this;
		let added = _.map(col, (e) => this.add(e, extend(true, {}, opts, { silent: true })));
		return this._fire(Collection.events.addall, opts, added);
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
		return this.some((e) => _.isEqual(this._toJSON(e), element));
	}

	/**
	*	Returns true if all the elements of a given list exists in this collection, false otherwise.
	*	@public
	*	@param [elements = []] {Array} list of elements to evaluate
	*	@return {Boolean}
	**/
	containsAll(elements = []) {
		if(!this._valid(elements) || elements.length === 0) return false;
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
	*	Removes an element at the given index. If no index is passed, this method will remove the first element in
	*	this collection.
	*	@public
	*	@fires {Collection.events.remove}
	*	@param [ix = 0] {Number} index used to remove
	*	@param [opts = {}] {Object} additional options
	*	@return {Number}
	**/
	removeAt(ix = 0, opts = {}) {
		if(!this._valid(ix) || !_.isNumber(ix) || ix > (this.size() - 1)) return null;
		this._fire(Collection.events.remove, opts, this._collection.splice(ix, 1));
		return ix;
	}

	/**
	*	Remove a given element
	*	@public
	*	@fires {Collection.events.remove}
	*	@param element {Any} element to remove
	*	@param [opts = {}] {Object} additional options
	*	@return {Number}
	**/
	remove(element, opts = {}) {
		if(!this._valid(element)) return null;
		let ix = this.findIndex((e) => _.isEqual(this._toJSON(e), this._toJSON(element)));
		if(ix === -1) return null;
		this._fire(Collection.events.remove, opts, this._collection.splice(ix, 1));
		return element;
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
		if(!_.isArray(col) || col.length === 0) return this;
		let removed = _.map(col, (e) => this.remove(e, extend(true, {}, opts, { silent: true })));
		return this._fire(Collection.events.removeall, opts, _.compact(removed));
	}

	/**
	*	Removes elements by a given predicate
	*	@public
	*	@fires {Collection.events.remove}
	*	@param predicate {Function} predicate used to evaluate
	*	@param [opts = {}] {Object} additional options
	*	@return {commands.util.adt.Collection}
	**/
	removeBy(predicate, opts = {}) {
		if(!this._valid(predicate) || !_.isFunction(predicate)) return this;
		for(var i = 0, len = this.size(); i < len; i++) {
			if(predicate(this._collection[i], i, this._collection)) {
				this.removeAt(i, opts); i--; len--;
			}
		}
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
		(!_.defined(comparator) || !_.isFunction(comparator)) ?
			this._collection.sort() :
			this._collection.sort(comparator);
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
		this._collection = [];
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
	};

	/**
	*	Underscore interface methods for aggregation
	*	@static
	*	@return {Array}
	**/
	static UNDERSCORE = () => [
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
	];

	/**
	*	Underscore aggregation
	*	@static
	*	@param instance {commands.util.adt.Collection}
	*	@return {commands.util.adt.Collection}
	**/
	static _aggregate() {
		_.each(this.UNDERSCORE(), function(method) {
			if(!_[method] || _.defined(this.prototype[method])) return;
			this.prototype[method] = function() {
				return _[method].apply(this, [this._collection].concat(_.toArray(arguments)));
			};
		}, this);
		return this;
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

export default Collection._aggregate();

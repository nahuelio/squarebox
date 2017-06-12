/**
*	@module bundle.types
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import _s from 'underscore.string';
import extend from 'extend';
import * as Comments from 'bundle/types/common/comment';
import Collection from 'util/adt/collection';
import Visited from 'util/visitor/visited';
import logger from 'util/logger/logger';

/**
*	Class Type
*	@extends {util.visitor.Visited}
**/
class Type extends Visited {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@return {bundle.types.Type}
	**/
	constructor() {
		return super().registerAll();
	}

	/**
	*	Resolves Task Action
	*	@public
	*	@param {String} task current task name
	*	@param {Any} [...args] list of arguments
	*	@return {Promise}
	**/
	action(task, ...args) {
		return _.defined(this[task]) ? this[task](...args) : this.resolve(this);
	}

	/**
	*	Injects a given task into this type
	*	@public
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@param {bundle.task.Task} task current task reference
	*	@return {bundle.types.Type}
	**/
	inject(resolve, reject, task) {
		return extend(false, this, { resolve, reject, [task.name.toLowerCase()]: task });
	}

	/**
	*	Default Asynchronous next strategy
	*	@public
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@param {bundle.task.Task} task current task reference
	*	@param {Any} [...args] optional additional arguments
	*	@return {Promise}
	**/
	next(resolve, reject, task, ...args) {
		return this.inject(resolve, reject, task).action(task.getName(), ...args);
	}

	/**
	*	Retrieves element type name
	*	@public
	*	@return {String}
	**/
	getName() {
		return _s.strLeft(this.name, 'Visitor').toLowerCase();
	}

	/**
	*	Type Name
	*	@public
	*	@property name
	*	@type {String}
	**/
	get name() {
		return 'Type';
	}

	/**
	*	Default Formats
	*	@static
	*	@property formats
	*	@type {Array}
	**/
	static formats = ['es6', 'cjs', 'amd'];

	/**
	*	List of Visitors
	*	@static
	*	@property visitors
	*	@type {util.adt.Collection}
	**/
	static visitors =  Collection.new(Visited.visitors.toJSON().concat([
		'bundle/types/common/collector',
		'bundle/types/common/comment',
		'bundle/format/es6/es6',
		'bundle/format/cjs/cjs',
		'bundle/format/amd/amd',
		'bundle/format/iife/iife',
		'bundle/format/umd/umd'
	]));

}

export default Type;

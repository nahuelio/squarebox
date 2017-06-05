/**
*	@module bundle.types
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
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
	*	@param {bundle.task.Task} task - current task reference
	*	@return {bundle.types.Type}
	**/
	constructor(task) {
		return super({ task }).registerAll();
	}

	/**
	*	Resolves Task Execution
	*	@public
	*	@param {Function} reject asynchronous promise's reject
	*	@return {bundle.types.Type}
	**/
	resolve(reject) {
		switch(this.task.name) {
			case 'ReaderVisitor': return _.bind(this.read, this);
			case 'WriterVisitor': return _.bind(this.write, this);
			default: return reject;
		}
	}

	/**
	*	Default Asynchronous next strategy
	*	@public
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@param {Any} [...args] list of arguments
	*	@return {Promise}
	**/
	next(resolve, reject, ...args) {
		return this.resolve(reject)(resolve, reject, ...args);
	}

	/**
	*	Default Read strategy
	*	@public
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@param {Any} [...args] list of arguments
	*	@return {Promise}
	**/
	read(resolve, reject, ...args) {
		return resolve(this);
	}

	/**
	*	Default  Write strategy
	*	@public
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@param {Any} [...args] list of arguments
	*	@return {Promise}
	**/
	write(resolve, reject, ...args) {
		return resolve(this);
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

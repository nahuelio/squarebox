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
	*	Generic Strategy that filters and collects comments gathered from source code
	*	@public
	*	@param {Array} [comments = []] collection of comments
	*	@param {Function} [predicate = () => false] predicate used to filter comments
	*	@return {Object}
	**/
	comments(comments = [], predicate = () => false) {
		return Comments.search(comments, predicate);
	}

	/**
	*	Generic Strategy to execute astq queries on a given list of formats.
	*	Will collect and flatten query results into a single list of astq result objects.
	*	By default all the formats will be used with the following order: es6, commonjs and amd.
	*	@public
	*	@param {astq.Node} ast current source ast to detect
	*	@param {Array} [formats = Type.formats] list formats
	*	@param {Any} [...args] additional arguments
	*	@return {Array}
	**/
	collect(ast, formats = Type.formats, ...args) {
		return Collection.new(formats).map((format) => this[format](ast, ...args));
	}

	/**
	*	Generic Strategy to execute astq queries on a given list of formats and type of ast element
	*	Will collect and flatten query results into a single list of astq result objects.
	*	By default all the formats will be used with the following order: es6, commonjs and amd.
	*	@public
	*	@param {astq.Node} ast current source ast to detect
	*	@param {bundle.types.Type} type current element type
	*	@param {Function} [cb] optional callback
	*	@param {Array} [formats = Type.formats] list formats
	*	@param {Any} [...args] additional arguments
	*	@return {Array}
	**/
	collectByType(ast, type, cb, formats = Type.formats, ...args) {
		return this.collect(ast, _.map(formats, (format) => `${format}ByType`), cb, type, ...args);
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
		'bundle/format/es6/es6',
		'bundle/format/cjs/cjs',
		'bundle/format/amd/amd',
		'bundle/format/iife/iife',
		'bundle/format/umd/umd'
	]));

}

export default Type;

/**
*	@module bundle.types
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
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
		return super({ task });
	}

	/**
	*	Asynchronous next strategy
	*	@public
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@param {Array} files list of files parsed
	*	@return {Promise}
	**/
	next(resolve, reject, files) {
		if(_.defined(this.task.read)) return this.read(resolve, reject, files);
		if(_.defined(this.task.write)) return this.write(resolve, reject);
		return resolve(this);
	}

	/**
	*	Default Read strategy
	*	@public
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@param {Array} files list of files parsed
	*	@return {Promise}
	**/
	read(resolve, reject, files) {
		return resolve(this);
	}

	/**
	*	Default  Write strategy
	*	@public
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@return {Promise}
	**/
	write(resolve, reject) {
		return resolve(this);
	}

}

export default Type;

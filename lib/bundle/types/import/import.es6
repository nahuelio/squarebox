/**
*	@module bundle.types.import
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Type from 'bundle/types/type';
import logger from 'util/logger/logger';

/**
*	Class Import
*	@extends {bundle.types.Type}
**/
class Import extends Type {

	/**
	*	Annotation Read strategy
	*	@public
	*	@override
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@param {bundle.task.Task} task current task
	*	@return {Promise}
	**/
	read(resolve, reject) {
		return super.read(resolve, reject);
	}

	/**
	*	Annotation Write strategy
	*	@public
	*	@override
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@param {bundle.task.Task} task current task
	*	@return {Promise}
	**/
	write(resolve, reject) {
		return super.write(resolve, reject);
	}

}

export default Import;

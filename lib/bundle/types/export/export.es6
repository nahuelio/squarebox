/**
*	@module bundle.types.export
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Type from 'bundle/types/type';
import * as Helpers from 'bundle/types/export/helpers';
import Collection from 'util/adt/collection';
import logger from 'util/logger/logger';

/**
*	Class Export
*	@extends {bundle.types.Type}
**/
class Export extends Type {

	/**
	*	Annotation Read strategy
	*	@public
	*	@override
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@param {util.adt.Collection} bundles list of bundles
	*	@param {Array} files list of files
	*	@return {Promise}
	**/
	read(resolve, reject, bundles) {
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

	/**
	*	Type Name
	*	@public
	*	@property name
	*	@type {String}
	**/
	get name() {
		return 'Export';
	}

}

export default Export;

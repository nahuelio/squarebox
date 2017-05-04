/**
*	@module bundle.types.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Type from 'bundle/types/type';
import logger from 'util/logger/logger';

/**
*	Class Annotation
*	@extends {bundle.types.Type}
**/
class Annotation extends Type {

	/**
	*	Annotation Read strategy
	*	@public
	*	@override
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@param {bundle.task.Task} task current task
	*	@return {Promise}
	**/
	read(resolve, reject, task) {
		task.bundles.addAll(this.annotations(task.getFiles()), { new: _.bind(this.create, this) });
		return super.read(resolve, reject);
	}

	/**
	*	Create Bundle Metadata
	*	@public
 	*	@param {Object} bundle annotation information
	*	@return {util.adt.Collection}
	**/
	create(bundle) {
		console.log('Instanciate Metadata: ', bundle);
		return bundle;
	}

	/**
	*	Read all annotations of all files captured
	*	@public
	*	@param {Array} files files parsed by Reader Task
	*	@return {Array}
	**/
	annotations(files) {
		return _.reduce(files, this.annotation, [], this);
	}

	/**
	*	Read annotations from a single file
	*	@public
	*	@param {Array} memo memoized list of files used to store parsed annotations
	*	@param {Object} file current file metadata to capture
	*	@return {Array}
	**/
	annotation(memo, file) {
		// HERE... this.standard(file.ast.body, '$..[0]');
		return memo;
	}

}

export default Annotation;

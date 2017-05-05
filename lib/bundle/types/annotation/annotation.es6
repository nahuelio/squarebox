/**
*	@module bundle.types.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import _s from 'underscore.string';
import json5 from 'json5';
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
		task.bundles.addAll(this.annotations(task.getFiles()));
		return super.read(resolve, reject);
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
		let annotation = this.search(file.comments, _.bind(this.match, this));
		memo.push(this.extract(annotation));
		return memo;
	}

	/**
	*	Annotation Matcher Evaluation
	*	@public
	*	@param {Object} comment current comment to evaluate
	*	@return {Boolean}
	**/
	match(comment) {
		return _s.startsWith(comment, `${Annotation.name}(`) && _s.endsWith(comment, ')');
	}

	/**
	*	Extract Metadata from annotation declaration using json5 specification
	*	@public
	*	@param {String} expr annotation expression
	*	@return {Object}
	**/
	extract(expr) {
		return json5.parse(_s.rtrim(_s.ltrim(expr, `${Annotation.name}(`), ')'));
	}

	/**
	*	Annotation Name
	*	@static
	*	@property name
	*	@type {String}
	**/
	static get name() {
		return '@sqbox';
	}

}

export default Annotation;

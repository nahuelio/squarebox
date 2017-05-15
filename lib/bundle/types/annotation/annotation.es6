/**
*	@module bundle.types.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Type from 'bundle/types/type';
import * as Helpers from 'bundle/types/annotation/helpers';
import Collection from 'util/adt/collection';
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
	*	@param {util.adt.Collection} bundles list of bundles
	*	@param {Array} files list of files
	*	@return {Promise}
	**/
	read(resolve, reject, bundles, files) {
		this.annotations(files).reduce(this.create, bundles, this);
		return super.read(resolve, reject);
	}

	/**
	*	Create Bundle Metadata
	*	@public
	*	@param {util.adt.Collection} memo memoized list of bundles
	*	@param {Object} meta data extracted from annotation
	*	@return {util.adt.Collection}
	**/
	create(memo, meta) {
		if(!Helpers.containsBy(memo, meta.name)) memo.add({ bundle: meta });
		return memo;
	}

	/**
	*	Read all annotations of all files captured
	*	@public
	*	@param {Array} files files parsed by Reader Task
	*	@return {util.adt.Collection}
	**/
	annotations(files) {
		return _.reduce(files, this.annotation, Collection.new(), this);
	}

	/**
	*	Read annotations from a single file
	*	@public
	*	@param {util.adt.Collection} memo memoized collection of files used to store parsed annotations
	*	@param {Object} file current file metadata to capture
	*	@return {util.adt.Collection}
	**/
	annotation(memo, file) {
		let annotation = this.comments(file.comments, Helpers.match);
		if(_.defined(annotation)) {
			let meta = Helpers.extract(annotation);
			if(Helpers.valid(meta)) memo.add({ name: meta.name, target: file });
		}
		return memo;
	}

	/**
	*	Type Name
	*	@public
	*	@property name
	*	@type {String}
	**/
	get name() {
		return 'Annotation';
	}

}

export default Annotation;

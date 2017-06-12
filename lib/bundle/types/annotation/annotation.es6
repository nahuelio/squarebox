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
	*	@return {Promise}
	**/
	read() {
		this.annotations().reduce(this.create, this.reader.bundles, this);
		return this.resolve(this);
	}

	/**
	*	Read all annotations of all files captured
	*	@public
	*	@return {util.adt.Collection}
	**/
	annotations() {
		return this.reader.files().reduce(this.annotation, Collection.new(), this);
	}

	/**
	*	Create Bundle Metadata
	*	@public
	*	@param {util.adt.Collection} memo memoized list of bundles
	*	@param {Object} meta data extracted from annotation
	*	@return {util.adt.Collection}
	**/
	create(memo, meta) {
		if(!Helpers.containsBy(memo, meta)) memo.add(meta);
		return memo;
	}

	/**
	*	Read annotations from a single file
	*	@public
	*	@param {util.adt.Collection} memo memoized collection of files used to store parsed annotations
	*	@param {Object} captured current captured file metadata
	*	@return {util.adt.Collection}
	**/
	annotation(memo, captured) {
		const { comments, path, input } = captured;
		let annotation = this.comments(comments, Helpers.match);
		if(_.defined(annotation)) memo.add({ path, input, params: Helpers.extract(annotation) });
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

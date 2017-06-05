/**
*	@module bundle.types.import
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Type from 'bundle/types/type';
import * as Reader from 'bundle/types/import/reader';
import * as Writer from 'bundle/types/import/writer';
import Collection from 'util/adt/collection';
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
	*	@param {util.adt.Collection} bundles list of bundles
	*	@param {Array} files list of files
	*	@return {Promise}
	**/
	read(resolve, reject, bundles, files) {
		this.dependencies(bundles);
		return super.read(resolve, reject);
	}

	/**
	*	Read Imports
	*	@public
	*	@param {util.adt.Collection} bundles all bundles captured by annotations
	*	@return {bundle.types.import.Import}
	**/
	dependencies(bundles) {
		bundles.reduce(this.dependency, Collection.new(), this);
		return this;
	}

	/**
	*	Read Dependencies on a single file
	*	@public
	*	@param {util.adt.Collection} memo memoized collection to augment
	*	@param {bundle.task.metadata.Metadata} metadata instance of meta found as a bundle
	*	@return {util.adt.Collection}
	**/
	dependency(memo, metadata) {
		const { target } = metadata.bundle;
		// if(target.source.indexOf('libs.es6') !== -1) {
			this.collectByType(target.ast, ['es6'], function() {});
		// }
		return memo;
	}

	/**
	*	Type Name
	*	@public
	*	@property name
	*	@type {String}
	**/
	get name() {
		return 'Import';
	}

}

export default Import;

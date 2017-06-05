/**
*	@module bundle.types.export
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Type from 'bundle/types/type';
import * as Reader from 'bundle/types/export/reader';
import * as Writer from 'bundle/types/export/writer';
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
		this.exports(bundles);
		return super.read(resolve, reject);
	}

	/**
	*	Read Exports
	*	@public
	*	@param {util.adt.Collection} bundles all bundles captured by annotations
	*	@return {bundle.types.import.Import}
	**/
	exports(bundles) {
		bundles.reduce(this.export, Collection.new(), this);
		return this;
	}

	/**
	*	Read Exports on a single file
	*	@public
	*	@param {util.adt.Collection} memo memoized collection to augment
	*	@param {bundle.task.metadata.Metadata} metadata instance of meta found as a bundle
	*	@return {util.adt.Collection}
	**/
	export(memo, metadata) {
		const { target } = metadata.bundle;
		//this.collectByType(target.ast, ['es6'], _.bind(Helpers.onExport, Helpers));
		return memo;
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

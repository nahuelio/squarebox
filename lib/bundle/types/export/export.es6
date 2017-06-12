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
	*	Export Read strategy
	*	@public
	*	@override
	*	@return {Promise}
	**/
	read() {
		this.exports();
		return this.resolve(this);
	}

	/**
	*	Read Exports
	*	@public
	*	@param {util.adt.Collection} bundles all bundles captured by annotations
	*	@return {bundle.types.import.Import}
	**/
	exports() {
		this.reader.bundles.reduce(this.export, Collection.new(), this);
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
		const { path, input } = metadata;
		//this.collectByType(target.ast, ['es6'], _.bind(Helpers.onExport, Helpers));
		return memo;
	}

	/**
	*	Export Write strategy
	*	@public
	*	@override
	*	@return {Promise}
	**/
	write() {
		return this.resolve(this);
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

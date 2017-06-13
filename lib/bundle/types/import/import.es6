/**
*	@module bundle.types.import
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Type from 'bundle/types/type';
import Collection from 'util/adt/collection';
import Format from 'bundle/format/format';
import logger from 'util/logger/logger';

/**
*	Class Import
*	@extends {bundle.types.Type}
**/
class Import extends Type {

	/**
	*	Import Read strategy
	*	@public
	*	@override
	*	@return {Promise}
	**/
	read() {
		return this.reader.bundles.reduce(this.readDependencies, true, this) ?
			this.resolve(this) : this.reject(this);
	}

	/**
	*	Recursive Strategy to query dependencies and attach them into the metadata.
	*	@public
	*	@param {Boolean} memo memoized boolean result
	*	@param {bundle.task.metadata.Metadata} metadata instance of meta found as a bundle
	*	@param {Number} ix current metadata index
	*	@param {util.adt.Collection} collection original metadata collection
	*	@return {Boolean}
	**/
	readDependencies(memo, metadata) {
		this.collectByType(metadata.input, _.bind(this.dependency, this, metadata));
		return metadata.dependencies.reduce(this.onDependenciesRead, memo, this);
	}

	/**
	*	Resolves & creates dependency
	*	@public
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {util.adt.Collection} dependencies list of dependencies found
	*	@param {String} format current format
	*	@return {util.adt.Collection}
	**/
	dependency(metadata, dependencies, format) {
		return dependencies.reduce((metadata, ast) => {
			metadata.dependencies.add(this.createDependency(metadata, ast, format));
			return metadata;
		}, metadata, this);
	}

	/**
	*	Creates Dependency
	*	@public
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} ast current dependency ast reference
	*	@param {String} format current format being resolved
	*	@return {Object}
	**/
	createDependency(metadata, ast, format) {
		return this.collectByElement(ast, Format.elements.ImportSpecifier)
			.reduce(_.bind(this.resolveDependency, this, format, metadata, ast), {});
	}

	/**
	*	Resolve Dependency
	*	@param {String} format current format being resolved
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} ast current original source ast reference
	*	@param {Object} dependency current new dependency
	*	@param {astq.Node} node current dependency node reference
	**/
	resolveDependency(format, metadata, ast, dependency, node) {
		return Import.resolversBy(format, this).reduce((dependency, resolve) => {
			return resolve(dependency, metadata, node, ast);
		}, dependency);
	}

	/**
	*	Dependencies Query Result Handler
	*	@public
	*	@param {Boolean} memo memoized boolean result
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {Array} results list of ast results
	*	@return {bundle.type.import.Import}
	**/
	onDependenciesRead(memo, dependency) {
		console.log(this.reader.get(dependency.import.path));
		//results.map(_.bind(this.create, this, memo, this.reader.files()), this);
		return memo;
	}

	/**
	*	Import Write strategy
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
		return 'Import';
	}

	/**
	*	Resolvers by Format
	*	@static
	*	@param {String} format
	*	@return {Array}
	**/
	static resolversBy = (format, instance) => {
		return Collection.new(_.map(Import.resolvers, (name) => instance[`${format.toLowerCase()}${name}`]));
	}

	/**
	*	Method Name Resolvers
	*	@static
	*	@property resolvers
	*	@type {Array}
	**/
	static resolvers = [
		'ResolveImportSpecifier',
		'ResolveImportPath',
		'ResolveParent',
		'ResolveAst'
	];

}

export default Import;

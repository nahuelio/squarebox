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
		let result = this.reader.bundles.reduce(this.readBundle, true, this);
		return result ? this.resolve(this) : this.reject(this);
	}

	/**
	*	Read all bundles
	*	@public
	*	@param {Boolean} memo memoized boolean result
	*	@param {bundle.task.metadata.Metadata} metadata instance of meta found as a bundle
	*	@param {Number} ix current metadata index
	*	@param {util.adt.Collection} collection original metadata collection
	*	@return {Boolean}
	**/
	readBundle(memo, metadata) {
		return this.readDependencies(memo, metadata, metadata.input);
	}

	/**
	*	Recursive Strategy to query dependencies and attach them into the metadata.
	*	@public
	*	@param {Boolean} memo memoized boolean result
	*	@param {bundle.task.metadata.Metadata} metadata current bundle reference
	*	@param {astq.Node} input current ast node used to collect
	*	@param {Object} [file] current parsed file
	*	@return {Boolean}
	**/
	readDependencies(memo, metadata, input, file) {
		this.collectByType(input, _.bind(this.dependency, this, metadata));
		return metadata.dependencies.reduce(_.bind(this.onDependenciesRead, this, metadata), memo);
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
		//if(format === 'AMD') console.log('AMD AST: ', ast);
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
		return Import.by(format, this).reduce((dependency, resolve) => {
			return resolve(dependency, metadata, node, ast);
		}, dependency);
	}

	/**
	*	Dependencies Query Result Handler
	*	@public
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {Boolean} memo memoized boolean result
	*	@param {bundle.task.metadata.Dependency} dependency current dependency
	*	@return {Boolean}
	**/
	onDependenciesRead(metadata, memo, dependency) {
		//console.log('------------------------');
		let out = this.reader.all(dependency.import)
			.allByPath(dependency.import.path);
			// .reduce((memo, file) => {
			// 	console.log(file.path);
			// 	let out = this.readDependencies(memo, metadata, file.input, file)
			// 	console.log('------');
			// 	return out;
			// }, memo);
		if(dependency.import.path.indexOf('amd-lib') !== -1) {
			//console.log('I: ', out.get(0).input.body[0].expression.arguments);
			//console.log('******************');
			this.collectByType(out.get(0).input, _.bind(this.dependency, this, metadata), ['amd']);
			//console.log(metadata.path, metadata.dependencies._collection);
		}
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
	static by = (format, instance) => {
		return Collection.new(_.map(Import.elements, (name) => instance[`${format.toLowerCase()}${name}`]));
	}

	/**
	*	Import Element Resolvers
	*	@static
	*	@property elements
	*	@type {Array}
	**/
	static elements = [
		'ResolveImportSpecifier',
		'ResolveImportPath',
		'ResolveParent',
		'ResolveAst'
	];

}

export default Import;

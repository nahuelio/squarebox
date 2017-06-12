/**
*	@module bundle.task.metadata
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Collection from 'util/adt/collection';
import Visited from 'util/visitor/visited';
import Dependency from 'bundle/task/metadata/dependency';

/**
*	Class Metadata
*	@version 1.0.0
*	@extends {util.visitor.Visited}
*
*	@desc
*		This is the general ADT used by squarebox to perform operations on it, as a result of collecting metadata
*		by the AST parsing library and later on, used by the AST writer library to generate output.
*		Here the general structure specs:
*
*	@example
*		[bundle.task.metadata.Metadata] => {
*			path: {}, - File path where the annotation was found
*			params: {annotationCapturedParams}, - required name: {unique bundle name}
*			input: {ast},
*			dependents: [{ [bundle.task.metadata.Dependency] - 1-dimensional array - no nesting
*				id: {uuid},
*				parent: {id|bundleName}, - if top level.
*				import: { path: {}, modules: [{ id: {string}, alias: {string} }] },
*				export: [{ id: {object} }, ...],
*				input: {ast},
*				output: {ast}
*			}, {
*				id: {uuid},
*				parent: {id},
*				import: { path: {}, modules: [{ id: {string}, alias: {string} }] },
*				export: [{ id: {object} }, ...],
*				input: {ast},
*				output: {ast}
*			}]
*		}
**/
class Metadata extends Visited {

	/**
	*	Constructor
	*	@public
	*	@param {Any} [...args] constructor arguments
	*	@return {bundle.task.metadata.Metadata}
	**/
	constructor(...args) {
		super({ dependencies: Collection.new([], { interface: Dependency }) });
		return this.registerAll().parse(...args);
	}

	/**
	*	Parse Strategy
	*	@public
	*	@param {Object} attrs metadata attributes to parse
	*	@return {bundle.task.metadata.Metadata}
	**/
	parse(attrs = {}) {
		this.dependencies.set(attrs.dependencies);
		return extend(true, this, _.pick(attrs, this.constructor.properties));
	}

	/**
	*	Retrieves bundle name
	*	@public
	*	@return {String}
	**/
	getName() {
		return _.defined(this.params) && _.defined(this.params.name) ? this.params.name : null;
	}

	/**
	*	Property Definition
	*	@static
	*	@property properties
	*	@type {Array}
	**/
	static properties = [
		'path',
		'input',
		'params'
	];

	/**
	*	Compound Property Definition
	*	@static
	*	@property compound
	*	@type {Array}
	**/
	static compound = [
		'dependencies'
	];

}

export default Metadata;

/**
*	@module bundle.task.metadata
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Collection from 'util/adt/collection';
import Visited from 'util/visitor/visited';
import Bundle from 'bundle/task/metadata/bundle';
import File from 'bundle/task/metadata/file';

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
*		[Metadata] => {
*			bundle: {uniqueName},
*			files: [{
*				source: {path},
*				ast: {object},
*				comments: []
*			}, ...]
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
		super({ bundle: Bundle.new(), files: Collection.new([], { interface: File }) });
		return this.registerAll().parse(...args);
	}

	/**
	*	Parse Strategy
	*	@public
	*	@param {Object} attrs metadata attributes to parse
	*	@return {bundle.task.metadata.Metadata}
	**/
	parse(attrs = {}) {
		this.bundle.parse(attrs.bundle);
		this.files.set(attrs.files);
		return extend(true, this, _.pick(attrs, this.constructor.properties));
	}

	/**
	*	Returns a json representation of the instance of this class
	*	@public
	*	@override
	*	@param {visitors.formatter.Json} [ctx] - context reference
	*	@return {Object}
	**/
	toJSON(ctx) {
		return { bundle: this.bundle.toJSON(), files: this.files.toJSON() };
	}

	/**
	*	Property Definition
	*	@static
	*	@property properties
	*	@type {Array}
	**/
	static properties = [];

	/**
	*	Compound Property Definition
	*	@static
	*	@property compound
	*	@type {Array}
	**/
	static compound = [
		'bundle',
		'files'
	];

}

export default Metadata;

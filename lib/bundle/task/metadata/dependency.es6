/**
*	@module bundle.task.metadata
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Visited from 'util/visitor/visited';

/**
*	Class Dependency
*	@extends {util.visitor.Visited}
**/
class Dependency extends Visited {

	/**
	*	Constructor
	*	@public
	*	@param {Any} [...args] constructor arguments
	*	@return {bundle.task.metadata.Dependency}
	**/
	constructor(...args) {
		super(_.object(Dependency.properties, [_.uuid()]));
		return this.registerAll().parse(...args);
	}

	/**
	*	Parse Strategy
	*	@public
	*	@param {Object} [attrs = {}] attributes to parse
	*	@return {bundle.task.metadata.Dependency}
	**/
	parse(attrs = {}) {
		return extend(true, this, _.pick(attrs, this.constructor.properties));
	}

	/**
	*	Returns a json representation of the instance of this class
	*	@public
	*	@override
	*	@return {Object}
	**/
	toJSON() {
		return {
			id: this.id,
			parent: this.parent,
			import: this.import,
			export: this.export,
			input: this.input,
			output: this.output
		};
	}

	/**
	*	Property Definition
	*	@static
	*	@property properties
	*	@type {Array}
	**/
	static properties = [
		'id',
		'parent',
		'import',
		'export',
		'input',
		'output'
	];

}

export default Dependency;

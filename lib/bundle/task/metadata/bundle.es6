/**
*	@module bundle.task.metadata
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Visited from 'util/visitor/visited';
import File from 'bundle/task/metadata/file';

/**
*	Class Bundle
*	@extends {util.visitor.Visited}
**/
class Bundle extends Visited {

	/**
	*	Constructor
	*	@public
	*	@param {Any} [...args] constructor arguments
	*	@return {bundle.task.metadata.Bundle}
	**/
	constructor(...args) {
		super({ name: null, target: File.new() });
		return this.registerAll().parse(...args);
	}

	/**
	*	Parse Strategy
	*	@public
	*	@param {Object} [attrs = {}] attributes to parse
	*	@return {bundle.task.metadata.Bundle}
	**/
	parse(attrs = {}) {
		this.target.parse(attrs.target);
		return extend(true, this, _.pick(attrs, this.constructor.properties));
	}

	/**
	*	Compound Property Definition
	*	@static
	*	@property compound
	*	@type {Array}
	**/
	static compound = [
		'target'
	];

	/**
	*	Property Definition
	*	@static
	*	@property properties
	*	@type {Array}
	**/
	static properties = [
		'name'
	];

}

export default Bundle;

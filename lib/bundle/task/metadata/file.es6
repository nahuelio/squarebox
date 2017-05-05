/**
*	@module bundle.task.metadata
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Visited from 'util/visitor/visited';

/**
*	Class File
*	@extends {util.visitor.Visited}
**/
class File extends Visited {

	/**
	*	Constructor
	*	@public
	*	@param {Any} [...args] constructor arguments
	*	@return {bundle.task.metadata.File}
	**/
	constructor(...args) {
		super(_.object(File.properties, []));
		return this.registerAll().parse(...args);
	}

	/**
	*	Parse Strategy
	*	@public
	*	@param {Object} [attrs = {}] attributes to parse
	*	@return {bundle.task.metadata.File}
	**/
	parse(attrs = {}) {
		return extend(true, this, _.pick(attrs, this.constructor.properties));
	}

	/**
	*	Property Definition
	*	@static
	*	@property properties
	*	@type {Array}
	**/
	static properties = [
		'source',
		'ast',
		'comments'
	];

}

export default File;

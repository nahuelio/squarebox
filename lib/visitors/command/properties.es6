/**
*	@module visitors.command
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import Visitor from 'util/visitor/visitor';

/**
*	Class Properties
*	@extends {util.visitor.Visitor}
**/
class Properties extends Visitor {

	/**
	*	Retrieve targets by using a given predicate passed by parameter
	*	@public
	*	@param {Function} predicate - predicate to walk over the targets
	*	@return {Array}
	**/
	targets(predicate) {
		return _.defined(predicate) && _.isFunction(predicate) ? _.map(this.target, predicate, this) : [];
	}

	/**
	*	Retrieves parent command
	*	@public
	*	@return {Command}
	**/
	getParent() {
		return this.parent;
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'PropertiesVisitor';
	}

}

export default Properties;

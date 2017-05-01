/**
*	@module bundle.format
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import jp from 'jsonpath';
import Visitor from 'util/visitor/visitor';
import Collection from 'util/adt/collection';
import logger from 'util/logger/logger';

/**
*	Class Format
*	@extends {util.visitor.Visitor}
**/
class Format extends Visitor {

	/**
	*	Constructor
	*	@public
	*	@param {Any} [...args] - constructor arguments
	*	@return {bundle.format.Format}
	**/
	constructor() {
		super();
		return this;
	}

	/**
	*	Method Wrapper for querying AST
	*	@public
	*	@param {String} [expr = ''] - json path query
	*	@param {Object} [o = {}] - object to query
	*	@return {Any}
	**/
	query(expr = '', o = {}) {
		return this.result(jp.query(expr, o));
	}

	/**
	*	Default Result Handler
	*	@public
	*	@param {Any} out - ast query result
	*	@return {bundle.format.Format}
	**/
	result(out) {
		return this;
	}

}

export default Format;

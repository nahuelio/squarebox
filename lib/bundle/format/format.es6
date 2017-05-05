/**
*	@module bundle.format
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import AstQ from 'astq'; // documentation - https://www.npmjs.com/package/astq
import Visitor from 'util/visitor/visitor';
import Collection from 'util/adt/collection';
import logger from 'util/logger/logger';

/**
*	Class Format
*	@Note: Subjected to refactor formats ast -> format (formats and templates), ast -> query (astq wrapper visitor)
*	@extends {util.visitor.Visitor}
**/
class Format extends Visitor {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@return {bundle.format.Format}
	**/
	constructor() {
		return super({ astq: new AstQ() });
	}

	/**
	*	Method Wrapper for querying Abstract Syntax Tree (AST)
	*	@public
	*	@param {Object} [ast = {}] AST to query
	*	@param {String} [expr = ''] json path query
	*	@param {Any} [...args] additional arguments
	*	@return {Any}
	**/
	query(ctx, ast = {}, expr = '', ...args) {
		return this.result(this.astq.query(ast, expr, ...args));
	}

	/**
	*	Default Result Handler
	*	@public
	*	@param {Any} out - ast query result
	*	@return {bundle.format.Format}
	**/
	result(out) {
		console.log('Result: ', out);
		return this;
	}

}

export default Format;

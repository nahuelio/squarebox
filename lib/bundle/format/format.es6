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
	*	Clean Up
	*	@public
	*	@param {Array} comments list of all comments
	*	@return {Array}
	**/
	_clean(comments) {
		return _.map(comments, (comment) => _.trimSpecial(comment.value));
	}

	/**
	*	Default Result Handler
	*	@private
	*	@param {Array} out - ast query result
	*	@return {Any}
	**/
	_result(out = [], cb) {
		return cb(Collection.new(out));
	}

	/**
	*	Perform search of annotations over comments in the source code and retrieves
	*	the first occurence when predicates pass the evaluation
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Array} comments list of all comments
	*	@param {Function} [predicate = () => false] predicate walker
	*	@return {Object}
	**/
	search(ctx, comments = [], predicate = () => false) {
		return _.find(this._clean(comments), predicate);
	}

	/**
	*	Method Wrapper for querying Abstract Syntax Tree (AST)
	*	@public
	*	@param {Object} [ast = {}] AST to query
	*	@param {String} [expr = ''] json path query
	*	@param {Function} [cb = () => {}]
	*	@param {Any} [...args] additional arguments
	*	@return {Any}
	**/
	query(ctx, ast = {}, expr = '', cb = () => {}, ...args) {
		return this._result(this.astq.query(ast, expr, ...args), cb);
	}

}

export default Format;

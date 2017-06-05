/**
*	@module bundle.format
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import _s from 'underscore.string';
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
	*	Resolves Query Type of element to query
	*	@public
	*	@param {bundle.types.Type} type - type to resolve
	*	@return {String}
	**/
	which(type) {
		let format = _s.strLeft(this.name, 'Visitor').toUpperCase(),
			prop = `Q${format}_${Format.types[type.name.toLowerCase()]}`;
		if(_.defined(this.constructor[prop])) return this.constructor[prop];
		logger(`Type ${type.name} not found.`).fatal();
	}

	/**
	*	Method wrapper for querying Abstract Syntax Tree (AST) by a given type
	*	@public
	*	@param {astq.Node} [ast] astq node to query
	*	@param {Any} [...args] additional arguments
	*	@return {Any}
	**/
	queryByType(ctx, ast, ...args) {
		return this.query(ctx, ast, this.which(ctx), ...args);
	}

	/**
	*	Method Wrapper for querying Abstract Syntax Tree (AST)
	*	@public
	*	@param {Object} [ast = {}] AST to query
	*	@param {String} [expr = ''] astq expression
	*	@param {Function} [cb = () => {}] optional callback on result
	*	@param {Any} [...args] additional arguments
	*	@return {Any}
	**/
	query(ctx, ast = {}, expr = '', cb = () => {}, ...args) {
		return this.onQuery(this.astq.query(ast, expr, ...args), cb);
	}

	/**
	*	Default Result Handler
	*	@public
	*	@param {Array} out - ast query result
	*	@param {Function} cb - callback on result
	*	@return {Any}
	**/
	onQuery(out = [], cb) {
		// if(out.length > 0) {
		// 	logger(JSON.stringify(out, null, 1)).warn();
		// }
		return cb(Collection.new(out));
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'FormatVisitor';
	}

	/**
	*	Query Types
	*	@public
	*	@property types
	*	@type {Object}
	**/
	static types = {
		import: 'ImportDeclaration',
		export: 'ExportDeclaration'
	};

}

export default Format;

/**
*	@module bundle.format.cjs
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Format from 'bundle/format/format';
import logger from 'util/logger/logger';

/**
*	Class CommonJs
*	@extends {bundle.format.Format}
**/
class CommonJs extends Format {

	/**
	*	CommonJs AST Query
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} o - object to query
	*	@param {String} expr - json path query
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	cjs(ctx, o, expr, ...args) {
		return this.query(o, expr, ...args);
	}

	/**
	*	CommonJs AST Query by a given type
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {astq.Node} ast ast to query
	*	@param {bundle.types.Type} type type used to query
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	cjsByType(ctx, ast, type, ...args) {
		return this.queryByType(ctx, ast, type, ...args);
	}

	/**
	*	ASTQ CJS Import Declaration Query
	*	@static
	*	@property QCJS_ImportDeclaration
	*	@type {String}
	**/
	static QCJS_ImportDeclaration = `
		/VariableDeclaration [
			in( * [@kind == 'var' || @kind == 'let' || @kind == 'const']) &&
			/VariableDeclarator /CallExpression /Identifier [@name == 'require']
		], /ExpressionStatement [
			/AssignmentExpression /CallExpression /Identifier [@name == 'require']
		], /ExpressionStatement /CallExpression [
			/Identifier [@name == 'require']
		]
	`;

	/**
	*	ASTQ CJS Import Declaration Query
	*	@static
	*	@property QCJS_ExportDeclaration
	*	@type {String}
	**/
	static QCJS_ExportDeclaration = `
		/ExpressionStatement /AssignmentExpression [
			@operator == '=' &&
			@left != 'undefined' &&
			/MemberExpression [
				@property != 'undefined' &&
				/Identifier [@name == 'exports']
			]
		]
	`;

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'CjsVisitor';
	}

}

export default CommonJs;

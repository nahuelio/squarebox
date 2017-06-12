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
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	cjs(ctx, ...args) {
		return this.query(ctx, ...args);
	}

	/**
	*	CommonJs AST Query by a given type
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {astq.Node} ast ast to query
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	cjsByType(ctx, ast, ...args) {
		return this.queryByType(ctx, ast, ...args);
	}

	/**
	*	CommonJs AST QUery by a given element
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {astq.Node} ast ast to query
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	cjsByElement(ctx, ast, ...args) {
		return this.queryByElement(ctx, ast, ...args);
	}

	/**
	*	CommonJs Resolves Import Specifier for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency new dependency to add
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} node current node ast
	*	@return {Object}
	**/
	cjsResolveImportSpecifier(ctx, dependency) {
		if(!_.defined(dependency.import)) dependency.import = {};
		// TODO
		return extend(false, dependency.import, { id: '' });
	}

	/**
	*	CommonJs Resolves Import Path for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency new dependency to add
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} node current node ast
	*	@return {Object}
	**/
	cjsResolveImportPath(ctx, dependency) {
		if(!_.defined(dependency.import)) dependency.import = {};
		// TODO
		return extend(false, dependency.import, { path: '' });
	}

	/**
	*	CommonJs Resolves Parent for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency dependency to resolve parent
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} node current node ast
	*	@return {Object}
	**/
	cjsResolveParent(ctx, dependency, metadata) {
		return super.resolveParent(dependency, metadata);
	}

	/**
	*	CommonJs Resolves AST Injection for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency dependency to resolve parent
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} ast ast root node for current dependency
	*	@return {Object}
	**/
	cjsResolveAst(ctx, dependency, metadata, ast) {
		return super.resolveAst(dependency, ast);
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
	*	ASTQ CJS Import Specifier Query
	*	@static
	*	@property QCJS_ImportSpecifier
	*	@type {String}
	**/
	static QCJS_ImportSpecifier = `
		/TODO
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
	*	ASTQ CJS Export Specifier Query
	*	@static
	*	@property QCJS_ExportSpecifierDeclaration
	*	@type {String}
	**/
	static QCJS_ExportSpecifier = `
		/TODO
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

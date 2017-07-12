/**
*	@module bundle.format.cjs
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Format from 'bundle/format/format';
import * as Helpers from 'bundle/format/cjs/helpers';
import Collection from 'util/adt/collection';
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
	cjsResolveImportSpecifier(ctx, dependency, metadata, node) {
		if(!_.defined(dependency.import)) dependency.import = { modules: Collection.new() };
		Helpers.add(dependency.import.modules, node);
		return dependency;
	}

	/**
	*	CommonJs Resolves Import Path for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency new dependency to add
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} node current node ast
	*	@param {astq.Node} ast current original source ast reference
	*	@return {Object}
	**/
	cjsResolveImportPath(ctx, dependency, metadata, node, ast) {
		dependency.import.path = ctx.reader.file(Helpers.resolvePath(ast), false);
		return dependency;
	}

	/**
	*	CommonJs Resolves Parent for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency dependency to resolve parent
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} node current node ast
	*	@param {astq.Node} ast current original source ast reference
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
	*	@param {astq.Node} node current node ast
	*	@param {astq.Node} ast current original source ast reference
	*	@return {Object}
	**/
	cjsResolveAst(ctx, dependency, metadata) {
		return super.resolveAst(dependency, '');
	}

	/**
	*	ASTQ CJS Import Declaration Query
	*	@static
	*	@property QCJS_ImportDeclaration
	*	@type {String}
	**/
	static QCJS_ImportDeclaration = `
		/VariableDeclaration [/VariableDeclarator [/CallExpression [/Identifier [@name == 'require']]]],
		/ExpressionStatement [/AssignmentExpression [/CallExpression [/Identifier [@name == 'require']]]],
		/ExpressionStatement [/CallExpression [/Identifier [@name == 'require']]]
	`;

	/**
	*	ASTQ CJS Import Specifier Query
	*	@FIXME: require('hello');
	*	@static
	*	@property QCJS_ImportSpecifier
	*	@type {String}
	**/
	static QCJS_ImportSpecifier = `
		/VariableDeclarator /Identifier,
		/AssignmentExpression /Identifier,
		/CallExpression
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

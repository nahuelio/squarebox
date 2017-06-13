/**
*	@module bundle.format.es6
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Format from 'bundle/format/format';
import * as Helpers from 'bundle/format/es6/helpers';
import Collection from 'util/adt/collection';
import logger from 'util/logger/logger';

/**
*	Class Es6
*	@extends {bundle.format.Format}
**/
class Es6 extends Format {

	/**
	*	ES6 AST Query
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	es6(ctx, ...args) {
		return this.query(ctx, ...args);
	}

	/**
	*	ES6 AST Query by a given type
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {astq.Node} ast ast to query
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	es6ByType(ctx, ast, ...args) {
		return this.queryByType(ctx, ast, ...args);
	}

	/**
	*	ES6 AST QUery by a given element
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {astq.Node} ast ast to query
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	es6ByElement(ctx, ast, ...args) {
		return this.queryByElement(ctx, ast, ...args);
	}

	/**
	*	ES6 Resolves Import Specifier for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency new dependency to add
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} node current node ast
	*	@param {astq.Node} ast current original source ast reference
	*	@return {Object}
	**/
	es6ResolveImportSpecifier(ctx, dependency, metadata, node) {
		if(!_.defined(dependency.import)) dependency.import = { modules: Collection.new() };
		Helpers.add(dependency.import.modules, node);
		return dependency;
	}

	/**
	*	ES6 Resolves Import Path for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency new dependency to add
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} node current node ast
	*	@return {Object}
	**/
	es6ResolveImportPath(ctx, dependency, metadata, node, ast) {
		dependency.import.path = ctx.reader.aliases(ast.source.value);
		return dependency;
	}

	/**
	*	ES6 Resolves Parent for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency dependency to resolve parent
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} node current node ast
	*	@return {Object}
	**/
	es6ResolveParent(ctx, dependency, metadata) {
		return super.resolveParent(dependency, metadata);
	}

	/**
	*	ES6 Resolves AST Injection for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency dependency to resolve parent
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} node current node ast
	*	@param {astq.Node} ast current original source ast reference
	*	@return {Object}
	**/
	es6ResolveAst(ctx, dependency, metadata) {
		return super.resolveAst(dependency, '');
	}

	/**
	*	ASTQ ES6 Import Declaration Query
	*	@static
	*	@property QES6_ImportDeclaration
	*	@type {String}
	**/
	static QES6_ImportDeclaration = `/ImportDeclaration`;

	/**
	*	ASTQ ES6 Import Specifier Query
	*	@static
	*	@property QES6_ImportSpecifierDeclaration
	*	@type {String}
	**/
	static QES6_ImportSpecifier = `
		/ImportDefaultSpecifier,
		/ImportSpecifier,
		/ImportNamespaceSpecifier,
		/Literal
	`;

	/**
	*	ASTQ ES6 Import Path Query
	*	@static
	*	@property QES6_ImportPath
	*	@type {String}
	**/
	static QES6_ImportPath = `/Literal`;

	/**
	*	ASTQ ES6 Export Declaration Query
	*	@static
	*	@property QES6_ExportDeclaration
	*	@type {String}
	**/
	static QES6_ExportDeclaration = `/ExportDeclaration`;

	/**
	*	ASTQ ES6 Export Specifier Query
	*	@static
	*	@property QES6_ExportSpecifierDeclaration
	*	@type {String}
	**/
	static QES6_ExportSpecifier = `/ExportDefaultSpecifier`;

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'Es6Visitor';
	}

}

export default Es6;

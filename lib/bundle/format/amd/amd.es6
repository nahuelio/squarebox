/**
*	@module bundle.format.amd
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Format from 'bundle/format/format';
import * as Helpers from 'bundle/format/amd/helpers';
import Collection from 'util/adt/collection';
import logger from 'util/logger/logger';

/**
*	Class Amd
*	@extends {bundle.format.Format}
**/
class Amd extends Format {

	/**
	*	AMD AST Query
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	amd(ctx, ...args) {
		return this.query(ctx, ...args);
	}

	/**
	*	AMD AST Query by a given type
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {astq.Node} ast ast to query
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	amdByType(ctx, ast, ...args) {
		return this.queryByType(ctx, ast, ...args);
	}

	/**
	*	AMD AST QUery by a given element
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {astq.Node} ast ast to query
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	amdByElement(ctx, ast, ...args) {
		return this.queryByElement(ctx, ast, ...args);
	}

	/**
	*	AMD Resolves Import Specifier for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency new dependency to add
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} node current node ast
	*	@param {astq.Node} ast current original source ast reference
	*	@return {Object}
	**/
	amdResolveImportSpecifier(ctx, dependency, metadata, node, ast) {
		if(!_.defined(dependency.import)) dependency.import = { modules: Collection.new() };
		Helpers.add(dependency.import.modules, node);
		return dependency;
	}

	/**
	*	AMD Resolves Import Path for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency new dependency to add
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} node current node ast
	*	@param {astq.Node} ast current original source ast reference
	*	@return {Object}
	**/
	amdResolveImportPath(ctx, dependency, metadata, node, ast) {
		dependency.import.path = ctx.reader.file(Helpers.resolvePath(ctx, ast, node), false);
		return dependency;
	}

	/**
	*	AMD Resolves Parent for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency dependency to resolve parent
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} node current node ast
	*	@param {astq.Node} ast current original source ast reference
	*	@return {Object}
	**/
	amdResolveParent(ctx, dependency, metadata) {
		return super.resolveParent(dependency, metadata);
	}

	/**
	*	AMD Resolves AST Injection for a given dependency and returns it
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} dependency dependency to resolve parent
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@param {astq.Node} node current node ast
	*	@param {astq.Node} ast current original source ast reference
	*	@return {Object}
	**/
	amdResolveAst(ctx, dependency, metadata) {
		return super.resolveAst(dependency, '');
	}

	/**
	*	ASTQ AMD Import Declaration Query
	*	@static
	*	@property QAMD_ImportDeclaration
	*	@type {String}
	**/
	static QAMD_ImportDeclaration = `
		/ExpressionStatement /CallExpression [/Identifier [@name == 'define']]
	`;

	/**
	*	ASTQ AMD Import Specifier Query
	*	@static
	*	@property QAMD_ImportSpecifier
	*	@type {String}
	**/
	static QAMD_ImportSpecifier = `
	 	/ArrayExpression /:elements Literal
	`;

	/**
	*	ASTQ ES6 Import Path Query
	*	@static
	*	@property QES6_ImportPath
	*	@type {String}
	**/
	static QAMD_ImportPath = `/FunctionExpression`;

	/**
	*	ASTQ AMD Export Declaration Query
	*	@static
	*	@property QAMD_ExportDeclaration
	*	@type {String}
	**/
	static QAMD_ExportDeclaration = '/TODO';

	/**
	*	ASTQ AMD Export Specifier Query
	*	@static
	*	@property QAMD_ExportSpecifier
	*	@type {String}
	**/
	static QAMD_ExportSpecifier = `/TODO`;

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'AmdVisitor';
	}

}

export default Amd;

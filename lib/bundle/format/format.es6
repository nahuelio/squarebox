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
	*	@param {String} format the format
	*	@param {String} type element type
	*	@return {String}
	**/
	which(format, type) {
		const prop = `Q${format}_${type}`;
		if(_.defined(this.constructor[prop])) return this.constructor[prop];
		logger(`Format ${format} -> Type ${type} not found.`).fatal();
	}

	/**
	*	Method Wrapper for querying Abstract Syntax Tree (AST)
	*	@public
	*	@param {Object} [ast = {}] AST to query
	*	@param {String} [expr = ''] astq expression
	*	@param {Function} [cb] optional callback on result
	*	@param {Any} [...args] additional arguments
	*	@return {Any}
	**/
	query(ctx, ast = {}, expr = '', cb, ...args) {
		if(!_.defined(cb)) cb = () => {};
		return this.onQuery(this.astq.query(ast, expr, ...args), cb);
	}

	/**
	*	Method wrapper for querying Abstract Syntax Tree (AST) by a given type
	*	@public
	*	@param {astq.Node} [ast] astq node to query
	*	@param {Any} [...args] additional arguments
	*	@return {Any}
	**/
	queryByType(ctx, ast, ...args) {
		return this.query(ctx, ast, this.which(this.getName(), Format.types[ctx.getName()]), ...args);
	}

	/**
	*	Method wrapper for querying Abstract Syntax Tree (AST) by a given element
	*	@public
	*	@param {astq.Node} [ast] astq node to query
	*	@param {String} element element name to query
	*	@param {Any} [...args] additional arguments
	*	@return {Any}
	**/
	queryByElement(ctx, ast, element, ...args) {
		return this.query(ctx, ast, this.which(this.getName(), Format.elements[element]), ...args);
	}

	/**
	*	Default Query Result Handler
	*	@public
	*	@param {Array} out - ast query result
	*	@param {Function} cb - callback on result
	*	@return {Any}
	**/
	onQuery(out = [], cb) {
		return this.onResult(out, cb);
	}

	/**
	*	Default Result Handler
	*	@public
	*	@param {Array} results ast query result list
	*	@param {Function} callback callback
	*	@return {Any}
	**/
	onResult(results, callback) {
		callback(Collection.new(results), this.getName());
		return results;
	}

	/**
	*	Retrieves Module for a given dependency modules list. Returns null if module was not found
	*	@public
	*	@param {util.adt.Collection} modules current list of dependency modules to add into
	*	@param {String} id module id
	*	@return {Object}
	**/
	getModule(modules, id) {
		if(!_.defined(id)) return true;
		return modules.findWhere({ id: id });
	}

	/**
	*	Add Module to a given dependency if it doesn't exists based on module id
	*	@public
	*	@param {util.adt.Collection} modules current list of dependency modules to add into
	*	@param {astq.Node} node module literal value path
	*	@param {String} id module id
	*	@param {String} [alias] module alias
	*	@return {util.adt.Collection}
	**/
	addModule(modules, node, local, imported) {
		let _module = {};
		// Continue here...
		if(local && !imported) {
			_module = { id: local.name };
		} else if(local && imported) {
			_module = { id: local.name, alias: imported.name };
		}
		return !this.getModule(modules, _module.id) ? modules.add(_module) : modules;
	}

	/**
	*	Removes Module from a given depependency if it exists, based on module id
	*	@public
	*	@param {util.adt.Collection} modules current list of dependency modules to remove from
	*	@param {String} id module id
	*	@param {String} [alias] module alias
	*	@return {util.adt.Collection}
	**/
	removeModule(dependency, id, alias) {
		return modules;
	}

	/**
	*	Generic AST Injection for a given dependency and returns it
	*	@public
	*	@param {Object} dependency dependency to inject ast
	*	@param {astq.Node} ast ast root node for current dependency
	*	@return {Object}
	**/
	resolveAst(dependency, ast) {
		return extend(false, dependency, { input: ast });
	}

	/**
	*	Generic Parent Resolution for a given dependency and returns it
	*	@public
	*	@param {Object} dependency dependency to resolve parent
	*	@param {bundle.task.metadata.Metadata} metadata current metadata
	*	@return {Object}
	**/
	resolveParent(dependency, metadata) {
		let name = metadata.getName();
		return extend(false, dependency, { parent: _.defined(name) ? name : _.uuid() });
	}

	/**
	*	Retrieve Format Name
	*	@public
	*	@return {String}
	**/
	getName() {
		return _s.strLeftBack(this.name, 'Visitor').toUpperCase();
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
	*	Query types
	*	@public
	*	@property types
	*	@type {Object}
	**/
	static types = {
		import: 'ImportDeclaration',
		export: 'ExportDeclaration'
	};

	/**
	*	Query elements
	*	@public
	*	@property elements
	*	@type {Object}
	**/
	static elements = {
		ImportSpecifier: 'ImportSpecifier',
		ImportId: 'ImportId',
		ImportPath: 'ImportPath',
		ExportSpecifier: 'ExportSpecifier',
	};

}

export default Format;

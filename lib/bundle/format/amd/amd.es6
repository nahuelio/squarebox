/**
*	@module bundle.format.amd
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Format from 'bundle/format/format';
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
	*	@param {Object} o - object to query
	*	@param {String} expr - json path query
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	amd(ctx, o, expr, ...args) {
		console.log('amd querying...');
		return this.query(o, expr, ...args);
	}

	/**
	*	AMD AST Query by a given type
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {astq.Node} ast ast to query
	*	@param {bundle.types.Type} type type used to query
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	amdByType(ctx, ast, type, ...args) {
		logger('amdByType querying...').out();
		return this.queryByType(ctx, ast, type, ...args);
	}

	/**
	*	ASTQ AMD Import Declaration Query
	*	@static
	*	@property QAMD_ImportDeclaration
	*	@type {String}
	**/
	static QAMD_ImportDeclaration = '// *';

	/**
	*	ASTQ AMD Import Declaration Query
	*	@static
	*	@property QAMD_ExportDeclaration
	*	@type {String}
	**/
	static QAMD_ExportDeclaration = '// *';

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

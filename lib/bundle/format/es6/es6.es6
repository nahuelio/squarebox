/**
*	@module bundle.format.es6
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Format from 'bundle/format/format';
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
	*	@param {astq.Node} ast ast to query
	*	@param {String} expr astq expression
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	es6(ctx, ast, expr, ...args) {
		console.log('es6 querying...');
		return this.query(o, expr, ...args);
	}

	/**
	*	ES6 AST Query by a given type
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {astq.Node} ast ast to query
	*	@param {bundle.types.Type} type type used to query
	*	@param {Any} [args...] additional arguments
	*	@return {Any}
	**/
	es6ByType(ctx, ast, type, ...args) {
		logger('es6ByType querying...').out();
		return this.queryByType(ctx, ast, type, ...args);
	}

	/**
	*	ASTQ ES6 Import Declaration Query
	*	@static
	*	@property QES6_ImportDeclaration
	*	@type {String}
	**/
	static QES6_ImportDeclaration = '// * [@type == "ImportDeclaration"]';

	/**
	*	ASTQ ES6 Import Identifier Query
	*	@static
	*	@property QES6_ImportIdentifier
	*	@type {String}
	**/
	static QES6_ImportIdentifier = '// * [@type == "ImportDefaultSpecifier"]';

	/**
	*	ASTQ ES6 Export Declaration Query
	*	@static
	*	@property QES6_ExportDeclaration
	*	@type {String}
	**/
	static QES6_ExportDeclaration = '// * [@type == "ExportDeclaration"]';

	/**
	*	ASTQ ES6 Export Identifier Query
	*	@static
	*	@property QES6_ExportIdentifier
	*	@type {String}
	**/
	static QES6_ExportIdentifier = '// * [@type == "ExportDefaultSpecifier"]';

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

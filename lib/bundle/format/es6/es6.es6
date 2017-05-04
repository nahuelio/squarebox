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
	*	@param {Object} o - object to query
	*	@param {String} expr - json path query
	*	@return {Any}
	**/
	es6(ctx, o, expr) {
		return this.query(o, expr);
	}

}

export default Es6;

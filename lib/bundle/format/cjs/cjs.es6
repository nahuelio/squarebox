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
	*	@return {Any}
	**/
	cjs(ctx, o, expr) {
		return this.query(o, expr);
	}

}

export default CommonJs;

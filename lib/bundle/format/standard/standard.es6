/**
*	@module bundle.format.standard
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Format from 'bundle/format/format';
import logger from 'util/logger/logger';

/**
*	Class Standard
*	@extends {bundle.format.Format}
**/
class Standard extends Format {

	/**
	*	Standard AST Query
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} o - object to query
	*	@param {String} expr - json path query
	*	@return {Any}
	**/
	standard(ctx, o, expr) {
		console.log(o, expr);
		return this.query(o, expr);
	}

}

export default Standard;

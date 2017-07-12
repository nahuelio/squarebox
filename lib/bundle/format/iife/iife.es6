/**
*	@module bundle.format.iife
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Format from 'bundle/format/format';
import logger from 'util/logger/logger';

/**
*	Class Iife
*	@extends {bundle.format.Format}
**/
class Iife extends Format {

	/**
	*	Iife AST Query
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} o - object to query
	*	@param {String} expr - json path query
	*	@return {Any}
	**/
	iife(ctx, o, expr) {
		return this.query(o, expr);
	}

}

export default Iife;

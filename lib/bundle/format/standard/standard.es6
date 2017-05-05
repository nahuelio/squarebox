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
	*	Clean Up
	*	@public
	*	@param {Array} comments list of all comments
	*	@return {Array}
	**/
	_clean(comments) {
		return _.map(comments, (comment) => _.trimSpecial(comment.value));
	}

	/**
	*	Standard AST Query
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Object} o - object to query
	*	@param {String} expr - json path query
	*	@param {Any} [...args] additional arguments
	*	@return {Any}
	**/
	standard(ctx, o, expr, ...args) {
		return this.query(ctx, o, expr, ...args);
	}

	/**
	*	Perform Search of annotations over comments in the source code
	*	@public
	*	@param {util.visitor.Visited} ctx context visited
	*	@param {Array} comments list of all comments
	*	@param {Function} predicate predicate walker
	*	@return {Object}
	**/
	search(ctx, comments = [], predicate = () => true) {
		return _.find(this._clean(comments), predicate);
	}

}

export default Standard;

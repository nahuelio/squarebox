/**
*	@module bundle.types.common
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import _s from 'underscore.string';
import Visitor from 'util/visitor/visitor';

/**
*	Class Comments
*	@extends {util.visitor.Visitor}
**/
class Comments extends Visitor {

	/**
	*	Iterates over the comments and trims comments characters from the value
	*	@private
	*	@param {Array} comments - collection of comments
	*	@return {Array}
	**/
	_clean(comments) {
		return _.map(comments, (comment) => _.trimSpecial(comment.value));
	}

	/**
	*	Perform a look up of comments and filter comments based on a given predicate
	*	@private
	*	@param {Array} comments list of all comments
	*	@param {Function} [predicate = () => false] predicate walker
	*	@return {Array}
	**/
	_search(comments = [], predicate = () => false) {
		return _.find(this._clean(comments), predicate);
	}

	/**
	*	Generic Strategy that filters and collects comments gathered from source code
	*	@public
	*	@param {bundle.types.Type} ctx type context
	*	@param {Array} [comments = []] collection of comments
	*	@param {Function} [predicate = () => false] predicate used to filter comments
	*	@return {Object}
	**/
	comments(ctx, comments = [], predicate = () => false) {
		return this._search(comments, predicate);
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'CommentsVisitor';
	}

}

export default Comments;

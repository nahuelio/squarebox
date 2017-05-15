/**
*	@module bundle.types.common
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import _s from 'underscore.string';

/**
*	Iterates over the comments and trims comments characters from the value
*	@private
*	@param {Array} comments - collection of comments
*	@return {Array}
**/
const clean = (comments) => {
	return _.map(comments, (comment) => _.trimSpecial(comment.value));
};

/**
*	Perform a look up of comments and filter comments based on a given predicate
*	@public
*	@param {Array} comments list of all comments
*	@param {Function} [predicate = () => false] predicate walker
*	@return {Array}
**/
export const search = (comments = [], predicate = () => false) => {
	return _.find(clean(comments), predicate);
};

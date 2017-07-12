/**
*	Draft
*	@version 1.0.0
*	@module bundle.format.iife
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';

/**
*	Import Template
*	@private
*	@property __it__
*	@type {Function}
**/
const __it__ = _.template(`/** <%= name %> **/
(function(<%= ids.join(', ') %>) {
	<%= content %>
})(<%= ids.join(', ') %>);`);

/**
*	Export Template
*	@private
*	@property __et__
*	@type {Function}
**/
const __et__ = _.template(``);

/**
*	Imports
*	@static
*	@param {{ name: "", dependencies: [], ids: [], content: "" }} m parameters to the template
*	@return {Function}
**/
export const imports = (attrs = {}) => {
	return __it__(extend({}, attrs));
};

/**
*	Exports
*	@static
*	@param {{ exports: {} }} attrs parameters to the template
*	@return {Function}
**/
export const exports = (attrs = {}) => {
	return __et__(extend({}, attrs));
};

/**
*	Draft
*	@version 1.0.0
*	@module bundle.format.amd
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';

/**
*	Import Template
*	@private
*	@property __it__
*	@type {Function}
**/
const __it__ = _.template(`/** <<%= name %>> **/
define(["<%= dependencies.join('", "') %>"], function(<%= ids.join(', ') %>) {
	<%= content %>
});`);

/**
*	Export Template
*	@todo Support for "Bindings" and review multiple exports
*	@private
*	@property __et__
*	@type {Function}
**/
const __et__ = _.template(`return <%= exports %>;`);

/**
*	Imports
*	@static
*	@param {{ name: "", dependencies: [], ids: [], content: "" }} attrs parameters to the template
*	@return {Function}
**/
export const imports = (attrs = {}) => { return __it__(attrs); };

/**
*	Exports
*	@static
*	@param {{ exports: {} }} attrs parameters to the template
*	@return {Function}
**/
export const exports = (attrs = {}) => { return __et__(attrs); };

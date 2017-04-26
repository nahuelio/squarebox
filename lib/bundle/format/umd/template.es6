/**
*	Draft
*	@version 1.0.0
*	@module bundle.format.umd
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
	(function(root, factory) {
		if(typeof define === 'function' && define.amd) {
			define(["<%= dependencies.join('", "') %>"], factory);
		} else if(typeof module === 'object' && module.exports) {
			module.exports = factory(<% print(_.map(dependencies, __gd__, '', this).join(', ')); %>);
		} else {
			<% print(_.reduce(ids, __gi__, '', this, dependencies)); %>
		}
	})(this, function(<%= ids.join(', ') %>) {
		<%= content %>
	});`);

/**
*	Global Dependency Ids Import
*	@private
*	@static
*	@param {Array} dependencies list of dependency paths
*	@param {String} memo memoized output
*	@param {String} id current dependency id
*	@param {Number} ix current dependency index
*	@return {String}
**/
const __gi__ = (dependencies, memo, id, ix) => {
	return (memo += `root[${id}] = root[${dependencies[ix]}];\n`);
};

/**
*	Global Dependencies Import
*	@private
*	@static
*	@param {String} dependency current dependency path
*	@return {String}
**/
const __gd__ = (dependency) => {
	return `require('${dependency}')`;
};

/**
*	Export Template
*	@private
*	@property name
*	@type {Function}
**/
const __et__ = _.template(``);

/**
*	Imports
*	@static
*	@param {{ name: "", dependencies: [], ids: [], content: "" }} m bundle metadata
*	@return {Function}
**/
export const _imports = (attrs = {}) => {
	return __it__(extend(false, {}, attrs, { __gi, __gd }));
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

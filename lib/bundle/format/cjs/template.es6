/**
*	Draft
*	@version 1.0.0
*	@module bundle.format.cjs
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';

/**
*	CommonJs Import Cases
*	---------------------
*
*	1) [let, var, const] n1 = require(path1);
*	2) n2 = require(path2);
*	3) require(path2);
*
*	CommonJs Export Cases
*	---------------------
*
*	1) module.exports = {o1};
*	2) var m = module;
*	   m.exports = {o2};
**/

/**
*	Single Import Template
*	@private
*	@property __sit__
*	@type {Function}
**/
const __sit__ = _.template(`var <%= id %> = require('<%= dependency %>');`);

/**
*	Imports Template
*	@private
*	@property __it__
*	@type {Function}
**/
const __it__ = _.template(`/** <%= name %> **/
<% print(_.reduce(dependencies, function(memo, dependency, ix) {
	memo += (__sit__({ id: ids[ix], dependency }) + '\n'); return memo;
}, '')); %>\n<%= content %>`);

/**
*	Exports Template
*	@todo Support for "bindings" and review multiple exports
*	@private
*	@property __et__
*	@type {Function}
**/
const __et__ = _.template(`module.exports = <%= exports %>`);

/**
*	Imports
*	@static
*	@param {{ name: "", dependencies: [], ids: [], content: "" }} attrs parameters to the template
*	@return {Function}
**/
export const imports = (attrs = {}) => { return it(extend({}, attrs, { _, __sit__ })); };

/**
*	Exports
*	@static
*	@param {{ exports: {} }} attrs parameters to the template
*	@return {Function}
**/
export const exports = (attrs = {}) => { return __et__(attrs); };

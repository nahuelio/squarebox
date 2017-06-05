/**
*	Draft
*	@version 1.0.0
*	@module bundle.format.es6
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';

/**
*	ES6 Import Cases:
*	@see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
*	----------------------
*
*	- import d{}
*
*	ES6 Export Cases:
*	@see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
*	----------------------
*	let o1 = { name: 'export1' },
*		o2 = { name: 'export2' },
*		o3 = { name: 'export3' };
*	const complex = { complex1: 1 };
*
*	- export { o1 };
*	- export { o2 as a2 };
*	- export let a1 = o1, a3 = o3;
*	- export { complex as default };
*
*	- export * from 'libs/amd-lib';
*	- export { i1, i2 } from 'libs/cjs-lib';
*	- export { o1 as i3, o2 as i4 } from 'libs/cjs-lib';
*
*	Extra Cases:
*	- export default complex;
*	- export default function() {}
*	- export default function func() {}
**/

/**
*	Single Import Template
*	@private
*	@property __sit__
*	@type {Function}
**/
const __sit__ = _.template(`import <%= id %> from '<%= dependency %>'`);

/**
*	Import Template
*	@private
*	@property __it__
*	@type {Function}
**/
const __it__ = _.template(`/** <%= name %> **/
<% print(_.reduce(dependencies, function(memo, dependency, ix) {
memo += (__sit__({ id: ids[ix], dependency }) + '\n'); return memo;
}, '') + <%= content %>)`);

/**
*	Exports Template
*	@todo Support for:
*		- export {export}
*		- export default {export}
*	@private
*	@property __it__
*	@type {Function}
**/
const __et__ = _.template(`export <%= export %>`);

/**
*	Imports
*	@static
*	@param {{ name: "", dependencies: [], ids: [], content: "" }} attrs parameters to the template
*	@return {Function}
**/
export const imports = (attrs = {}) => {
	return __it__(extend({}, attrs, { _, __sit__ }));
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

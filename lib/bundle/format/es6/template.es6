/**
*	Draft
*	@version 1.0.0
*	@module bundle.format.es6
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';

/**
*	Single Import Template
*	@todo Support for:
*		- import {id} from '{dependency}';
*		- import { {id1}, {id2}, {}... } from {dependency};
*		- import * as {id} from {dependency}
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

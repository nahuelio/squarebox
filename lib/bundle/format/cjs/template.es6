/**
*	@module bundle.format.cjs
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';

/**
*	Single Import
*	@static
*	@param {Array} id dependency id
*	@param {Array} dependency dependency path
*	@return {Function}
**/
export const _import = _.template(`var <%= id %> = require('<%= dependency %>');`);

/**
*	Multiple Imports
*	@static
*	@param {{ name: "", dependencies: [], ids: [], content: "" }} m bundle metadata
*	@return {Function}
**/
export const _imports = _.template(`/** <%= m.name %> **/
	${_.reduce(m.dependencies, function(memo, dependency, ix) {
		memo += (_import({ id: m.ids[ix], dependency }) + '\n'); return memo;
	}, '')}<%= m.content %>`;

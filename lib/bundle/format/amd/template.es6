/**
*	@module bundle.format.amd
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';

/**
*	Multiple Imports
*	@static
*	@param {{ name: "", dependencies: [], ids: [], content: "" }} m bundle metadata
*	@return {Function}
**/
export const _imports = _.template(`/** <%= m.name %> **/
	define([<%= m.dependencies.join(', ') %>], function(<%= m.ids.join(', ') %>) {
		<%= m.content %>
	});`);

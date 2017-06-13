/**
*	@module bundle.format.es6
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';

/**
*	Retrieves module for a given dependency module list by id. Returns null if module is not found.
*	@public
*	@param {util.adt.Collection} modules current list of dependency modules
*	@param {String} id module id to retrieve
*	@return {Object}
**/
export const get = (modules, id) => {
	if(!_.defined(id)) return true;
	return modules.findWhere({ id });
};

/**
*	Resolves Module for a given astq node if it's default import.
*	@public
*	@param {astq.Node} [node = {}] node to resolve
*	@return {Object|astq.Node}
**/
export const resolveDefault = (node = {}) => {
	return (node.local && !node.imported) ? { id: node.local.name } : node;
};

/**
*	Resolves Module for a given astq node if it's named import.
*	@public
*	@param {astq.Node} [node = {}] node to resolve
*	@return {Object|astq.Node}
**/
export const resolveAliased = (node = {}) => {
	return (node.local && node.imported) ? { id: node.imported.name, alias: node.local.name } : node;
};

/**
*	Resolves Module for a given astq node if it doesn't have named imports (default or aliased).
*	Only if module collection is empty (means no named imports has been detected).
*	@public
*	@param {util.adt.Collection} modules current list of dependency modules
*	@param {astq.Node} [node = {}] node to resolve
*	@return {Object|astq.Node}
**/
export const resolveUnnamed = (modules, node = {}) => {
	return (node.type === 'Literal' && modules.isEmpty()) ? { id: node.value } : node;
};


/**
*	Adds a new module into a given dependency module list based on current node ast.
*	@public
*	@param {util.adt.Collection} modules current list of dependency modules
*	@param {astq.Node} node current node
*	@return {util.adt.Collection}
**/
export const add = (modules, node) => {
	let _module = resolveUnnamed(modules, resolveAliased(resolveDefault(node)));
	if(!get(modules, _module.id)) modules.add(_module);
	return modules;
};

/**
*	Removes an existing module from a given dependency module list by module
*	@public
*	@param {util.adt.Collection} modules current list of dependency modules
*	@param {Object} module module to remove
*	@return {util.adt.Collection}
**/
export const remove = (modules, module) => {
	// TODO
	return modules;
};

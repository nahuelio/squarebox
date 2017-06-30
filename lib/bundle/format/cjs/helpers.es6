/**
*	@module bundle.format.cjs
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
*	Resolves Module for a given astq node if it's a named require.
*	i.e: const { version } = require('jquery');
*	@public
*	@param {astq.Node} [node = {}] node to resolve
*	@return {Object|astq.Node}
**/
export const resolveAliased = (node = {}) => {
	// TODO
	return node;
};

/**
*	Resolves Module for a given astq node if it doesn't have named require.
*	@public
*	@param {util.adt.Collection} modules current list of dependency modules
*	@param {astq.Node} [node = {}] node to resolve
*	@return {Object|astq.Node}
**/
export const resolveNamed = (modules, node = {}) => {
	return { id: (node.name ? node.name : node.arguments[0].value) };
};

/**
*	Resolve Dependency path based on a given node
*	@public
*	@param {astq.Node} [node = {}] node to resolve
*	@return {String}
**/
export const resolvePath = (node) => {
	let out = '';
	// CASE: let $ = require('jquery');
	if(node.declarations && node.declarations[0] && node.declarations[0].init)
		out = node.declarations[0].init.arguments[0].value;
	// CASE: LibB = require('dependencies/lib-b');
	if(node.expression && node.expression.right)
		out = node.expression.right.arguments[0].value;
	// CASE: require('hello');
	if(node.expression && node.expression.arguments)
		out = node.expression.arguments[0].value;
	// TODO: CASE: case const { version } = require('jquery');
	return out;
};

/**
*	Adds a new module into a given dependency module list based on current node ast.
*	@public
*	@param {util.adt.Collection} modules current list of dependency modules
*	@param {astq.Node} node current node
*	@return {util.adt.Collection}
**/
export const add = (modules, node) => {
	let _module = resolveNamed(modules, resolveAliased(node));
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

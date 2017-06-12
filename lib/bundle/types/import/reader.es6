/**
*	Import Reader Helpers
*	@module bundle.types.import
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import _s from 'underscore.string';
import extend from 'extend';
import Collection from 'util/adt/collection';

// memo.add({
// 	parent: resolveParent(),
// 	import: { id: '', path: '' },
// 	export: null,
// 	input: later,
// 	outout: null
// });

/**
*	Creates dependency
*	@public
*	@param {bundle.task.metadata.Metadata} metadata memoized metadata
*	@param {String} format current format
*	@param {astq.Node} ast current dependency ast
*	@return {util.adt.Collection}
**/
export const addDependency = (type, format, metadata, ast) => {
	let results = type.collectByElement(ast, 'ImportSpecifier');
	let dependency = metadata.dependencies.add(results.reduce(resolveImportSpecifier, {}));
	resolveParent(metadata, dependency);
	console.log(format);
	return metadata;
};

/**
*	Import Declaration Handler
*	@public
*	@param {Object} dependency memoized dependency
*	@param {astq.Node} node current astq node result
*	@param {String} format current format used
*	@return {bundle.task.metadata.Dependency}
**/
export const resolveImportSpecifier = (dependency, node, format) => {
	dependency.import = { id: '' }; // TODO
	return resolveImportPath(dependency, node, format);
};

/**
*	Resolves Dependency Parent
*	@public
*	@param {bundle.task.metadata.Metadata} metadata current metadata
*	@param {astq.Node} node current node
*	@return {bundle.task.metadata.Metadata}
**/
export const resolveParent = (metadata, dependency) => {
	let name = metadata.getName();
	return extend(false, dependency, { parent: _.defined(name) ? name : _.uuid() });
};

export const resolveAst = (dependency, node) => {
	return extend(false, dependency, { input: node });
};

/**
*	Import Identifier Declaration Handler
*	@public
*	@param {astq.Node} node ast node import declaration
*	@param {bundle.task.metadata.Dependency} current current dependency
*	@return {bundle.task.metadata.Dependency}
**/
export const resolveImportPath = (dependency, node, format) => {
	if(node.type === 'Literal') extend(false, dependency.import, { path: node.value });
	return dependency;
};

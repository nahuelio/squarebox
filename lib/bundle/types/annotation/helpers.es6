/**
*	@module bundle.types.annotation
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import _s from 'underscore.string';
import json5 from 'json5';

/**
*	Annotation name
*	@private
*	@property annotation
*	@type {String}
**/
const annotation = '@sqbox';

/**
*	Metadata Contain Matcher
*	Will return true if the metadata with a given name already exists inside the collection.
*	@public
*	@param {util.adt.Collection} collection list of bundles to perform look up
*	@param {Object} meta bundle metadata to evaluate
*	@return {Boolean}
**/
export const containsBy = (collection, meta) => {
	return _.defined(collection.find((current) => (matchPath(current, meta) && matchParams(current, meta))));
};

/**
*	Metadata Path Matcher
*	Will return true if a metadata object exists with the same path and the given path.
*	@public
*	@param {Object} current current metadata
*	@param {String} path given metadata path to compare
*	@return {Boolean}
**/
export const matchPath = (current, path) => { return (current.path === path); };

/**
*	Metadata Params Matcher
*	Will return true if a metadata object exists with the same params and the given params.
*	@public
*	@param {Object} current current metadata
*	@param {Object} params given metadata params to compare
*	@return {Boolean}
**/
export const matchParams = (current, params = {}) => {
	return _.defined(params.name) && (params.name === current.params.name);
};

/**
*	Annotation Matcher: returns true if annotation was found, false otherwise
*	@public
*	@param {String} expr annotation found to be match
*	@return {Boolean}
**/
export const match = (expr) => {
	return _s.startsWith(expr, `${annotation}(`) && _s.endsWith(expr, ')');
};

/**
*	Annotation Metadata Extraction
*	Will extract, parse and return annotation information using json5 specification
*	@public
*	@param {String} expr annotation found to be match
*	@return {Boolean}
**/
export const extract = (expr = '') => {
	return json5.parse(_s.rtrim(_s.ltrim(expr, `${annotation}(`), ')'));
};

/**
*	Returns true if the metadata extracted is valid, false otherwise
*	@public
*	@param {Object} meta annotation metadata information extracted
*	@return {Boolean}
**/
export const valid = (meta) => {
	return (_.defined(meta.name) && _.isString(meta.name) && meta.name.length > 0);
};

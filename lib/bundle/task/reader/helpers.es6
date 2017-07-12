/**
*	@module bundle.task.reader
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import fs from 'fs-extra';
import extend from 'extend';
import glob from 'glob';
import * as acorn from 'acorn';
import Collection from 'util/adt/collection';

/**
*	Default Acorn Options
*	@private
*	@property acornOptions
*	@type {Object}
**/
const acornOptions = {
	ecmaVersion: 8,
	sourceType: 'module'
};

/**
*	Default Glob Options
*	@private
*	@property globOptions
*	@type {Object}
**/
const globOptions = {
	strict: true,
	nosort: true,
	nodir: true
};

/**
*	Performs a look up over the parsed files by using the file path
*	and retrieves the file reference if it's found, returns null otherwise.
*	@private
*	@param {String|util.adt.Collection} [input = []] single path or a collection of paths
*	@return {Object}
**/
const get = (list, input = []) => {
	let paths = _.isString(input) ? Collection.new([input]) : input;
	return list.find((file) => paths.contains(file.path));
};


/**
*	Add a new file into the parsed file list
*	@public
*	@param {util.adt.Collection} list parsed file list
*	@param {String} path file path to remove
*	@param {Boolean} [skipParse = false] skip ast parsing
*	@return {util.adt.Collection}
**/
export const add = (list, path, skipParse = false) => {
	list.add(!skipParse ? parse(path, acornOptions) : path);
	return list;
};

/**
*	Remove existing parsed file from the list by path
*	@public
*	@param {util.adt.Collection} list parsed file list
*	@param {String} path file path to remove
*	@return {util.adt.Collection}
**/
export const remove = (list, path) => {
	return list.removeBy((file) => (file === path));
};

/**
*	Perform a file look up over the list of parsed files, for a given input and retrieves it when found.
*	If the file is not found, this method will add it and returns the reference.
*	@private
*	@param {util.adt.Collection} files list of parsed files
*	@param {String} input file path to resolve
*	@param {Any} [...args] additional and optional arguments
*	@return {util.adt.Collection}
**/
export const resolve = (list, input) => {
	let found = get(list, input);
	if(!_.defined(found)) add(list, input);
	return list;
};

/**
*	Read a single file by pattern or explicit path
*	@public
*	@param {String} cwd base path
*	@param {String} path path to read files from (pattern or explicit path)
*	@param {Array} [ignore = []] optional ignore list of directories/files
*	@return {util.adt.Collection}
**/
export const read = (cwd, path, ignore = []) => {
	return Collection.new(glob.sync(path, _.defaults({ cwd, ignore }, globOptions)));
};

/**
*	Retrieve a given file from the files list
*	@public
*	@param {String} path file path
*	@param {Object} [options = {}] parser options
*	@param {Array} [comments = []] comments initial array
*	@return {Object}
**/
export const parse = (path, options = {}, comments = []) => {
	let opts = extend(false, { onComment: comments }, options);
	return { path, comments, input: acorn.parse(fs.readFileSync(path, { encoding: 'utf8' }), opts) };
};

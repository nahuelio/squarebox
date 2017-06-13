/**
*	@module visitors.command
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import _s from 'underscore.string';
import path from 'path';
import Visitor from 'util/visitor/visitor';

/**
*	Class Properties
*	@extends {util.visitor.Visitor}
**/
class Properties extends Visitor {

	/**
	*	Resolve a single file or path expression realtive to the base path specified in the configuration
	*	@public
	*	@param {bundle.Command} ctx current command
	*	@param {String} input relative path to resolve
	*	@param {Boolean} [ext = false] using use extensions
	*	@return {String}
	**/
	file(ctx, input, ext = false) {
		let expr = ext ? `${input}.+(${this.extensions.join('|')})` : input;
		return path.resolve(this.basePath, input);
	}

	/**
	*	Resolve scan sources
	*	@public
	*	@param {bundle.Command} ctx current command
	*	@return {String}
	**/
	sources(ctx) {
		return this.file(ctx, this.scan, true);
	}

	/**
	*	Resolve alias for a given input path by replacing, using the alias configuration,
	*	any alias expression that match the begining of the input with final path specified.
	*	If no matches are found, the path will remain intact.
	*	@public
	*	@param {bundle.Command} ctx current command
	*	@param {String} input input path to resolve
	*	@return {String}
	**/
	aliases(ctx, input) {
		return _.reduce(this.alias, (memo, replace, alias) => {
			return _s.startsWith(memo, alias) ? _s.replaceAll(memo, alias, replace) : memo;
		}, input, this);
	}

	/**
	*	Resolve excludes
	*	@public
	*	@param {bundle.Command} ctx current command
	*	@return {Array}
	**/
	excludes(ctx) {
		return _.reduce(this.exclude, (memo, pattern) => {
			memo.push(path.resolve(this.basePath, this.scan, pattern));
			return memo;
		}, []);
	}

	/**
	*	Retrieve targets by using a given predicate passed by parameter
	*	@public
	*	@param {bundle.Command} ctx current command
	*	@param {Function} predicate - predicate to walk over the targets
	*	@return {Array}
	**/
	targets(ctx, predicate) {
		return _.defined(predicate) && _.isFunction(predicate) ? _.map(this.target, predicate, this) : [];
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'PropertiesVisitor';
	}

}

export default Properties;

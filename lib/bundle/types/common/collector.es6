/**
*	@module bundle.types.common
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import Collection from 'util/adt/collection';
import Visitor from 'util/visitor/visitor';

/**
*	Class Collector
*	@extends {util.visitor.Visitor}
**/
class Collector extends Visitor {

	/**
	*	Iterate over the list of formats and executes astq query based on the format.
	*	Will collect and flatten query results into a single list of astq result objects.
	*	@public
	*	@param {astq.Node} ast current source ast to detect
	*	@param {Array} methods list of query methods to execute
	*	@param {Any} [...args] additional arguments
	*	@return {Array}
	**/
	iterate(ast, methods, ...args) {
		return Collection.new(methods).map((method) => method(ast, ...args));
	}

	/**
	*	Generic Strategy to execute astq queries on a given list of formats.
	*	By default all the formats will be used with the following order: es6, commonjs and amd.
	*	@public
	*	@param {bundle.types.Type} ctx type context
	*	@param {astq.Node} ast current source ast to detect
	*	@param {Array} [formats = Type.formats] list formats
	*	@param {Any} [...args] additional arguments
	*	@return {Array}
	**/
	collect(ctx, ast, formats = Type.formats, ...args) {
		return this.iterate(ast, this.formatsByName(formats, ctx), ...args);
	}

	/**
	*	Filter Formats by Name
	*	@public
	*	@param {Array} [formats = []] list of formats to filter
	*	@param {bundle.types.Type} ctx type context
	*	@return {Array}
	**/
	formatsByName(formats = [], ctx) {
		return _.filter(formats, (format) => { return !_.defined(ctx[format]); });
	}

	/**
	*	Generic Strategy to execute astq queries on a given list of formats and type of ast element
	*	By default all the formats will be used with the following order: es6, commonjs and amd.
	*	@public
	*	@param {bundle.types.Type} ctx type context
	*	@param {astq.Node} ast current source ast to detect
	*	@param {Array} [formats = Type.formats] list formats
	*	@param {Any} [...args] additional arguments
	*	@return {Array}
	**/
	collectByType(ctx, ast, formats = Type.formats, ...args) {
		return this.iterate(ast, this.formatsByType(formats, ctx), ...args);
	}

	/**
	*	Filter Formats by Type
	*	@public
	*	@param {Array} [formats = []] list of formats
	*	@param {bundle.types.Type} ctx type context
	*	@return {Array}
	**/
	formatsByType(formats = [], ctx) {
		return _.chain(formats).map((format) => {
			let method = `${format}ByType`;
			return _.defined(ctx[method]) ? ctx[method] : null;
		}).compact().value();
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'CollectorVisitor';
	}

}

export default Collector;

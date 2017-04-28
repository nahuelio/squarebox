/**
*	@module visitors.command
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import path from 'path';
import Visitor from 'util/visitor/visitor';

/**
*	Class Properties
*	@extends {util.visitor.Visitor}
**/
class Properties extends Visitor {

	/**
	*	Resolve scan sources
	*	@public
	*	@return {String}
	**/
	sources() {
		return path.resolve(`${this.scan}/**/*+(${this.extensions.join('|')})`);
	}

	/**
	*	Resolve excludes
	*	@public
	*	@return {Array}
	**/
	excludes() {
		return _.reduce(this.exclude, (memo, pattern) => {
			memo.push(path.resolve(this.scan, pattern));
			return memo;
		}, []);
	}

	/**
	*	Retrieve targets by using a given predicate passed by parameter
	*	@public
	*	@param {Function} predicate - predicate to walk over the targets
	*	@return {Array}
	**/
	targets(predicate) {
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

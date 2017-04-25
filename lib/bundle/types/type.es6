/**
*	@module bundle.types
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Visited from 'util/visitor/visited';
import logger from 'util/logger/logger';

/**
*	Class Type
*	@extends {util.visitor.Visited}
**/
class Type extends Visited {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param {bundle.Operator} type - TDB
	*	@return {bundle.types.Type}
	**/
	constructor(type) {
		return super({ type });
	}

	/**
	*	Asynchronous next strategy
	*	@public
	*	@method next
	*	@param adt {visitors.async.Asynchronous} adt used for asynchronous operations
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@return {Promise}
	**/
	next(adt, resolve, reject) {
		if(_.defined(this.type.read)) return this.read(resolve, reject);
		if(_.defined(this.type.write)) return this.write(resolve, reject);
	}

	/**
	*	Default Read strategy
	*	@public
	*	@method read
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@return {Promise}
	**/
	read(resolve, reject) {
		return resolve(this);
	}

	/**
	*	Default  Write strategy
	*	@public
	*	@method write
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@return {Promise}
	**/
	write(resolve, reject) {
		return resolve(this);
	}

}

export default Type;

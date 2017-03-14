/**
*	@module visitors.configuration
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Visited from 'util/visitor/visited';

/**
*	Class Local
*	@extends {util.visitor.Visited}
*
*	@uses {visitors.async.Asynchronous}
**/
class Local extends Visited {

	/**
	*	Constructor
	*	@public
	*	@param {visitors.Configuration} configuration - configuration reference
	*	@param {Object} options - command options
	*	@return {visitors.configuration.Local}
	**/
	constructor(configuration, options) {
		return super();
	}

	/**
	*	Asynchronous next strategy
	*	@public
	*	@override
	*	@param adt {util.proxy.Asynchronous} adt used for asynchronous operations
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@return {Promise}
	**/
	next(adt, resolve, reject) {
		// TODO
		return resolve();
	}

	/**
	*	Local options
	*	@static
	*	@type {Array}
	**/
	static options = [
		'config',
		'source-scan',
		'source-extensions',
		'source-alias',
		'target-destination',
		'target-format'
	];

}

export default Local;

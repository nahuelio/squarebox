/**
*	@module visitors.configuration
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
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
		return super({ configuration, options });
	}

	/**
	*	Returns true if local configuration exists, false otherwise
	*	@public
	*	@param {String} path - path to local configuration
	*	@return {Boolean}
	**/
	exists() {
		return true;
	}

	/**
	*	Load local configuration file
	*	@public
	*	@param {String} name - file name
	*	@return {Object}
	**/
	load(name) {
		// TODO
		console.log('Local.load()...');
		return true;
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
		return resolve(this.load());
	}

}

export default Local;

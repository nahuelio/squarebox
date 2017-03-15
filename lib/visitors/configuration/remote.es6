/**
*	@module visitors.configuration
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import request from 'request';
import Visited from 'util/visitor/visited';

/**
*	Class Remote
*	@extends {util.visitor.Visited}
*
*	@uses {visitors.async.Asynchronous}
**/
class Remote extends Visited {

	/**
	*	Constructor
	*	@public
	*	@param {visitors.Configuration} configuration - configuration reference
	*	@param {Object} options - command options
	*	@return {visitors.configuration.Remote}
	**/
	constructor(configuration, options) {
		return super({ configuration, options });
	}

	/**
	*	Load remote configuration file
	*	@public
	*	@param {String} name - file name
	*	@return {Object}
	**/
	load(name) {
		// TODO
		console.log('Remote.load()...');
		return this.emit(Remote.events.load, true);
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
		this.once(Remote.events.load, resolve);
		return this.load();
	}

	/**
	*	Remote Events
	*	@static
	*	@type {Object}
	**/
	static events = {
		/**
		*	@event load
		**/
		load: 'visitors:configuration:remote:load'
	}

}

export default Remote;

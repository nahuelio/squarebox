/**
*	@module visitors.configuration
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import request from 'request-promise';
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
	*	@param {Command} command - command reference
	*	@return {visitors.configuration.Remote}
	**/
	constructor(command) {
		return super({ command });
	}

	/**
	*	Load remote configuration file from url
	*	@public
	*	@param {String} url - url to load remote configuration from
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@return {Promise}
	**/
	load(url, resolve, reject) {
		return request.get(url, { json: true })
			.then(_.bind(this.onResponse, this, resolve, reject))
			.catch(_.bind(this.onResponseError, this, resolve, reject));
	}

	/**
	*	Remote Response Success
	*	@public
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@param {Object} response - request response
	*	@return {visitors.configuration.Remote}
	**/
	onResponse(resolve, reject, response) {
		return resolve(response);
	}

	/**
	*	Remote Response Error
	*	@public
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@param {Object} err - response error
	*	@return {Object}
	**/
	onResponseError(resolve, reject, err) {
		return resolve({ warn: Remote.messages.error({ err }) });
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
		const { url } = this.command.getOptions();
		return _.defined(url) ?
			this.load(url, resolve, reject) :
			resolve({ warn: Remote.messages.noUrl });
	}

	/**
	*	Remote Configuration Messages
	*	@static
	*	@type {Object}
	**/
	static messages = {
		noUrl: `No Url specified`,
		error: _.template(`Remote Url Error - <%= err %>`)
	}

}

export default Remote;

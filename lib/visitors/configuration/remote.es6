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
	*	@param {Command} command - command reference
	*	@param {Object} options - command options
	*	@return {visitors.configuration.Remote}
	**/
	constructor(command, options) {
		return super({ command, options });
	}

	/**
	*	Load remote configuration file from url
	*	@public
	*	@param {String} url - url
	*	@return {Object}
	**/
	load(url) {
		request(url, _.bind(this.onLoad, this));
		return this;
	}

	/**
	*	Remote Load Handler
	*	@public
	*	@param {Error} [err] - request error
	*	@param {Object} response - request response reference
	*	@param {String} body - request error
	*	@return {Boolean}
	**/
	onLoad(err, response, body) {
		let output = {};
		try {
			if(_.defined(err))
				return this.out({ warn: Remote.messages.error({ warn: err }) });
			if(response.statusCode !== 200)
				return this.out({ warn: Remote.messages.error({ warn: response.statusCode }) });
			this.out(JSON.parse(body));
		} catch(ex) {
			// logger.debug();
			this.out({ warn: (Remote.messages.invalid + ' - ' + ex.message) });
		}
	}

	/**
	*	Result Output
	*	@public
	*	@param {Object} output - output to dispatch
	*	@return {Boolean}
	**/
	out(output) {
		return this.emit(Remote.events.load, output);
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
		const { url } = this.options;
		this.once(Remote.events.load, resolve);
		return _.defined(url) ? this.load(url) : this.out(null);
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

	/**
	*	Remote Configuration Messages
	*	@static
	*	@type {Object}
	**/
	static messages = {
		error: _.template(`Remote Configuration - <%= warn %>`),
		invalid: `Invalid JSON format`
	}

}

export default Remote;

/**
*	@module visitors.configuration
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import fs from 'fs-extra';
import { resolve } from 'path';
import _ from 'util/mixins';
import extend from 'extend';
import Visited from 'util/visitor/visited';
import logger from 'util/logger/logger';

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
	*	@param {Command} command - command reference
	*	@return {visitors.configuration.Local}
	**/
	constructor(command) {
		return super({ command });
	}

	/**
	*	Resolves absolute path to a given file
	*	@public
	*	@param {String} file - file name to evaluate
	*	@return {String}
	**/
	resolvePath(file) {
		return resolve(this.command.cwd, file);
	}

	/**
	*	Returns true if local configuration exists, false otherwise
	*	@public
	*	@param {String} file - file name to evaluate
	*	@return {Boolean}
	**/
	exists(file) {
		try {
			return _.defined(file) && _.defined(fs.statSync(file));
		} catch(ex) {
			logger(`LocalConfiguration: ${ex.message}`).debug({}, logger.yellow);
			return false;
		}
	}

	/**
	*	Will try to open configuration as a json
	*	@public
	*	@param {String} path - resolved path to configuration
	*	@return {Object}
	**/
	tryJson(path) {
		try {
			return fs.readJsonSync(path);
		} catch(ex) {
			logger(`LocalConfiguration: ${ex.message}`).debug({}, logger.yellow);
			return null;
		}
	}

	/**
	*	Will try to open configuration as javascript via module.exports
	*	@public
	*	@param {String} path - resolved path to configuration
	*	@return {Object}
	**/
	tryJs(path) {
		try {
			return require(path);
		} catch(ex) {
			logger(`LocalConfiguration: ${ex.message}`).debug({}, logger.yellow);
			return null;
		}
	}

	/**
	*	Outputs a warn message and returns the object
	*	@public
	*	@param {String} message - warning message
	*	@return {Object}
	**/
	warn(warn) {
		logger(warn).debug({}, logger.yellow);
		return { warn };
	}

	/**
	*	Load local configuration file
	*	@public
	*	@param {String} name - file name
	*	@return {Object}
	**/
	load(name) {
		let file = this.resolvePath(name), output = '';
		if(!this.exists(file)) return this.warn(Local.messages.notFound);
		if(!(output = (this.tryJson(file) || this.tryJs(file)))) return this.warn(Local.messages.invalid);
		return output;
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
		const { config } = this.command.getOptions();
		return resolve(this.load(config));
	}

	/**
	*	Local Configuration Messages
	*	@static
	*	@type {Object}
	**/
	static messages = {
		notFound: `Local configuration not found`,
		invalid: `Local configuration: sqbox file is invalid`
	}

}

export default Local;

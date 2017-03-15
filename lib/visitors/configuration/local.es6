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
	*	@param {Object} options - command options
	*	@return {visitors.configuration.Local}
	**/
	constructor(command, options) {
		return super({ command, options });
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
			// TODO: logger.debug();
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
			// TODO: logger.debug();
			return null;
		}
	}

	/**
	*	Will try to open configuration as javascript via module.export
	*	@public
	*	@param {String} path - resolved path to configuration
	*	@return {Object}
	**/
	tryJs(path) {
		try {
			return eval(fs.readFileSync(path, { encoding: 'utf8' }).toString());
		} catch(ex) {
			// TODO: logger.debug();
			return null;
		}
	}

	/**
	*	Load local configuration file
	*	@public
	*	@param {String} name - file name
	*	@return {Object}
	**/
	load(name) {
		let file = this.resolvePath(name), output = '';
		if(this.exists(file) && (output = (this.tryJson(file) || this.tryJs(file)))) return output;
		// logger.debug()
		return { warn: Local.messages.notFound };
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
		const { config } = this.options;
		return resolve(this.load(config));
	}

	/**
	*	Local Configuration Messages
	*	@static
	*	@type {Object}
	**/
	static messages = {
		notFound: `Local configuration not found`
	}

}

export default Local;

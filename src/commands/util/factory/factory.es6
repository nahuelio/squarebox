/**
*	@module commands.util.factory
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'commands/util/mixins';
import fs from 'fs-extra';
import path, { resolve } from 'path';
import extend from 'extend';
import { EventEmitter } from 'events';
import logger from 'commands/util/logger/logger';

/**
*	Class Factory
*	@extends {events.EventEmitter}
**/
class Factory extends EventEmitter {

	/**
	*	Constructor
	*	@public
	*	@param {Object} [attrs = {}] - constructor attributes
	*	@return {commands.util.factory.Factory}
	**/
	constructor(attrs = {}) {
		super();
		return extend(true, this, attrs, { _factories: new Map() }).basePath();
	}

	/**
	*	Sets a base path
	*	@public
	*	@param {String} [ph = Factory.basePath] - base path to resolve factories filepaths
	*	@return {commands.util.factory.Factory}
	**/
	basePath(ph = Factory.basePath) {
		this.path = ph;
		return this;
	}

	/**
	*	Resolves path to factory class file
	*	@private
	*	@param {String} ph - path to resolve
	*	@return {String}
	**/
	_resolve(ph) {
		return resolve(this.path, ph);
	}

	/**
	*	Validates factory path to file
	*	@private
	*	@param {String} ph - path to registered factory
	*	@return {Boolean}
	**/
	_validate(ph) {
		try {
			return (_.defined(ph) && _.isString(ph) && ph.length > 0 && _.defined(require.resolve(this._resolve(ph))));
		} catch(ex) {
			logger(`${this.toString()} > [ERROR-CODE] ${ex.code}`).out({}, logger.white);
			logger(ex.message).warn(logger);
			return false;
		}
	}

	/**
	*	Resolves which factory class constructor to use for instanciation
	*	If a static new method is detected on the factory, this will be used.
	*	If no static new method is detected and the constructor is a function, operator new will be used.
	*	Finally, if the factory is not a Function, this method will return it verbatim (no arguments will be passed).
	*	@private
	*	@param {Any} o - factory object
	*	@param {Any} [...args] - constructor factory arguments
	*	@return {Any}
	**/
	_new(o, ...args) {
		if(_.isFunction(o)) return _.defined(o.new) ? o.new(...args) : new o(...args);
		return o;
	}

	/**
	*	Perform a look up and retrieves the first factory matching the path. Returns null otherwise
	*	@public
	*	@param {String} [ph = ''] - path to registered factory
	*	@return {Any}
	**/
	find(ph = '') {
		for(let [k, v] of this._factories.entries())
			if(k === ph) return v;
		return null;
	}

	/**
	*	Returns true if the given path was registered previously, false otherwise
	*	@public
	*	@param {String} ph - path to registered factory
	*	@return {Boolean}
	**/
	exists(ph) {
		if(!_.defined(ph)) return false;
		return this._factories.has(ph);
	}

	/**
	*	Registers a single factory object with a given path, if it haven't been registered before.
	*	@public
	*	@param {String} ph - factory path location
	*	@return {commands.util.factory.Factory}
	**/
	register(ph) {
		if(this._validate(ph) && !this.exists(ph)) this._factories.set(ph, this._resolve(ph));
		return this;
	}

	/**
	*	Registers a list of factory objects with a given path list, if they haven't been registered before.
	*	@public
	*	@param {Array} [paths = []] - factory path locations
	*	@return {commands.util.factory.Factory}
	**/
	registerAll(paths = []) {
		_.each(paths, this.register, this);
		return this;
	}

	/**
	*	Unregisters a single factory object with a given path, if it have been registered before.
	*	@public
	*	@param {String} ph - factory path location
	*	@return {commands.util.factory.Factory}
	**/
	unregister(ph) {
		if(this.exists(ph)) this._factories.delete(ph);
		return this;
	}

	/**
	*	Unregisters a list of factory objects with a given path list, if they have been registered before.
	*	@public
	*	@param {Array} [paths = []] - factory path locations
	*	@return {commands.util.factory.Factory}
	**/
	unregisterAll(paths = []) {
		_.each(paths, this.unregister, this);
		return this;
	}

	/**
	*	Obtain a new instance of the factory, by optionally passing arguments to the constructor.
	*	If the factory is not found, returns null.
	*	@public
	*	@param {String} ph - registred factory path
	*	@param {Any} [...args] - factory constructor arguments
	*	@return {Any}
	**/
	get(ph, ...args) {
		return this.exists(ph) ? this._new(require(this.find(ph)).default, ...args) : null;
	}

	/**
	*	String representation of this class
	*	@public
	*	@override
	*	@return {String}
	**/
	toString() {
		return this.constructor.name;
	}

	/**
	*	Factory Defaults
	*	@static
	*	@type {Object}
	**/
	static basePath = process.cwd();

	/**
	*	Static Constructor
	*	@static
	*	@param {Any} [...args] - constructor arguments
	*	@return {commands.util.factory.Factory}
	**/
	static new(...args) {
		return new this(...args);
	}

}

export default Factory.new();

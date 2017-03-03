/**
*	@module commands.util.exception.proxy
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Exception from '../exception';

/**
*	Class InterfaceException
*	@extends {commands.util.exception.Exception}
**/
export default class InterfaceException extends Exception {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param [...args] {Any} constructor attribute
	*	@return {commands.util.exception.proxy.InterfaceException}
	**/
	constructor(...args) {
		super(...args);
		this.name = 'InterfaceException';
		return this;
	}

	/**
	*	Command Exception types
	*	@public
	*	@type {Object}
	**/
	static type = extend(true, {}, Exception.type, {
		proxy: _.template(`Proxies require a 'target' in which their interface operates on`)
	});

}

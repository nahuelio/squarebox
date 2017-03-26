/**
*	@module util.exception.proxy
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Exception from 'util/exception/exception';

/**
*	Class InterfaceException
*	@extends {util.exception.Exception}
**/
class InterfaceException extends Exception {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param [...args] {Any} constructor attribute
	*	@return {util.exception.proxy.InterfaceException}
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
		proxy: _.template(`Proxies require a 'target' in which their interface operates on`),
		interface: _.template(`Instance is required to implement [<%= name %>]`)
	});

}

export default InterfaceException;

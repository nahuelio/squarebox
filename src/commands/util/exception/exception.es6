/**
*	@module commands.util.exception
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Logger from '../logger/logger';

/**
*	Class Exception
*	@extends {Error}
**/
export default class Exception extends Error {

	/**
	*	Constructor
	*	@public
	*	@param [args = { type: 'unknown' }] {Object} constructor attribute
	**/
	constructor(args = { type: 'unknown' }) {
		super({ message: Command.type[args.type] });
		return extend(true, this, _.pick(args, 'level'));
	}

	/**
	*	Exception Message
	*	@public
	*	@type {String}
	**/
	get message() {
		// TODO
	}

	/**
	*	Command Exception types
	*	@public
	*	@type {Object}
	**/
	static type = {
		unknown: _.template('Unknown Exception')
	}

	/**
	*	@static
	*	@param [...args] {Any}
	**/
	static new(...args) {
		return new this(...args);
	}

}

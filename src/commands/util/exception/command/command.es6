/**
*	@module commands.util.exception.command
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Exception from '../exception';

/**
*	Class CommandException
*	@extends {commands.util.exception.Exception}
**/
export default class CommandException extends Exception {

	/**
	*	Command Exception types
	*	@public
	*	@type {Object}
	**/
	static type = extend(true, Exception.type, {
		chain: _.template('Required parameter `command` to be an instance of `commands.Command`')
	});

}

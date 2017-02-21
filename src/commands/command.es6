/**
*	@module commands
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { EventEmitter } from 'events';
import extend from 'extend';

/**
*	Class Command
*	@extends events.EventEmitter
**/
export default class Command extends EventEmitter {

	/**
	*	Constructor
	*	@public
	*	@param [args = {}] {Object} Constructor arguments
	*	@return commands.Command
	**/
	constructor(args) {
		super();
		return extend(true, this);
	}

	/**
	*	Static Constructor
	*	@static
	*	@return commands.Command
	**/
	static new() {
		return new this();
	}

}

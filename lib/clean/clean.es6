/**
*	@module clean
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Command from 'command';

/**
*	Class Clean
*	@extends {Command}
**/
class Clean extends Command {

	/**
	*	Run
	*	@public
	*	@override
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@return {clean.Clean}
	**/
	run(resolve, reject) {
		return super.run(resolve, reject);
	}

	/**
	*	List of commands that depends on
	*	@static
	*	@property dependsOn
	*	@type {Array}
	**/
	static dependsOn = Command.dependsOn.concat([]);

}

export default Clean;

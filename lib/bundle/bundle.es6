/**
*	@module bundle
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Command from 'command';
import Factory from 'util/factory/factory';

/**
*	Class Bundle
*	@extends {Command}
**/
class Bundle extends Command {

	/**
	*	Before Run
	*	@public
	*	@override
	*	@return {Promise}
	**/
	before() {
		super.before();
		// TODO: Set Reader/Writer up
		return this;
	}

	/**
	*	Run
	*	@public
	*	@override
	*	@param resolve {Function} asynchronous promise's resolve
	*	@param reject {Function} asynchronous promise's reject
	*	@return {bundle.Bundle}
	**/
	run(resolve, reject) {
		return super.run();
	}

	/**
	*	List of commands that depends on
	*	@static
	*	@property dependsOn
	*	@type {Array}
	**/
	static dependsOn = Command.dependsOn.concat([
		'clean/clean'
	]);

	/**
	*	Bundle Command Visitors
	*	@static
	*	@override
	*	@type {Array}
	**/
	// static visitors = [
	// 	'bundle/reader/reader',
	// 	'bundle/writer/writer'
	// ].concat(Command.visitors);

}

export default Bundle;

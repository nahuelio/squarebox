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
	*	Run
	*	@public
	*	@override
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@return {bundle.Bundle}
	**/
	run(resolve, reject) {
		Promise.all([this.read(), this.write()])
			.then(_.bind(this.after, this))
			.catch(_.bind(this.after, this));
		return this;
	}

	/**
	*	After Run
	*	@public
	*	@override
	*	@param {Array|Error} result result reference
	*	@return {bundle.Bundle}
	**/
	after(result) {
		if(_.instanceOf(result, Error)) return this.emit(Command.events.error, result);
		return this.done();
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
	*	List of visitors
	*	@static
	*	@override
	*	@type {Array}
	**/
	static visitors = Command.visitors.concat([
		'bundle/task/reader/reader',
		'bundle/task/writer/writer'
	]);

}

export default Bundle;

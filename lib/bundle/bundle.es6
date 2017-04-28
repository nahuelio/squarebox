/**
*	@module bundle
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import Collection from 'util/adt/collection';
import Command from 'command';
import Metadata from 'bundle/task/metadata/metadata';
import Factory from 'util/factory/factory';

/**
*	Class Bundle
*	@extends {Command}
**/
class Bundle extends Command {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param {Object} [args = {}] constructor attributes
	*	@return {bundle.Bundle}
	**/
	constructor(args = {}) {
		return super(extend(true, args, { bundles: Collection.new([], { interface: Metadata }) }));
	}

	/**
	*	Run
	*	@public
	*	@override
	*	@param {Function} resolve asynchronous promise's resolve
	*	@param {Function} reject asynchronous promise's reject
	*	@return {bundle.Bundle}
	**/
	run(resolve, reject) {
		this.before().actions()
			.then(_.bind(this.after, this))
			.catch(_.bind(this.after, this));
		return this;
	}

	/**
	*	Asynchronous Actions Run
	*	@public
	*	@return {Promise}
	**/
	actions() {
		return _.reduce([this.read, this.write], this.action, Promise.resolve());
	}

	/**
	*	Action Run
	*	@public
	*	@param {Promise} memo memoized promise that chains asynchronous actions synchronously
	*	@param {Function} action current asynchronous action
	*	@return {Promise}
	**/
	action(memo, action) {
		return memo.then(action);
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
	*	@override
	*	@type {Array}
	**/
	static dependsOn = Command.dependsOn.concat([
		'clean/clean'
	]);

	/**
	*	Command options
	*	@static
	*	@override
	*	@type {Array}
	**/
	static options = Command.options.concat([
		'bundles',
		'sources',
		'excludes',
		'targets'
	]);

	/**
	*	List of visitors
	*	@static
	*	@override
	*	@type {util.adt.Collection}
	**/
	static visitors = Collection.new(Command.visitors.toJSON().concat([
		'bundle/task/reader/reader',
		'bundle/task/writer/writer'
	]));

}

export default Bundle;

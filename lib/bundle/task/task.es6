/**
*	@module bundle.task
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import Collection from 'util/adt/collection';
import StackAsync from 'util/adt/stack-async';
import Factory from 'util/factory/factory';
import Visitor from 'util/visitor/visitor';
import logger from 'util/logger/logger';

/**
*	Class Task
*	@extends {util.visitor.Visitor}
**/
class Task extends Visitor {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param {bundle.Bundle} bundle Bundle command reference
	*	@return {bundle.task.Task}
	**/
	constructor(bundle) {
		super(extend(_.pick(bundle, bundle.constructor.options), { types: StackAsync.new([]) }));
		return this.attachEvents().registerAll();
	}

	/**
	*	Attach Events
	*	@public
	*	@return {bundle.task.Task}
	**/
	attachEvents() {
		this.types.on(StackAsync.events.next, _.bind(this.onType, this));
		return this;
	}

	/**
	*	Registers and load all types for this task
	*	@public
	*	@return {bundle.task.Task}
	**/
	registerAll() {
		return this.constructor.types.reduce(this.register, this, this);
	}

	/**
	*	Register and load a signle type for this task
	*	@public
	*	@param {bundle.task.Task} memo memoized reference of this task
	*	@param {String} path current type path to the factory
	*	@return {bundle.task.Task}
	**/
	register(memo, path) {
		memo.types.push(Factory.register(path).get(path, this));
		return memo;
	}

	/**
	*	Default Type execution Handler
	*	@public
	*	@param {String} [eventName = Task.events.execute] event name to emit
	*	@return {bundle.task}
	**/
	onType(eventName = Task.events.execute) {
		this.emit(eventName, this);
		return this;
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'TaskVisitor';
	}

	/**
	*	Supported Types
	*	@static
	*	@property types
	*	@type {util.adt.Collection}
	**/
	static types = Collection.new([
		'bundle/types/export/export',
		'bundle/types/import/import',
		'bundle/types/annotation/annotation'
	]);

	/**
	*	Events
	*	@static
	*	@property events
	*	@type {Object}
	**/
	static events = {

		/**
		*	@event execute
		**/
		execute: 'bundle:task:execute'

	};

}

export default Task;

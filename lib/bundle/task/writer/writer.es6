/**
*	@module bundle.writer
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import StackAsync from 'util/adt/stack-async';
import Task from 'bundle/task/task';

/**
*	Class Writer
*	@desc
*		Responsible for writing bundle files with dependency information gathered from a Reader source.
*	@extends {bundle.task.Task}
**/
class Writer extends Task {

	/**
	*	Write Strategy
	*	@public
	*	@param {util.visitor.Visited} vi - visited instance reference
	*	@return {Promise}
	**/
	write(vi) {
		return this.types.pop({}, false, this);
	}

	/**
	*	Type execution Handler
	*	@public
	*	@override
	*	@param {String} [eventName = Task.events.execute] event name to emit
	*	@return {bundle.task}
	**/
	onType(eventName = Task.events.execute) {
		this.emit(Writer.events.write, this);
		return this;
	}

	/**
	*	Retrieves Task Name
	*	@public
	*	@return {String}
	**/
	getName() {
		return 'write';
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'Writer';
	}

	/**
	*	Events
	*	@static
	*	@property events
	*	@type {Object}
	**/
	static events = {

		/**
		*	@event write
		**/
		write: 'bundle:task:writer:write'

	};

}

export default Writer;

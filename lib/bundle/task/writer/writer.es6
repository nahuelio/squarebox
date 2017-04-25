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
		return this.types.on(StackAsync.events.next, _.bind(this.onType, this, Writer.events.write)).pop();
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'WriterVisitor';
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

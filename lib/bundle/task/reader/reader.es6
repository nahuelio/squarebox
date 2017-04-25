/**
*	@module bundle.reader
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import minimatch from 'minimatch';
import StackAsync from 'util/adt/stack-async';
import Task from 'bundle/task/task';

/**
*	Class Reader
*	@desc
*		Responsible for traversing javascript files from directories and subdirectories to build an AST
*		representation in order to query for AST elements and apply transformation.
*	@extends {bundle.task.Task}
**/
class Reader extends Task {

	/**
	*	Read Strategy
	*	@public
	*	@param {util.visitor.Visited} vi - visited instance reference
	*	@return {Promise}
	**/
	read(vi) {
		return this.types.on(StackAsync.events.next, _.bind(this.onType, this, Reader.events.read)).pop();
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'ReaderVisitor';
	}

	/**
	*	Events
	*	@static
	*	@property events
	*	@type {Object}
	**/
	static events = {

		/**
		*	@event read
		**/
		read: 'bundle:task:reader:read'

	};

}

export default Reader;

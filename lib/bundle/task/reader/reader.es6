/**
*	@module bundle.task.reader
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import fs from 'fs-extra';
import path from 'path';
import extend from 'extend';
import glob from 'glob';
import acorn from 'acorn';
import Collection from 'util/adt/collection';
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
		// TODO: read => acorn => Metadata.new()
		this.bundles.addAll(this.files().reduce(this.parse, [], this));
		return this.types.pop();
	}

	/**
	*	File Parsing Strategy
	*	@public
	*	@param {Array} memo memoized array that will hold metadata found
	*	@param {String} file file path to parse
	*	@return {bundle.task.reader.Reader}
	**/
	parse(memo, file) {
		//console.log('File: ', file);
		return {};
	}

	/**
	*	Retrieves Files
	*	@public
	*	@return {util.adt.Collection}
	**/
	files() {
		return Collection.new(glob.sync(this.sources(), _.defaults({
			cwd: this.cwd,
			ignore: this.excludes()
		}, Reader.globOptions)));
	}

	/**
	*	Type execution Handler
	*	@public
	*	@override
	*	@param {String} [eventName = Task.events.execute] event name to emit
	*	@return {bundle.task.reader.Reader}
	**/
	onType(eventName = Task.events.execute) {
		this.emit(Reader.events.read, this);
		return this;
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
	*	Glob Options
	*	@public
	*	@property globOptions
	*	@type {Object}
	**/
	static globOptions = {
		strict: true,
		nosort: true,
		nodir: true
	};

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

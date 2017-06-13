/**
*	@module bundle.task.reader
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import fs from 'fs-extra';
import path from 'path';
import extend from 'extend';
import glob from 'glob';
import * as acorn from 'acorn';
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
	*	Switch parameters
	*	@public
	*	@param {util.visitor.Visited} vi - visited instance reference
	*	@return {Promise}
	**/
	read(vi) {
		return this.types.pop({}, false, this);
	}

	/**
	*	Retrieves files metadata
	*	@public
	*	@return {util.adt.Collection}
	**/
	files() {
		if(_.defined(this.parsedFiles)) return this.parsedFiles;
		extend(false, this, { parsedFiles: this.readFiles().reduce(this.add, Collection.new(), this) });
		return this.parsedFiles;
	}

	/**
	*	File Parsing Strategy
	*	@public
	*	@param {util.adt.Collection} memo memoized collection that will hold metadata found
	*	@param {String} path file path to parse
	*	@return {bundle.task.reader.Reader}
	**/
	add(memo, path) {
		let comments = [], input = this.parse(path, extend(false, { onComment: comments }, Reader.acornOptions));
		memo.add({ path, input, comments });
		return memo;
	}

	/**
	*	Retrieve parsed file (if it was already parsed), returns null otherwise
	*	@public
	*	@param {String} input input file path
	*	@return {Object}
	**/
	get(input) {
		let file = this.parsedFiles.findWhere({ path: this.file(input, true) });
		//console.log(this.parsedFiles);
		return file; // (`Found: ${input} -> ` + _.defined(file));
	}

	/**
	*	Acorn Parsing Strategy
	*	@public
	*	@param {String} source file path to parse
	*	@return {Object}
	**/
	parse(source, ...args) {
		return acorn.parse(fs.readFileSync(source, { encoding: 'utf8' }), ...args);
	}

	/**
	*	Read Files
	*	@public
	*	@return {util.adt.Collection}
	**/
	readFiles() {
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
	*	Retrieves Task Name
	*	@public
	*	@return {String}
	**/
	getName() {
		return 'read';
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'Reader';
	}

	/**
	*	Default Glob Options
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
	*	Default Acorn Options
	*	@static
	*	@property acornOptions
	*	@type {Object}
	**/
	static acornOptions = {
		ecmaVersion: 8,
		sourceType: 'module'
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

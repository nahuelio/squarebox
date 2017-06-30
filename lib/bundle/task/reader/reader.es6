/**
*	@module bundle.task.reader
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import * as Helpers from 'bundle/task/reader/helpers';
import Collection from 'util/adt/collection';
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
		return this.all(this.scan).types.pop({}, false, this);
	}

	/**
	*	Read and parse all files by an optional resolver function.
	*	If no custom resolver is provided, the default resolver will be used.
	*	@public
	*	@param {String} pattern source pattern to read file/s from
	*	@param {Function} [resolver = this.helper.resolve] resolver function that manipulates parsed files
	*	@return {bundle.task.reader.Reader}
	**/
	all(pattern, resolver = this.helper.resolve) {
		let readFiles = this.helper.read(this.cwd, this.file(pattern, true), this.excludes())
		readFiles.reduce(resolver, this.externals(path));
		return this;
	}

	/**
	*	Filter parsed files by path
	*	@public
	*	@param {String} path file path
	*	@return {Array}
	**/
	allByPath(path) {
		return Collection.new(this.files.filter((file) => file.path.indexOf(path) !== -1));
	}

	/**
	*	Resolve pattern with external configuration.
	*	If a pattern matches an external dependency,
	*	it will be added to the collection with the flag external set to true.
	*	@public
	*	@param {util.adt.Collection} files list of files read
	*	@param {String} path source pattern/path to resolve
	*	@return {String}
	**/
	externals(path) {
		if(_.contains(this.external, path)) this.helper.add(this.files, { path, external: true }, true);
		return this.files;
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
	*	Reader's Helper
	*	@public
	*	@type {bundle.task.reader.helpers}
	**/
	get helper() {
		return Helpers;
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

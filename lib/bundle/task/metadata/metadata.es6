/**
*	@module bundle.task.metadata
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'util/mixins';
import extend from 'extend';
import { EventEmitter } from 'events';
import Collection from 'util/adt/collection';
import Bundle from 'bundle/task/metadata/bundle';
import File from 'bundle/task/metadata/file';

/**
*	Class Metadata
*	@version 1.0.0
*	@extends {events.EventEmitter}
*
*	@desc
*		This is the general ADT used by squarebox to perform operations on it, as a result of collecting metadata
*		by the AST parsing library and later on, used by the AST writer library to generate output.
*		Here the general structure specs:
*
*	@example
*		[Metadata] => {
*			bundle: {
*				name: {uniqueId},
*				target: {path},
*				format: {currentFormat}
*			},
*			files: [{
*				source: {path},
*				ast: {object}
*			}, ...]
*		}
**/
class Metadata extends EventEmitter {

	/**
	*	Constructor
	*	@public
	*	@param {Any} [...args] constructor arguments
	*	@return {bundle.task.metadata.Metadata}
	**/
	constructor(...args) {
		super();
		return extend(true, this, { bundle: Bundle.new(), files: Collection.new([], { interface: File }) });
	}

	/**
	*	Metadata Property Definition
	*	@static
	*	@property files
	*	@type {Array}
	**/
	static properties = [
		'bundle',
		'files'
	];

	/**
	*	Bundle Property Definition
	*	@static
	*	@property bundle
	*	@type {Array}
	**/
	static bundle = [
		'name',
		'target',
		'format'
	];

	/**
	*	Bundle File Property Definition
	*	@static
	*	@property files
	*	@type {Array}
	**/
	static files = [
		'source',
		'ast'
	];

	/**
	*	Static Constructor
	*	@static
	*	@param {Any} [...args] constructor arguments
	*	@return {bundle.task.metadata.Metadata}
	**/
	static new(...args) {
		return new this(...args);
	}

}

export default Metadata;

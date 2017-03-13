/**
*	@module visitors
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import extend from 'extend';
import yargs from 'yargs';
import Factory from 'util/factory/factory';
import Collection from 'util/adt/collection';
import Visitor from 'util/visitor/visitor';

/**
*	Class Commander
*	@extends {util.visitor.Visitor}
**/
class Commander extends Visitor {

	/**
	*	Constructor
	*	@public
	*	@override
	*	@param {Any} [...args] - constructor arguments
	*	@return {visitors.Commander}
	**/
	constructor(...args) {
		super(...args);
		return extend(true, this, { commands: Collection.new(this.constructor.commands) }).build();
	}

	/**
	*	Parses Configuration options
	*	@public
	*	@param {util.visitor.Visited} ctx - context reference
	*	@return {visitors.Commander}
	**/
	build(ctx) {
		let args = this.reduce(_.bind(this.command, this, ctx), this.usage()).help().argv;
		return this;
	}

	/**
	*	Adds Usage message
	*	@public
	*	@param {}
	*	@return {yargs}
	**/
	usage(message = '$0 <cmd> [args]') {
		return yargs.usage(message);
	}

	/**
	*	Reducer appends a command into the memoized yargs reference
	*	@public
	*	@param {util.visitor.Visited} ctx - context reference
	*	@param {yargs} memo - memoized yargs reference
	*	@param {Object} name - command name and abbreviation
	*	@param {String} [description = ''] - command description
	*	@return {yargs}
	**/
	command(ctx, memo, name, description = '') {
		return memo.command(this.name(name), description, defaults, ctx[name]);
	}

	/**
	*	Build and returns yargs command with a given name options
	*	@public
	*	@param {Object} name - command name and abbreviation. i.e: { long: 'name', abbr: 'n' }
	*	@return {String}
	**/
	name(name) {
		return `${name.long}` + (_.defined(name.abbr) ? ` [${name.abbr}]` : '');
	}

	/**
	*	Visitor Name
	*	@public
	*	@type {String}
	**/
	get name() {
		return 'CommanderVisitor';
	}

	/**
	*	Move to Configuration - Available Artifacts
	*	@static
	*	@type {Array}
	**/
	static artifacts = [
		'visitors/configuration/remote',
		'visitors/configuration/local'
	];

}

export default Commander;

/**
*	@module bin
*	@author Patricio Ferreira <3dimentionar@gmail.com>
*	@Notes Think about the API require('sqbox').clean({}).bundle({}).graph({});
**/
import 'util/mixins';
import extend from 'extend';
import Collection from 'util/adt/collection';
import StackAsync from 'util/adt/stack-async';
import Factory from 'util/factory/factory';
import Command from 'command';
import CommandsList from './commands.json';
import logger from 'util/logger/logger';

let enforcer = Symbol('SquareBox');

/**
*	Class SquareBox
*	@extends {Command}
*
*	@uses {bin.visitor.Commander}
**/
class SquareBox extends Command {

	/**
	*	Constructor
	*	@public
	*	@param {Symbol} _enforcer - private enforcer symbol
	*	@param {Object} [...args] - Constructor arguments
	*	@return {bin.SquareBox}
	**/
	constructor(_enforcer, ...args) {
		super(...args);
		return SquareBox.isPrivate(_enforcer, this.attachEvents());
	}

	/**
	*	Attach Events
	*	@public
	*	@return {bin.SquareBox}
	**/
	attachEvents() {
		this.stack.on(StackAsync.events.push, _.bind(this.onCommand, this));
		return this;
	}

	/**
	*	Before Run
	*	@public
	*	@override
	*	@return {bin.SquareBox}
	**/
	before() {
		this.commander.read();
		return this;
	}

	/**
	*	Run
	*	@public
	*	@override
	*	@return {bin.SquareBox}
	**/
	run() {
		this.before();
		this.configuration.parse()
			.then(_.bind(this.push, this, this, this.options.path))
			.catch(_.bind(this.after, this));
		return this;
	}

	/**
	*	Subcommand push Handler
	*	@public
	*	@param {util.adt.StackAsync} stack - stack reference
	*	@param {Command} command - command offered
	*	@return {bin.SquareBox}
	**/
	onCommand(stack, command) {
		let dependents = command.getDependsOn();
		return (dependents.length > 0) ? _.reduce(dependents, this.push, this, this) : this.after();
	}

	/**
	*	After Run
	*	@public
	*	@override
	*	@param {Error} [err] - error reference
	*	@return {bin.SquareBox}
	**/
	after(err, results) {
		if(_.defined(err)) logger(err.message).fatal();
		if(this.stack.isEmpty()) return this.complete(results);
		this.stack.pop().then(_.bind(this.after, this, null)).catch(_.bind(this.after, this));
		return this;
	}

	/**
	*	SquareBox Complete Handler
	*	@public
	*	@param {Array} results - all Results
	*	@return {bin.SquareBox}
	**/
	complete(results) {
		return super.after();
	}

	/**
	*	Constructor Validation
	*	@public
	*	@throws {Error} Private violation
	*	@param {Symbol} pte - constructor enforcer
	*	@return {bin.SquareBox}
	**/
	isPrivate(pte) {
		if(!_.isEqual(pte, enforcer)) throw new Error('Private Violation');
		return this;
	}

	/**
	*	Available Commands
	*	@static
	*	@type {util.adt.Collection}
	**/
	static commands = Collection.new(CommandsList);

	/**
	*	Command Visitors
	*	@static
	*	@override
	*	@type {util.adt.Collection}
	**/
	static visitors = Collection.new(Command.visitors.toJSON().concat([
		'visitors/commander',
		'visitors/configuration'
	]));

	/**
	*	Static enforcer validation
	*	@static
	*	@param {Symbol} _enforcer - private enforcer symbol
	*	@param {bin.SquareBox} instance - squarebox instance reference
	*	@return {bin.SquareBox}
	**/
	static isPrivate(_enforcer, instance) {
		return instance.isPrivate(_enforcer);
	}

	/**
	*	Command options
	*	@static
	*	@type {Array}
	**/
	static options = Command.options.concat(['options']);

	/**
	*	Static Run
	*	@static
	*	@param {String} [cwd = process.cwd()] - base path
	*	@return {bin.SquareBox}
	**/
	static run(cwd = process.cwd()) {
		return this.new(enforcer, { cwd }).run();
	}

}

export default SquareBox;

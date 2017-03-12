/**
*	@module commands.bin
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import 'commands/util/mixins';
import extend from 'extend';

import Factory from 'commands/util/factory/factory';
import Command from 'commands/command';

let enforcer = Symbol('SquareBox');

/**
*	Class SquareBox
*	@extends {commands.Command}
*
*	@uses {commands.bin.visitor.Commander}
**/
class SquareBox extends Command {

	/**
	*	Constructor
	*	@public
	*	@param {Object} [args = {}] - Constructor arguments
	*	@return {commands.bin.SquareBox}
	**/
	constructor(...args) {
		super(...args);
		return SquareBox.isPrivate(this.attachEvents());
	}

	/**
	*	Attaches Events
	*	@public
	*	@return {commands.bin.SquareBox}
	**/
	attachEvents() {
		// TODO
		return this;
	}

	/**
	*	Read all command arguments using {commands.bin.visitor.Commander}
	*	@public
	*	@async
	*	@return {commands.bin.SquareBox}
	**/
	read() {
		// TODO
		return this;
	}

	/**
	*	Constructor Validation
	*	@public
	*	@throws {Error} Private violation
	*	@param {Symbol} pte - constructor enforcer
	*	@return {commands.bin.SquareBox}
	**/
	isPrivate(pte) {
		if(!_.isEqual(pte, enforcer)) throw new Error('Private Violation');
		return this;
	}

	/**
	*	Register Command Factories
	*	@public
	*	@override
	*	@return {commands.bin.SquareBox}
	**/
	register() {
		super.register();
		Factory.registerAll(this.constructor.commands);
		return this;
	}

	/**
	*	Available Commands
	*	@static
	*	@type {Array}
	**/
	static commands = [
		'help/help',
		'clean/clean',
		'bundle/bundle',
		'visualize/visualize'
	];

	/**
	*	SquareBox visitors
	*	@static
	*	@override
	*	@type {Array}
	**/
	static visitors = [
		'bin/visitor/commander'
	].concat(Command.visitors);

	/**
	*	Static enforcer validation
	*	@static
	*	@param {commands.bin.SquareBox} instance - squarebox instance reference
	*	@return {commands.bin.SquareBox}
	**/
	static isPrivate(instance) {
		return instance.isPrivate(enforcer);
	}

	/**
	*	Static Run
	*	@static
	*	@return commands.bin.SquareBox
	**/
	static run() {
		return this.new({ cwd: process.cwd() }).read();
	}

}

export default SquareBox.run();

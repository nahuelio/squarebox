/**
*	@module commands.bin
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import './util/mixins';
import extend from 'extend';
import Command from 'commands/command';
import Commander from 'util/commander/commander';

let enforcer = new Symbol();

/**
*	Class SquareBox
*	@extends {commands.Command}
*
*	@uses {util.commander.Commander}
**/
class SquareBox extends Command {

	/**
	*	Constructor
	*	@public
	*	@param {Symbol} pte - constructor enforcer
	*	@param [args = {}] {Object} Constructor arguments
	*	@return {commands.bin.SquareBox}
	**/
	constructor(pte, ...args) {
		super();
		return this.validate().register().settings(...args);
	}

	/**
	*	Constructor Validation
	*	@public
	*	@throws {Error} Private violation
	*	@param {Symbol} pte - constructor enforcer
	*	@return {commands.bin.SquareBox}
	**/
	validate(pte) {
		if(!_.isEqual(pte, enforcer)) throw new Error('Private Violation');
		return this;
	}

	/**
	*	Register Command Factories
	*	@public
	*	@return {commands.bin.SquareBox}
	**/
	register() {
		// TODO: Factory
		return this;
	}

	/**
	*	Available Commands
	*	@static
	*	@type {Array}
	**/
	static commands = [
		'help',
		'clean',
		'bundle',
		'visualize'
	];

	/**
	*	Static Run
	*	@static
	*	@return commands.bin.SquareBox
	**/
	static run() {
		return new Proxy(this.new(enforcer, { cwd: process.cwd() }), Commander.new());
	}

}

export default SquareBox.run();

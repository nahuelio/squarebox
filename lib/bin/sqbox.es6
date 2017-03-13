/**
*	@module bin
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import 'util/mixins';
import extend from 'extend';

import Factory from 'util/factory/factory';
import Command from 'command';

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
	*	@param {Object} [args = {}] - Constructor arguments
	*	@return {bin.SquareBox}
	**/
	constructor(...args) {
		super(...args);
		return SquareBox.isPrivate(this.attachEvents());
	}

	/**
	*	Attaches Events
	*	@public
	*	@return {bin.SquareBox}
	**/
	attachEvents() {
		this.on(SquareBox.events.done, this.after);
		return this;
	}

	/**
	*	Before Run
	*	@public
	*	@override
	*	@return {bin.SquareBox}
	**/
	before() {
		return super.before().parse();
	}

	/**
	*	Run
	*	@public
	*	@override
	*	@return {bin.SquareBox}
	**/
	run() {
		this.before();
		// TODO
		return this;
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
	*	Register Command Factories
	*	@public
	*	@override
	*	@return {bin.SquareBox}
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
		{ help: 'help/help' },
		{ clean: 'clean/clean' },
		{ bundle: 'bundle/bundle' },
		{ visualize: 'visualize/visualize' }
	];

	/**
	*	SquareBox visitors
	*	@static
	*	@override
	*	@type {Array}
	**/
	static visitors = [
		'visitors/commander',
		'visitors/configuration'
	].concat(Command.visitors);

	/**
	*	Static enforcer validation
	*	@static
	*	@param {bin.SquareBox} instance - squarebox instance reference
	*	@return {bin.SquareBox}
	**/
	static isPrivate(instance) {
		return instance.isPrivate(enforcer);
	}

	/**
	*	Static Run
	*	@static
	*	@param {String} [cwd = process.cwd()] - base path
	*	@return {bin.SquareBox}
	**/
	static run(cwd) {
		return this.new({ cwd }).read();
	}

}

export default SquareBox;

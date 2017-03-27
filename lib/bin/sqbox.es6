/**
*	@module bin
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import 'util/mixins';
import extend from 'extend';
import Collection from 'util/adt/collection';
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
	*	Attaches Events
	*	@public
	*	@return {bin.SquareBox}
	**/
	attachEvents() {
		this.once(SquareBox.events.done, this.after);
		return this;
	}

	/**
	*	Before Run
	*	@public
	*	@override
	*	@return {bin.SquareBox}
	**/
	before() {
		super.before();
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
		this.configuration.parse().then(_.bind(this.onConfiguration, this));
		return this;
	}

	/**
	*	Configuration Loaded and Parsed Handler
	*	@public
	*	@param {visitors.Configuration} configuration - configuration visitor reference
	*	@return {bin.SquareBox}
	**/
	onConfiguration() {
		const { path } = this.options;
		Factory.get(path, _.pick(this, Command.options)).run();
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
	*	@type {util.adt.Collection}
	**/
	static commands = Collection.new(CommandsList);

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

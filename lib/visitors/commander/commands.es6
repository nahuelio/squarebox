/**
*	@module visitors.commander
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';

/**
*	Yargs Command Builder Option Names
*	@const
*	@private
*	@type {Array}
**/
const Builder = ['command', 'aliases', 'desc', 'builder', 'handler'];

/**
*	Creates command's handler
*	@const
*	@private
*	@param {visitors.Commander} ctx - commander visitor reference
*	@param {Object} command - command options
*	@param {Object} memo - memoized object
*	@param {String} option - Yargs command option
*	@return {Object}
**/
const create = (ctx, command, memo, option) => {
	memo[option] = ctx[`_${option}`](command);
	return memo;
};

/**
*	Create Single Yarg Command
*	@const
*	@private
*	@param {visitors.Commander} ctx - commander visitor reference
*	@param {yargs} memo - memoized yargs reference
*	@param {Object} current - current command
*	@return {yargs}
**/
const command = (ctx, memo, current) => {
	return memo.command(_.reduce(Builder, _.bind(create, this, ctx, current), {}));
};

/**
*	Create Yargs Commands
*	@static
*	@param {yargs} yargs - yargs reference
*	@param {Command} c - current command
*	@param {visitors.Commander} ctx - commander visitor reference
*	@return {yargs}
**/
export default (yargs, c, ctx) => {
	const { commands } = c.constructor;
	return commands.reduce(_.bind(command, this, ctx), yargs);
};

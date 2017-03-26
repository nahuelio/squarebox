/**
*	@module visitors.commander
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';

/**
*	Yargs Parse
*	@static
*	@param {yargs} yargs - yargs reference
*	@param {Command} c - current command
*	@param {visitors.Commander} ctx - commander visitor reference
*	@return {util.visitor.Visited}
**/
export default (yargs, command, ctx) => {
	return yargs.parse(ctx._args(), _.bind(ctx.onParse, ctx));
};

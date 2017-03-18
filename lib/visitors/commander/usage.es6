/**
*	@module visitors.commander
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import chalk from 'chalk';

/**
*	Usage Message
*	@const
*	@private
*	@type {String}
**/
const message = 'sqbox <command> [args]';

/**
*	Yargs Usage
*	@static
*	@param {yargs} yargs - yargs reference
*	@return {yargs}
**/
export default (yargs) => {
	return yargs.usage(chalk.white(message));
};

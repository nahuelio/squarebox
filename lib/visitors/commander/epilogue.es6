/**
*	@module visitors.commander
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import chalk from 'chalk';

/**
*	Yargs Epilogue
*	@static
*	@param {yargs} yargs - yargs reference
*	@return {yargs}
**/
export default (yargs) => {
	return yargs.epilogue(chalk.cyan(`For more information, please visit http://squarebox.nahuel.io/`));
};

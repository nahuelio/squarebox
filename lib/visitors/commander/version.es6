/**
*	@module visitors.commander
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import { resolve } from 'path';
import _ from 'underscore';
import logger from 'util/logger/logger';

/**
*	Yargs Version
*	@static
*	@param {yargs} yargs - yargs reference
*	@param {Command} command - current command reference
*	@return {yargs}
**/
export default (yargs, command) => {
	try {
		return yargs.version(require(resolve(command.dirname, '..', 'package.json')).version);
	} catch(ex) {
		logger(`[WARN] SquareBox Version not detected - ${ex.message}`).debug(logger.yellow);
	}
	return yargs;
};

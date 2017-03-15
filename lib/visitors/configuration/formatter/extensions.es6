/**
*	@module visitors.configuration.formatter
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';

/**
*	Extensions Formatter
*	@static
*	@param {String} [input = ''] - input to format
*	@return {Object}
**/
export default (input = '') => {
	return input.split(',');
};

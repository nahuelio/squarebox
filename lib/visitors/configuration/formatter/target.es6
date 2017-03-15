/**
*	@module visitors.configuration.formatter
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';

/**
*	Target Formatter
*	@static
*	@param {String} [input = ''] - input to format
*	@return {Object}
**/
export default (input = '') => {
	return _.chain(input.split(','))
		.invoke('split', '>')
		.reduce((m, v, k) => {
			let ps = v[1].split(':');
			m[v[0]] = { destination: ps[1], format: ps[0] };
			return m;
		}, {})
		.value();
};

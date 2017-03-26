/**
*	@module visitors.configuration.formatter
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';

/**
*	Supported Formats
*	@const
*	@private
*	@type {Array}
**/
const formats = ['ifie', 'umd', 'amd', 'cjs'];

/**
*	Validate Format
*	@const
*	@param {String} format - module format
*	@return {Boolean}
**/
const valid = (format) => {
	return _.contains(formats, format);
};

/**
*	Create Target
*	@const
*	@param {Object} m - memoized object version to export
*	@return {Object}
**/
const target = (m, v, ps) => {
	m[v[0]] = { destination: ps[1], format: ps[0] };
	return m;
};

/**
*	Create Reducer
*	@const
*	@param {Object} m - memoized object version to export
*	@return {Object}
**/
const create = (m, v) => {
	if(!_.defined(v[1])) return m;
	let ps = v[1].split(':');
	return valid(ps[0]) ? target(m, v, ps) : m;
};

/**
*	Target Formatter
*	@static
*	@param {String} [input = ''] - input to format
*	@return {Object}
**/
export default (input = '') => {
	return (_.isString(input) && input.length > 0) ?
		_.chain(input.split(','))
			.invoke('split', '>')
			.reduce(create, {})
			.value() : {};
};

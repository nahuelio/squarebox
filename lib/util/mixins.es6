/**
*	@module util
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
import _ from 'underscore';
import _s from 'underscore.string';

_.mixin({

	/**
	*	Converts an Object into a flat array of parameters.
	*
	*	@example <caption>Example</caption>
	*	_.parametrize({
	*		propa: 'one',
	*		propB: 1,
	*		deep: {
	*			deep-prop: 'two',
	*			anotherPropValue: true
	*		},
	*		arr: ['hello', 'world'],
	*		flag: null
	*	});
	*	// Outputs:
	*	[
	*		'--propa', 'one',
	*		'--prop-b', 1,
	*		'--deep-deep-prop', 'two',
	*		'--deep-another-prop-value', true,
	*		'--arr', 'hello,world',
	*		'--flag'
	*	]
	*
	*	@public
	*	@param [o = {}] {Object} object to parametrize
	*	@param [pf = '--'] {String} prefix to use
	*	@param [dk = ''] {String} ???
	*	@return {Array}
	**/
	parametrize: function(o = {}, pf = '--', dk = '') {
		return _.chain(o)
			.map(function(v, k) {
				if(_.isRealObject(v)) return _.parametrize(v, pf, k);
				if(_.isArray(v)) v = v.join(',');
				return [`${pf}${_s.ltrim(_s(dk + ' ' + k).dasherize().value(), '-')}`, v];
			}, this).flatten().filter((v, k) => _.defined(v)).value();
	},

	/**
	*	Return true if a given object is a real object (Not an array or a Date for example), false otherwise.
	*	@public
	*	@param [o] {Object} object to be evaluated
	*	@return {Boolean}
	**/
	isRealObject: function(o) {
		if(!_.defined(o) || !_.defined(o.constructor)) return false;
		return ((o).constructor.toString().indexOf('function Object() {') !== -1);
	},

	/**
	*	Returns true if a given element is a instance of a complex primitive abstract data type
	*	Like Object or Array
	*	@public
	*	@param [o] {Object}
	*	@return {Boolean}
	**/
	isAdt: function(o) {
		if(!_.defined(o)) return false;
		return (_.isRealObject(o) || _.isArray(o));
	},

	/**
	*	Returns an array of all method names of a given object.
	*	@public
	*	@param {String} o - object to be evaluated
	*	@return {Boolean}
	**/
	methods: function(o) {
		return _.filter(Object.getOwnPropertyNames(o), (name) => {
			return (typeof(o[name]) === 'function');
		});
	},

	/**
	*	Returns true if parameter source is an instance of parameter constructor, false otherwise.
	*	@public
	*	@param source {Object} source to be evaluated
	*	@param constructor {Function} constructor function to compare to
	*	@return {Boolean}
	**/
	instanceOf: function(source, constructor) {
		if(!_.defined(source) || !_.defined(constructor)) return false;
		return (source instanceof constructor);
	},

	/**
	*	Returns true if a given object is neither, null or undefined. Otherwise returns false.
	*	@public
	*	@param [o] {Object} object to be evaluated
	*	@return {Boolean}
	**/
	defined: function(o) {
		return (!_.isUndefined(o) && !_.isNull(o));
	}

});

export default _;

/**
*	RequireJS Configuration
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
'use strict';

requirejs.config({

	baseUrl: '.',

	paths: {
		react: 'libs/react/dist/react.min',
		'react-dom': 'libs/react/dist/react-dom.min',
		'react-redux': 'libs/react-redux/index',
		redux: 'libs/redux/index',
		'redux-saga': 'libs/react-saga/index',
		'redux-logger': 'libs/react-logger/redux-logger',
		'immutable': 'libs/immutable/dist/immutable.min',

		'babel-helpers': 'libs/babel/helpers',
		'babel-polyfill': 'libs/babel-polyfill/browser-polyfill',

		bootstrap: 'libs/bootstrap/dist/js/bootstrap.min',
		jquery: 'libs/jquery/dist/jquery.min',
		lodash: 'libs/lodash/dist/lodash.min',
		css: 'libs/require-css/css.min',
		text: 'libs/text/text',

		'font-awesome': 'libs/font-awesome/css/font-awesome.min.css',
		'bootstrap-css': 'libs/bootstrap/dist/css/bootstrap.min.css'
	},

	shim: {
		lodash: ['babel-helpers', 'babel-polyfill'],
		jquery: ['lodash'],
		bootstrap: ['jquery'],
		'react-dom': ['react']
	}

}).onError(function(err) {

	console.log(err);

});

/**
*	RequireJS Build Profile
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
const path = require('path');

const basic = {
	baseUrl: './js',
	mainConfigFile: './js/config.js',
	bundlesConfigOutFile: './js/config.js',
	appDir: '.',
	dir: '../../docs/js',
	fileExclusionRegExp: "^\\.|\\.less$|\\.md$",
	findNestedDependencies: true,
	removeCombined: true,
	optimize: 'uglify',
	optimizeCss: 'none',
	logLevel: 3,
	uglify: {
		toplevel: true,
        ascii_only: true,
        beautify: false,
        max_line_length: 1000,
        no_mangle: false
	}
};

module.exports = Object.assign({

	paths: {
		'boostrap-css': 'empty:',
		'font-awesome': 'empty:'
	},

	onBuildRead: function(moduleName, path, contents) {
		return contents;
	},

	onBuildWrite: function(moduleName, path, contents) {
		return contents;
	},

	modules: {}

}, basic);

/**
*	Simulation of a AMD Library
**/
// define(['jquery', 'dependencies/lib-a'], function($, LibA) {
// 	return { type: 'Amd', jquery: $ };
// });

define(['require', 'exports', 'dependencies/lib-a'], function(require, exports, LibA) {
	exports.something = function() {
		return require('dependencies/lib-a');
	};
});

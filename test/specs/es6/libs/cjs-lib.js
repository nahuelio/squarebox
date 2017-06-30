/**
*	Simulation of a CommonJs Library
**/
let $ = require('jquery');
LibB = require('dependencies/lib-b');
require('hello');

module.exports = { type: 'CommonJs', jquery: $ };

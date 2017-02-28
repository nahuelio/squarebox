/**
*	Gulp Tasks
*	@author Patricio Ferreira <3dimentionar@gmail.com>
**/
const fs = require('fs-extra');
	gulp = require('gulp'),
	gulpsync = require('gulp-sync')(gulp);
	babel = require('gulp-babel'),
	less = require('gulp-less'),
	externalHelpers = require('gulp-babel-external-helpers'),
	install = require('gulp-install'),
	requirejs = require('gulp-requirejs');

/**
*	Gulp Clean
*	@async
**/
gulp.task('clean', (callback) => {
	// TODO
	callback();
});


/**
*	Gulp Install Dependencies
*	@async
*	@uses gulp.task.clean
**/
gulp.task('install', gulpsync.async(['clean'], 'clean'), (callback) => {
	// TODO
	callback();
});

/**
*	Gulp Compile
*	@async
*	@uses gulp.task.install
**/
gulp.task('compile', gulpsync.async(['install'], 'install'), (callback) => {
	// TODO
	callback();
});

/**
*	Gulp Build
*	@async
*	@uses gulp.task.compile
**/
gulp.task('build', gulpsync.async(['compile'], 'compile'), (callback) => {
	// TODO
	callback();
});

/**
*	Gulp Default
*	@async
*	@uses gulp.task.build
**/
gulp.task('default', gulpsync.async(['build'], 'build'));

"use strict";

const gulp = require('gulp'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	watchify = require('watchify'),
	assign = require('lodash.assign'),
	gutil = require('gutil')
;

let customOpts = {
	entries: ['./src/index.js'],
	debug: true
};

let opts = assign({ transform: ['brfs'] }, watchify.args, customOpts),
	watch = watchify(browserify(opts))
;

gulp.task('dev', bundle);
watch.on('update', bundle);
watch.on('log', gutil.log);

gulp.task('default', ['dev']);

function bundle() {

	return watch.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./build/js'))
	;
}
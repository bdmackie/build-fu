var gulp = require('gulp');
var builder = require('./index').Builder;
var mocha = require('gulp-mocha');
var Promise = require('bluebird');
var bump = require('gulp-bump');

var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var traceur = require('gulp-traceur');
var rename = require('gulp-rename');
var removeLines = require('gulp-remove-lines');
var _ = require('underscore');
var plumber = require('gulp-plumber');
var removeLinePattern = /sourceMappingURL=[^.]*.es6.map/;

gulp.task('default', function() {
  // place code for your default task here
  console.log('hello world');

 });

// Clean them generated files.
gulp.task('clean', function () {
    return builder.del(['./test/out', './test/out1', './test/out2', './test/out-compile'])
        .then(function() { 
            console.log('finished cleaning'); 
        });
});

// Compile (transpile) ES6 to JS.
gulp.task('compile', ['clean'], function () {
    return builder
        .setDefaultTranspiler('traceur')
        .transpile('./test/src2', './test/out');
});

gulp.task('compile-traceur', ['clean'], function () {
    return gulp.src('./test/src2/**/*.es6')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(traceur({sourceMaps:true}))
        .pipe(rename({extname: ".js"}))
        .pipe(sourcemaps.write('.', {addComment: true}))
        .pipe(gulp.dest('./test/out'));
});

gulp.task('compile-babel', ['clean'], function () {
    return gulp.src('./test/src2/**/*.es6')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(rename({extname: ".js"}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./test/out'));
});

gulp.task('bump', function(){
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('reload-modules', ['clean'], function () {
    //return builder.del('./node-modules');
});

// Test
gulp.task('test', function () {
    console.log('start test');
    gulp.src('test/**/test-*.js', {read: false})
        .pipe(mocha({reporter: 'spec', recursive: true}));
});

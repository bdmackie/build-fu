var gulp = require('gulp');
var es6 = require('./index').Es6Transpiler;
var mocha = require('gulp-mocha');
var Promise = require('bluebird');

gulp.task('default', function() {
  // place code for your default task here
  console.log('hello world');

 });

// Clean them generated files.
gulp.task('clean', function () {
    return es6.cleanTarget('./test/out1')
            .cleanTarget('./test/out2')
            .then(function() { 
                console.log('finished cleaning'); 
            });
});

// Compile (transpile) ES6 to JS.
gulp.task('compile', ['clean'], function () {
    console.log('flag');
    return es6
        .compile({
            sourceDir : 'test/src1',
            targetDir : 'test/out1'
        })
        .compile({
            sourceDir: 'test/src2',
            targetDir: 'test/out2'
        })
        .copy({
            sourceDir: 'test/src2',
            targetDir: 'test/out2'
        }); 
});

// Test
gulp.task('test', function () {
    console.log('start test');
    gulp.src('test/**/test-*.js', {read: false})
        .pipe(mocha({reporter: 'spec', recursive: true}));
});

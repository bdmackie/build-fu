/**
 * @file ES6 build helpers.
 * @copyright Ben Mackie 2015
 * @license Apache-2.0
 */
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var traceur = require('gulp-traceur');
var rename = require('gulp-rename');
var removeLines = require('gulp-remove-lines');
var _ = require('underscore');
var plumber = require('gulp-plumber');

module.exports = function(builder, util) {
	var _this = builder;
	var _util = util;

    // This pattern and the use of gulp-remove-lines is a workaround
    // for the spurrious sourceMappingURL comment pointing to a file
    // with the original es6 extension.
    var removeLinePattern = /sourceMappingURL=[^.]*.es6.map/;
    var defaultCleanInlineOptions = {
        recursive : true
    }
    var defaultCompileOptions = {
        compiler: 'traceur',
        recursive : true,
        sourceExtension: 'es6'
    }

    _this.setEs6Compiler = function(compiler) {
        defaultCompileOptions.compiler = compiler;
        return _this;
    }
    
    _this.es6Compile = function(sourceDir, targetDir, options) {
        // Validate options.
        var opt = _.extend(defaultCompileOptions, options);
        if (!sourceDir)
            throw new Error('Invalid source directory.');
        if (!targetDir)
            targetDir = sourceDir;

        // Calc full source path.
        var sourcePath = sourceDir;
        if (opt.recursive)
            sourcePath += '/**';
        sourcePath += '/*.es6';

        // Do transpilation
        switch (opt.compiler) {
            case 'babel':
                return _util.addStream(function(resolve, reject) {
                    console.log('start babel compile ' + sourcePath);
                    return gulp.src(sourcePath)
                        .pipe(plumber(reject))
                        .pipe(sourcemaps.init())
                        .pipe(babel())
                        .pipe(rename({extname: ".js"}))
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest(targetDir));
                    });
            case 'traceur':
                return _util.addStream(function(resolve, reject) {
                    console.log('start traceur compile ' + sourcePath);
                    return gulp.src(sourcePath)
                        .pipe(plumber(reject))
                        .pipe(sourcemaps.init())
                        .pipe(traceur({sourceMaps:true}))
                        .pipe(rename({extname: ".js"}))
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest(targetDir));
                    });
            default:
                throw new Error('Unknown transpiler: ' + opt.compiler);
        }
    }
}
/**
 * @file ES6 build helpers.
 * @copyright Ben Mackie 2015
 * @license Apache-2.0
 */
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var traceur = require('gulp-traceur');
var fs = require('fs');
var path = require('path');
var rename = require('gulp-rename')
var del = require('del');
var _ = require('underscore');
var s = require('underscore.string');
var DEFAULT_TRANSPILER = 'babel';
var removeLines = require('gulp-remove-lines');

module.exports = function(builder, util) {
	var _this = builder;
	var _util = util;

	_transpilerId = 'traceur';

    // This pattern and the use of gulp-remove-lines is a workaround
    // for the spurrious sourceMappingURL comment pointing to a file
    // with the original es6 extension.
    var removeLinePattern = /sourceMappingURL=[^.]*.es6.map/;
    var defaultCleanInlineOptions = {
        recursive : true
    }
    var defaultCompileOptions = {
        recursive : true
    }
    
    _this.transpiler = function(transpilerId) {
        switch (transpilerId) {
            case 'babel':
            case 'traceur':
                _transpilerId = transpilerId;
                break;
            default:
                throw new Error('Unknown transpiler: ' + transpilerId);
        }
        return _this;
    }

    _this.compile = function(sourceDir, targetDir, options) {
        // Validate options.
        var opt = _.extend(defaultCompileOptions, options);
        if (!sourceDir)
            throw new Error('Invalid source directory.');
        if (!targetDir)
            targetDir = sourceDir;

        // Calc full source path.
        var sourcePath = opt.sourceDir;
        if (opt.recursive)
            sourcePath += '/**';
        sourcePath += '/*.es6';

        // Do transpilation
        switch (_transpilerId) {
            case 'babel':
                return _util.addStream(function() {
                    console.log('start babel compile ' + sourcePath);
                    return gulp.src(sourcePath)
                        .pipe(sourcemaps.init())
                        .pipe(babel())
                        .pipe(rename({extname: ".js"}))
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest(options.targetDir));
                    });
            case 'traceur':
                return _util.addStream(function() {
                    console.log('start traceur compile ' + sourcePath);
                    return gulp.src(sourcePath)
                        .pipe(sourcemaps.init())
                        .pipe(traceur({sourceMaps:true}))
                        .pipe(rename({extname: ".js"}))
                        .pipe(sourcemaps.write('.', {addComment: true}))
                        .pipe(removeLines({filters:[removeLinePattern]}))
                        .pipe(gulp.dest(options.targetDir));
                    });
            default:
                throw new Error('Unknown transpiler: ' + _transpilerId);
        }
    }
}
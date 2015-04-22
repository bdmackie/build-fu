/**
 * @file Entry point.
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
var Promise = require('bluebird');
var PromiseChain = require('promise-fu').PromiseChain;
var glob = require("glob");
var walk = require("walk");
var fse = require("fs-extra");

function Builder() {
    var _this = {};

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
    var defaultCopyOptions = {
        extensions : ['js'],
        recursive : true,
        overwrite : false
    }

    var _transpilerId = 'traceur';
    var _promises = new PromiseChain();

    _this.wait = function(delay) {
        return addResolver(function(resolve, reject) {
            setTimeout(
                resolve,
                delay
                );
        });
    }

    function addResolver(resolver) {
        _promises.addResolver(resolver);
        return _this;
    }

    function addStream(streamFn) {
        return addResolver(function(resolve, reject) {
            var stream = streamFn();
            stream.on('end', function() { 
                console.log('finish stream');
                resolve(); 
            });
        });
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

    _this.cleanTarget = function(dir) {
        return addResolver(function(resolve, reject) {
            del(dir, function() { 
                console.log('finished cleaning');
                resolve(); 
            });
        });
    }

    _this.cleanInline = function(dir, options) {
        options = _.extend(defaultCleanInlineOptions, options);
        var path = dir + (options.recursive ? '/**' : '') + '/*.es6';

        return addResolver(function(resolve, reject) {
            globOptions = {};
            glob(path, globOptions, function (er, files) {
                files.forEach(function(file) {
                    var stem = s.strLeftBack(file, '.');
                    var srcFile = stem + '.js';
                    if (fs.existsSync(srcFile)) {
                        console.log('  Deleting file %s...', srcFile)
                        fs.unlinkSync(srcFile);
                    }
                    var mapFile = stem + '.js.map';
                    if (fs.existsSync(mapFile)) {
                        console.log('  Deleting file %s...', mapFile)
                        fs.unlinkSync(mapFile);
                    }
                });
                resolve();
            });
        });
    }

    _this.copy = function(sourceDir, targetDir, options) {
        // Validate options.
        var opt = _.extend(defaultCopyOptions, options);
        if (!sourceDir)
            throw new Error('Invalid source directory.');
        if (!targetDir)
            throw new Error('Invalid target directory.');
        if (opt.extensions != null && !_.isArray(opt.extensions))
            throw new Error('Invalid extensions option. Must be an array or null.');

        // TODO: Gulp approach is nicer and doesn't have dependencies
        // but won't support non-clobber option until v4. When that is
        // out use this approach instead and don't clobber by default.
        /*
        // Calc full source path.
        var sourcePath = sourceDir;
        if (opt.recursive)
            sourcePath += '/**';
        sourcePath += '/*';
        if (opt.extensions) {
            if (opt.extensions.length > 1)
                sourcePath += '.{' + opt.extensions.join() + '}';
            else if (opt.extensions)
                sourcePath += '.' + opt.extensions[0];
        }

        // All that's left is to do the copy...
        //console.log('copying from %s', sourcePath);
        return addStream(function() {
            return gulp.src(sourcePath)
                .pipe(gulp.dest(targetDir));
        });
        return _this;
        */

        sourceDir += '/';
        targetDir += '/';
        return addResolver(function(resolve, reject) {
            var walker = walk.walk(sourceDir, {followLinks:false});
 
            walker.on("file", function (root, fileStats, next) {
                var name = fileStats.name;
                var ext = s.strRightBack(name, '.');
                if (opt.extensions == null || opt.extensions.indexOf(ext) >= 0) {
                    if (opt.overwrite || !fs.existsSync(targetDir + name)) {
                        console.log('copying %s (extensions %s)...', name, opt.extensions);
                        fse.copySync(sourceDir + name, targetDir + name);
                    }
                }
                next();
            });

            walker.on("errors", function (root, nodeStatsArray, next) {
                next();
            });
             
            walker.on("end", function () {
                //console.log("all done");
                resolve();
            });
        });
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
                return addStream(function() {
                    console.log('start babel compile ' + sourcePath);
                    return gulp.src(sourcePath)
                        .pipe(sourcemaps.init())
                        .pipe(babel())
                        .pipe(rename({extname: ".js"}))
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest(options.targetDir));
                    });
            case 'traceur':
                return addStream(function() {
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

    _this.fork = function() {
        _promises.fork();
        return _this;
    }

    _this.join = function() {
        _promises.join();
        return _this;
    }

    _this.then = function() {
        return _promises.then.apply(_promises, arguments);
        //var p = _promises.all();
        //return p.then.apply(p, arguments);
    }

    return _this;
};

module.exports.Builder = new Builder();
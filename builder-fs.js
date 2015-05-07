/**
 * @file File system build helpers.
 * @copyright Ben Mackie 2015
 * @license MIT
 */
var fs = require('fs');
var path = require('path');
var del = require('del');
var _ = require('underscore');
var s = require('underscore.string');
var glob = require("glob");
var walk = require("walk");
var fse = require("fs-extra");
var debug = require('./depfile').debug('fs');

module.exports = function(builder, util) {
	var _this = builder;
	var _util = util;

    var defaultCleanOptions = {
        recursive : true
    }
    var defaultCopyOptions = {
        extensions : ['js'],
        recursive : true,
        overwrite : false
    }

	_this.del = function(dir) {
        if (!_.isArray(dir)) {
            return _util.addResolver(function(resolve, reject) {
                del(dir, function() { 
                    debug('finished del');
                    resolve(); 
                });
            });
        } else {
            var resolvers = _.map(dir, function(dir) {
                return function(resolve, reject) {
                    del(dir, function() { 
                        debug('finished del');
                        resolve(); 
                    });
                }
            });
            return _util.addResolvers(resolvers);
        }
    }

    _this.clean = function(dir, options) {
        options = _.extend(defaultCleanOptions, options);
        var path = dir + (options.recursive ? '/**' : '') + '/*.es6';

        return _util.addResolver(function(resolve, reject) {
            globOptions = {};
            glob(path, globOptions, function (er, files) {
                files.forEach(function(file) {
                    var stem = s.strLeftBack(file, '.');
                    var srcFile = stem + '.js';
                    if (fs.existsSync(srcFile)) {
                        debug('  Deleting file %s...', srcFile)
                        fs.unlinkSync(srcFile);
                    }
                    var mapFile = stem + '.js.map';
                    if (fs.existsSync(mapFile)) {
                        debug('  Deleting file %s...', mapFile)
                        fs.unlinkSync(mapFile);
                    }
                });
                debug('finished clean')
                resolve();
            });
        });
    }

    _this.copy = function(sourceDir, targetDir, options) {
        // Validate args.
        var opt = _.extend(defaultCopyOptions, options);
        if (!sourceDir)
            throw new Error('Invalid source directory.');
        if (!targetDir)
            throw new Error('Invalid target directory.');
        /*
        if (typeof extensions === 'string')
            extensions = [extensions];
        else if (!_.isArray(extensions))
            throw new Error('Invalid extensions.');
        */
        
        // TODO: Gulp approach is nicer and doesn't have dependencies
        // but won't support non-clobber option until v4. When that is
        // out use this approach instead and preserve "don't clobber by default".
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
        //debug('copying from %s', sourcePath);
        return _util.addStream(function() {
            return gulp.src(sourcePath)
                .pipe(gulp.dest(targetDir));
        });
        return _this;
        */

        sourceDir += '/';
        targetDir += '/';
        return _util.addResolver(function(resolve, reject) {
            var walker = walk.walk(sourceDir, {followLinks:false});
 
            walker.on("file", function (root, fileStats, next) {
                var name = fileStats.name;
                var ext = s.strRightBack(name, '.');
                if (opt.extensions == null || opt.extensions.indexOf(ext) >= 0) {
                    if (opt.overwrite || !fs.existsSync(targetDir + name)) {
                        debug('copying %s (extensions %s)...', name, opt.extensions);
                        fse.copySync(sourceDir + name, targetDir + name);
                    }
                }
                next();
            });

            walker.on("errors", function (root, nodeStatsArray, next) {
                next();
            });
             
            walker.on("end", function () {
                debug("finished copy");
                resolve();
            });
        });
        return _this;
    }
};
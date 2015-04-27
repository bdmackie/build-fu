/**
 * @file Entry point.
 * @copyright Ben Mackie 2015
 * @license Apache-2.0
 */
var Promise = require('bluebird');
var PromiseChain = require('promise-fu').PromiseChain;

function Builder() {
    var _this = {};
    var _util = {};
    var _promises = new PromiseChain();

    _this.wait = function(delay) {
        return addResolver(function(resolve, reject) {
            setTimeout(
                resolve,
                delay
                );
        });
    }

    //_util.emit = function(eventName, data) {
    //    _emitter.emit(eventName, data);
    //    return _this;
    //}

    _util.addResolver = function(resolver) {
        _promises.addResolver(resolver);
        return _this;
    }

    _util.addResolvers = function(resolvers) {
        _promises.addResolvers(resolvers);
        return _this;
    }

    _util.addStream = function(streamFn) {
        return _util.addResolver(function(resolve, reject) {
            var stream = streamFn(resolve, reject);
            stream.on('end', function() { 
                console.log('finish stream');
                resolve(); 
            });
        });
    }

    //_this.on = function(eventName, listener) {
    //    _emitter.on(eventName, listener);
    //    return _this;
    //}

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
    }

    // Add build methods.
    require('./builder-fs.js')(_this, _util);

    // Add ES6 methods.
    require('./builder-es6.js')(_this, _util);

    return _this;
};

module.exports.Builder = new Builder();
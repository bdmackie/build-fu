var chai = require('chai');
require('./chai-helpers')(chai);
var expect = chai.expect;
var fs = require('fs');
var builder = require('../index').Builder;
var Promise = require('bluebird');
var del = require('del');

function getFiles(dir) {
	return fs.readdirSync(dir);
}

function writeFileText(path, text) {
	return fs.writeFileSync(path, text);
}

function readFileText(path) {
	return fs.readFileSync(path, {encoding: 'utf8'});
}

describe('builder-fs', function() {
    it('should clean target.', function() {
    	var dir = './test/outclean';
    	del.sync(dir);
	    fs.mkdirSync(dir);
    	fs.writeFileSync(dir + '/file1.js', 'var global = "hello world 1";');
    	fs.writeFileSync(dir + '/file2.js', 'var global = "hello world 2";');

    	// Assert test files exist.
    	expect(dir).to.be.a.directory(['file1.js', 'file2.js']);

	    return builder
	    	.cleanTarget(dir)
	    	.then(function() {
		    	expect(dir).to.not.be.a.path();
	    	});
	});

    it('should clean inline.', function() {
    	var dir = './test/outclean';
    	del.sync(dir);
	    fs.mkdirSync(dir);
    	fs.writeFileSync(dir + '/file1.es6', 'var global = "hello world 1";');
    	fs.writeFileSync(dir + '/file1.js', 'var global = "hello world 2";');
    	fs.writeFileSync(dir + '/file1.js.map', 'var global = "hello world 2";');
    	fs.writeFileSync(dir + '/file2.js', 'var global = "hello world 2";');

    	// Assert test files exist.
    	expect(dir).to.be.a.directory(['file1.es6', 'file1.js', 'file1.js.map', 'file2.js']);

	    return builder
	    	.cleanInline(dir)
	    	.then(function() {
		    	expect(dir).to.be.a.directory(['file1.es6', 'file2.js']);

		    	// Clean the rest with clean target.
		    	return builder.
		    		cleanTarget(dir);
	    	});
    });

    it('should do basic copy - just js.', function() {
    	var dir = './test/outcopy';
    	del.sync(dir);
	    fs.mkdirSync(dir);

    	// Assert test files exist.
    	expect(dir).to.be.a.directory();

	    return builder
	    	.copy('./test/src1', dir)
	    	.then(function() {
		    	expect(dir).to.be.a.directory(['direct.js']);

				// Clean up.
				del.sync(dir);
	    	});
	});

    it('should do basic copy - js and builder.', function() {
    	var dir = './test/outcopy';
    	del.sync(dir);
	    fs.mkdirSync(dir);

    	// Assert test files exist.
    	expect(dir).to.be.a.directory();

	    return builder
	    	.copy('./test/src1', dir, {extensions: ['js', 'es6']})
	    	.then(function() {
		    	expect(dir).to.be.a.directory(['direct.js', 'dummy.es6']);

				// Clean up.
				del.sync(dir);
	    	});
	});

    it('should do basic copy - all', function() {
    	var dir = './test/outcopy';
    	del.sync(dir);
	    fs.mkdirSync(dir);

    	// Assert test files exist.
    	expect(dir).to.be.a.directory();

	    return builder
	    	.copy('./test/src1', dir, {extensions: null})
	    	.then(function() {
		    	expect(dir).to.be.a.directory(['direct.js', 'dummy.es6']);

				// Clean up.
				del.sync(dir);
	    	});
	});

	it('should do basic copy - no clobber.', function() {
    	var dir = './test/outcopy';
    	del.sync(dir);
	    fs.mkdirSync(dir);
    	writeFileText(dir + '/direct.js', 'test');
    	expect(readFileText(dir + '/direct.js')).to.equal('test');

    	// Assert test files exist.
    	expect(dir).to.be.a.directory(['direct.js']);

	    return builder
	    	.copy('./test/src1', dir)
	    	.then(function() {
		    	expect(dir).to.be.a.directory(['direct.js', 'dummy.es6']);
		    	expect(readFileText(dir + '/direct.js')).to.equal('test');

				// Clean up.
				del.sync(dir);
	    	});
	});

	it('should do basic copy - clobber.', function() {
    	var dir = './test/outcopy';
    	del.sync(dir);
	    fs.mkdirSync(dir);
    	writeFileText(dir + '/direct.js', 'test');
    	expect(readFileText(dir + '/direct.js')).to.equal('test');

    	// Assert test files exist.
    	expect(dir).to.be.a.directory(['direct.js']);

	    return builder
	    	.copy('./test/src1', dir, { overwrite: true })
	    	.then(function() {
		    	expect(dir).to.be.a.directory(['direct.js', 'dummy.es6']);
		    	expect(readFileText(dir + '/direct.js')).to.not.equal('test');

				// Clean up.
				del.sync(dir);
	    	});
	});

});

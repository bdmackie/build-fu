var chai = require('chai');
require('./chai-helpers')(chai);
var expect = chai.expect;
var builder = require('../index').Builder;
var th = require('./testing-helper');

describe('builder-fs', function() {
    it('should delete target.', function() {
    	var dir = th.resetTarget('./test/out');
    	th.writeTextFile(dir + '/file1.js', 'var global = "hello world 1";');
    	th.writeTextFile(dir + '/file2.js', 'var global = "hello world 2";');

    	// Assert test files exist.
    	expect(dir).to.be.a.directory(['file1.js', 'file2.js']);

	    return builder
	    	.del(dir)
	    	.then(function() {
		    	expect(dir).to.not.be.a.path();
	    	});
	});

    it('should clean inline.', function() {
    	var dir = th.resetTarget('./test/out');
    	th.writeTextFile(dir + '/file1.es6', 'var global = "hello world 1";');
    	th.writeTextFile(dir + '/file1.js', 'var global = "hello world 2";');
    	th.writeTextFile(dir + '/file1.js.map', 'var global = "hello world 2";');
    	th.writeTextFile(dir + '/file2.js', 'var global = "hello world 2";');

    	// Assert test files exist.
    	expect(dir).to.be.a.directory(['file1.es6', 'file1.js', 'file1.js.map', 'file2.js']);

	    return builder
	    	.clean(dir)
	    	.then(function() {
		    	expect(dir).to.be.a.directory(['file1.es6', 'file2.js']);
		    	th.delTarget(dir);
	    	});
    });

    it('should do basic copy - just js.', function() {
    	var dir = th.resetTarget('./test/out');

    	// Assert test files exist.
    	expect(dir).to.be.a.directory();

	    return builder
	    	.copy('./test/src1', dir)
	    	.then(function() {
		    	expect(dir).to.be.a.directory(['direct.js']);
				th.delTarget(dir);
	    	});
	});

    it('should do basic copy - js and builder.', function() {
    	var dir = th.resetTarget('./test/out');

    	// Assert test files exist.
    	expect(dir).to.be.a.directory();

	    return builder
	    	.copy('./test/src1', dir, {extensions: ['js', 'es6']})
	    	.then(function() {
		    	expect(dir).to.be.a.directory(['direct.js', 'dummy.es6']);
				th.delTarget(dir);
	    	});
	});

    it('should do basic copy - all', function() {
    	var dir = th.resetTarget('./test/out');

    	// Assert test files exist.
    	expect(dir).to.be.a.directory();

	    return builder
	    	.copy('./test/src1', dir, {extensions: null})
	    	.then(function() {
		    	expect(dir).to.be.a.directory(['direct.js', 'dummy.es6']);
				th.delTarget(dir);
	    	});
	});

	it('should do basic copy - no clobber.', function() {
    	var dir = th.resetTarget('./test/out');
    	th.writeTextFile(dir + '/direct.js', 'test');
    	expect(th.readTextFile(dir + '/direct.js')).to.equal('test');

    	// Assert test files exist.
    	expect(dir).to.be.a.directory(['direct.js']);

	    return builder
	    	.copy('./test/src1', dir)
	    	.then(function() {
		    	expect(dir).to.be.a.directory(['direct.js', 'dummy.es6']);
		    	expect(th.readTextFile(dir + '/direct.js')).to.equal('test');
				th.delTarget(dir);
	    	});
	});

	it('should do basic copy - clobber.', function() {
    	var dir = th.resetTarget('./test/out');
    	th.writeTextFile(dir + '/direct.js', 'test');
    	expect(th.readTextFile(dir + '/direct.js')).to.equal('test');

    	// Assert test files exist.
    	expect(dir).to.be.a.directory(['direct.js']);

	    return builder
	    	.copy('./test/src1', dir, { overwrite: true })
	    	.then(function() {
		    	expect(dir).to.be.a.directory(['direct.js', 'dummy.es6']);
		    	expect(th.readTextFile(dir + '/direct.js')).to.not.equal('test');
				th.delTarget(dir);
	    	});
	});

});

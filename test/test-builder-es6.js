var chai = require('chai');
require('./chai-helpers')(chai);
var expect = chai.expect;
var builder = require('../index').Builder;
var th = require('./testing-helper');


describe('builder-es6-smoke', function() {
    it('should compile simple smoke test', function() {
    	var dir = th.resetTarget('./test/out-compile');
    	return builder
	    	.transpile('./test/src1', dir)
	    	.then(function() {
		    	expect(dir).to.be.a.directory(['dummy.js', 'dummy.js.map']);
		    	var service = require('./out-compile/dummy').service;
		    	expect(service.foo()).to.equal('bar');
		    	expect(service.iter()).to.equal(15);
		    	th.removeModule('./out-compile/dummy.js');

		    	var sourceMap = th.readJsonFile('./test/out-compile/dummy.js.map');
		    	expect(sourceMap.sources).to.have.members(['dummy.es6']);
		    	expect(sourceMap.file).to.equal('dummy.js');
	    	});
	});
});

['traceur', 'babel'].forEach(function(transpiler) {
	describe('builder-es6', function() {
	    it('should compile simple', function() {
	    	var dir = th.resetTarget('./test/out-compile');
	    	return builder
		    	.transpile('./test/src1', dir, { "transpiler" : transpiler })
		    	.then(function() {
			    	expect(dir).to.be.a.directory(['dummy.js', 'dummy.js.map']);
			    	var service = require('./out-compile/dummy').service;
			    	expect(service.foo()).to.equal('bar');
			    	expect(service.iter()).to.equal(15);
			    	th.removeModule('./out-compile/dummy.js');

			    	var sourceMap = th.readJsonFile('./test/out-compile/dummy.js.map');
			    	expect(sourceMap.sources).to.have.members(['dummy.es6']);
			    	expect(sourceMap.file).to.equal('dummy.js');
		    	});
		});

	    it('should compile scoping', function() {
	    	var dir = th.resetTarget('./test/out-compile');
	    	return builder
	    		.transpileOptions({ "transpiler" : transpiler })
		    	.transpile('./test/src2', dir)
		    	.then(function(res, err) {
		    		if (err) {
		    			console.log('error! ' + err);
		    			return;
		    		}
			    	expect(dir).to.be.a.directory();
			    	var scoping = require('./out-compile/scoping');
			    	expect(scoping.undef()).to.equal('undefined');
			    	expect(scoping.login('def')).to.equal(true);
			    	expect(scoping.login2('abc')).to.equal(true);
			    	expect(scoping.doubleVar()).to.equal(9);
		    	});
		});

		it('should compile generators', function() {
	    	var dir = th.resetTarget('./test/out-compile');
	    	return builder
	    		.transpileOptions({ "transpiler" : transpiler })
		    	.transpile('./test/src2', dir)
		    	.then(function(res, err) {
		    		if (err) {
		    			console.log('error! ' + err);
		    			return;
		    		}
			    	expect(dir).to.be.a.directory();
			    	var generators = require('./out-compile/generators');
			    	expect(generators.gen1()).to.eql(['a', 'b', 'c']);
			    	expect(generators.gen2()).to.eql(['a', 'b', 'c']);
			    	expect(generators.fib()).to.eql([1, 2, 3, 5, 8, 13, 21, 34]);
			    	expect(generators.dlg()).to.eql(['Greetings!', 'Hello!', 'Bye!', 'Ok, bye.']);
		    	});
		});

		/*
		it('should compile proxies', function() {
	    	var dir = th.resetTarget('./test/out-compile');
	    	return builder
		    	.transpile('./test/src2', dir)
		    	.then(function(res, err) {
		    		if (err) {
		    			console.log('error! ' + err);
		    			return;
		    		}
			    	expect(dir).to.be.a.directory();
			    	var proxies = require('./out-compile/proxies');
			    	expect(proxies.eleven.abc).to.equal(11);
			    	expect(proxies.eleven.def).to.equal(11);
		    	});
		});
		*/

		it('should compile collections', function() {
	    	var dir = th.resetTarget('./test/out-compile');
	    	return builder
	    		.transpileOptions({ "transpiler" : transpiler })
		    	.transpile('./test/src2', dir)
		    	.then(function(res, err) {
		    		if (err) {
		    			console.log('error! ' + err);
		    			return;
		    		}
			    	expect(dir).to.be.a.directory();
			    	var collections = require('./out-compile/collections');
			    	expect(collections.innovate()).to.equal('JavaScript');
			    	expect(collections.letterCount()).to.equal(4);
		    	});
		});

		it('should compile classes', function() {
	    	var dir = th.resetTarget('./test/out-compile');
	    	return builder
	    		.transpileOptions({ "transpiler" : transpiler })
		    	.transpile('./test/src2', dir)
		    	.then(function(res, err) {
		    		if (err) {
		    			console.log('error! ' + err);
		    			return;
		    		}
			    	expect(dir).to.be.a.directory();
			    	var classes = require('./out-compile/classes');

			    	var person = new classes.Person('John', 25);
			    	expect(person.name).to.equal('John');
			    	expect(person.age).to.equal(25);

			    	var dev = new classes.Developer('Jane', 37, 'ES5', 'ES6');
			    	expect(dev.name).to.equal('Jane');
			    	expect(dev.age).to.equal(37);
			    	expect(dev.getLanguages()).to.eql(['ES5', 'ES6']);
		    	});
		});

		it('should compile arrows', function() {
	    	var dir = th.resetTarget('./test/out-compile');
	    	return builder
	    		.transpileOptions({ "transpiler" : transpiler })
		    	.transpile('./test/src2', dir)
		    	.then(function(res, err) {
		    		if (err) {
		    			console.log('error! ' + err);
		    			return;
		    		}
			    	expect(dir).to.be.a.directory();
			    	var arrows = require('./out-compile/arrows');

			    	expect(arrows.double()).to.eql([2, 4, 6]);
			    	expect(arrows.fives()).to.eql([0, 15]);
			    	expect(arrows.bob.getFriends()).to.eql(['Bob knows Mary', 'Bob knows Sonia']);
		    	});
		});
	});
});
module.exports = function(chai) {
	var fs = require('fs');
	
	/**
	 * Assert a path exists.
	 */
	chai.Assertion.addMethod('path', function () {
		var obj = this._obj;

		new chai.Assertion(obj, 'value').is.a('string');

		var pass = fs.existsSync(obj);

		this.assert(
			pass
			, "expected #{this} to exist"
			, "expected #{this} not to exist"
		);
	});

	/**
	 * Assert a directory exists and optionally contains the specified files.
	 */
	chai.Assertion.addMethod('directory', function (files) {
		var obj = this._obj;

		new chai.Assertion(obj, 'value').is.a('string');
		new chai.Assertion(obj, 'value').to.be.a.path();

		var pass = fs.statSync(obj).isDirectory();
		if (pass && files)
			new chai.Assertion(fs.readdirSync(obj), 'files').to.have.members(files);

		this.assert(
			pass
			, "expected #{this} to be a directory"
			, "expected #{this} not to be a directory"
		);
	});	

	/**
	 * Assert a directory exists and optionally contains the specified files.
	 */
	chai.Assertion.addMethod('file', function (utf8Contents) {
		var obj = this._obj;

		new chai.Assertion(obj, 'value').is.a('string');
		new chai.Assertion(obj, 'value').to.be.a.path();

		var pass = fs.statSync(obj).isFile();
		if (utf8Contents)
			new chai.Assertion(fs.readFileSync(obj, {encoding:'utf8'}), 'contents').to.equal(files);

		this.assert(
			pass
			, "expected #{this} to be a file"
			, "expected #{this} not to be a file"
		);
	});	
}
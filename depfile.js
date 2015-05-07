var debugFactory = require('debug');

exports.debug = function(child) {
	if (arguments.length == 0)
		return debugFactory();
	else
		return debugFactory('build-fu:' + child ); 
}
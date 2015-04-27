// Out of scope
export let undef = function() { 
	{ let a = 'I am declared inside an anonymous block'; }
	return typeof a 
};

// Private
var privateKey = 'abc';
export function login(password) {
  let privateKey = 'def';
  return password === privateKey;
}
export function login2(password) {
  return password === privateKey;
}

// Reuse
export function doubleVar() {
	var counter = 0;
	for(let i = 0; i < 3; i += 1) {
	  for(let i = 0; i < 3; i += 1) {
	    counter += 1;
	  }
	}
	return counter;
}
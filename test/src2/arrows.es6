export function double() {
	return [1, 2, 3].map(n => n * 2);
}




// Expression bodies
var evens = [0, 2, 4, 6, 8, 10]
var odds = evens.map(v => v + 1);
var nums = evens.map((v, i) => v + i);
var pairs = evens.map(v => ({even: v, odd: v + 1}));

export function fives() {
	let fives = [];

	// Statement bodies
	nums.forEach(v => {
	  if (v % 5 === 0)
	    fives.push(v);
	});
	return fives;
}

// Lexical this
export var bob = {
  _name: "Bob",
  _friends: ['Mary', 'Sonia'],
  getFriends() {
  	let friends = [];
    this._friends.forEach(f =>
      friends.push(this._name + " knows " + f)
      );
    return friends;
  }
}
const people = [
  {name: 'Douglas Crockford'},
  {name: 'Guido van Rossum'},
  {name: 'Raffaele Esposito'}
];

let innovations = new Map();

innovations.set(people[0], 'JavaScript');
innovations.set(people[1], 'Python');
innovations.set(people[2], 'Pizza Margherita');

// Prints "JavaScript"
export function innovate() {
	return innovations.get(people[0]);
}

export function letterCount() {
	let items = ['a', 'b', 'a', 'c', 'a', 'd'];

	let letters = new Set();
	items.forEach(function (letter) {
	  letters.add(letter);
	});

	return letters.size;
}
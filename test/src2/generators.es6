function* argumentsGenerator() {
  for (let i = 0; i < arguments.length; i += 1) {
    yield arguments[i];
  }
}

export function gen1() {
	let argumentsIterator = argumentsGenerator('a', 'b', 'c');
	let values = [];
	values.push(argumentsIterator.next().value);
	values.push(argumentsIterator.next().value);
	values.push(argumentsIterator.next().value);
	return values;
}

export function gen2() {
	var argumentsIterator = argumentsGenerator('a', 'b', 'c');
	var values = [];
	for(let value of argumentsIterator)
		values.push(value);
	return values;
}

function* fibonacci() {
    let [prev, curr] = [0, 1];
    for (;;) {
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}

export function fib() {
	let values = [];
	for (let value of fibonacci()) {
		if (value > 50)
			break;
		values.push(value);
	}
	return values;
}

export function dlg() {
	let delegatedIterator = (function* () {
	  yield 'Hello!';
	  yield 'Bye!';
	}());

	let delegatingIterator = (function* () {
	  yield 'Greetings!';
	  yield* delegatedIterator;
	  yield 'Ok, bye.';
	}());

	// Prints "Greetings!", "Hello!", "Bye!", "Ok, bye."
	let values = [];
	for (let value of delegatingIterator) {
		values.push(value);
	}
	return values;
}
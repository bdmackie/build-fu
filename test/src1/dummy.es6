class DummyService {
	foo() {
		return "bar";
	}

	iter() {
		let arr = [1, 2, 3, 4, 5];
		let n = 0;
		for (let e of arr)
			n += e;
		return n;
	}
}

export let service = new DummyService();
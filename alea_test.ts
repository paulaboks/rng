// From: https://github.com/coverslide/node-alea

import { assertEquals, assertNotEquals } from "@std/assert";
import { Alea } from "./alea.ts";

Deno.test("make sure two seeded values are the same", () => {
	const prng1 = new Alea(1);
	const prng2 = new Alea(3);
	const prng3 = new Alea(1);

	const a = prng1.next();
	const b = prng2.next();
	const c = prng3.next();

	assertEquals(a, c, "return values of the same seed");
	assertNotEquals(a, b, "return values of different seed");

	// test return values directly
	assertEquals(prng1.next(), prng3.next(), "same seed called again");

	assertNotEquals(prng1.next(), prng2.next(), "different seed again");
	assertNotEquals(prng1.next(), prng3.next(), "prng1 called more times than prng3");
	assertNotEquals(prng2.next(), prng3.next(), "prng3 called again");

	assertEquals(prng1.next(), prng3.next(), "call counts equal again");
});

Deno.test("Known values test", () => {
	const prng1 = new Alea(12345);

	//predefined numbers
	const values = [
		0.27138191112317145,
		0.19615925149992108,
		0.6810678059700876,
	];

	assertEquals(prng1.next(), values[0], "check value 1");
	assertEquals(prng1.next(), values[1], "check value 2");
	assertEquals(prng1.next(), values[2], "check value 3");
});

Deno.test("Uint32 test", () => {
	const prng1 = new Alea(12345);

	//predefined numbers
	const values = [
		1165576433,
		842497570,
		2925163953,
	];

	assertEquals(prng1.uint32(), values[0], "check value 1");
	assertEquals(prng1.uint32(), values[1], "check value 2");
	assertEquals(prng1.uint32(), values[2], "check value 3");
});

Deno.test("Fract53 test", () => {
	const prng1 = new Alea(12345);

	//predefined numbers
	const values = [
		0.27138191116884325,
		0.6810678062004586,
		0.3407802057882554,
	];

	assertEquals(prng1.fract53(), values[0], "check value 1");
	assertEquals(prng1.fract53(), values[1], "check value 2");
	assertEquals(prng1.fract53(), values[2], "check value 3");
});

Deno.test("Import with Alea.importState()", () => {
	const prng1 = new Alea(200);

	// generate a few numbers
	prng1.next();
	prng1.next();
	prng1.next();

	const e = prng1.export_state();

	const prng4 = Alea.import_state(e);

	assertEquals(prng1.next(), prng4.next(), "synced prngs, call 1");
	assertEquals(prng1.next(), prng4.next(), "synced prngs, call 2");
	assertEquals(prng1.next(), prng4.next(), "synced prngs, call 3");
});

Deno.test("Resync two differring prngs with prng.importState()", () => {
	const prng1 = new Alea(200000);
	const prng2 = new Alea(9000);

	// generate a few numbers

	assertNotEquals(prng1.next(), prng2.next(), "just generating randomness, call 1");
	assertNotEquals(prng1.next(), prng2.next(), "just generating randomness, call 2");
	assertNotEquals(prng1.next(), prng2.next(), "just generating randomness, call 3");

	// sync prng2 to prng1
	prng2.import_state(prng1.export_state());

	assertEquals(prng1.next(), prng2.next(), "imported prng, call 1");
	assertEquals(prng1.next(), prng2.next(), "imported prng, call 2");
	assertEquals(prng1.next(), prng2.next(), "imported prng, call 3");

	// let's test they still sync up if called non-sequentially

	prng1.next();
	prng1.next();

	const a1 = prng1.next();
	const b1 = prng1.next();
	const c1 = prng1.next();

	prng2.next();
	prng2.next();

	const a2 = prng2.next();
	const b2 = prng2.next();
	const c2 = prng2.next();

	assertEquals(a1, a2, "return values should sync based on number of calls, call 1");
	assertEquals(b1, b2, "return values should sync based on number of calls, call 2");
	assertEquals(c1, c2, "return values should sync based on number of calls, call 3");
});

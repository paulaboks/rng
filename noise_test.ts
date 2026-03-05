// From https://github.com/jwagner/simplex-noise.js

import { assert, assertArrayIncludes, assertEquals, assertNotEquals } from "@std/assert";
import { Alea } from "./alea.ts";
import { build_permutation_table, create_noise_2d } from "./noise.ts";

function get_random(seed = "seed") {
	return new Alea(seed);
}

Deno.test("first half contains all indices exactly once", function () {
	const table = build_permutation_table(get_random());
	const firstHalf = Array.prototype.slice.call(table, 0, table.length / 2);
	for (let i = 0; i < firstHalf.length / 2; i++) {
		assertArrayIncludes(firstHalf, [i]);
	}
});

Deno.test("is shuffled", function () {
	const tableA = build_permutation_table(get_random("A"));
	const tableB = build_permutation_table(get_random("B"));
	assertNotEquals(tableA, tableB);
});

Deno.test("second half mirrors first half", function () {
	const table = build_permutation_table(get_random());
	const firstHalf = Array.prototype.slice.call(table, 0, table.length / 2);
	const secondHalf = Array.prototype.slice.call(table, table.length / 2);
	assertEquals(firstHalf, secondHalf);
});
Deno.test("can contain 0 in the first position", function () {
	function zero() {
		return 0;
	}
	const table = build_permutation_table({ next: zero });
	const aTable = Array.prototype.slice.call(table);
	for (let i = 0; i < aTable.length; i++) {
		assertEquals(aTable[i], i & 255);
	}
});

const noise2D = create_noise_2d(get_random());

Deno.test("is initialized randomly without arguments", function () {
	const noise2DA = create_noise_2d();
	const noise2DB = create_noise_2d();
	assertNotEquals(noise2DA(0.1, 0.1), noise2DB(0.0, 0.1));
});
Deno.test("should return the same value for the same input", function () {
	assertEquals(noise2D(0.1, 0.2), noise2D(0.1, 0.2));
});
Deno.test("should return a different value for a different input", function () {
	assertNotEquals(noise2D(0.1, 0.2), noise2D(0.101, 0.202));
});
Deno.test("should return the same output with the same seed", function () {
	const noise2D2 = create_noise_2d(get_random());
	assertEquals(noise2D(0.1, 0.2), noise2D2(0.1, 0.2));
});
Deno.test("should return a different output with a different seed", function () {
	const noise2D2 = create_noise_2d(get_random("other seed"));
	assertNotEquals(noise2D(0.1, 0.2), noise2D2(0.1, 0.2));
});
Deno.test("should return values between -1 and 1", function () {
	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
			assert(noise2D(x / 5, y / 5) >= -1);
			assert(noise2D(x / 5, y / 5) <= 1);
		}
	}
});
Deno.test("should return similar values for similar inputs", function () {
	assert(Math.abs(noise2D(0.1, 0.2) - noise2D(0.101, 0.202)) < 0.1);
});

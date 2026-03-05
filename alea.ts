// From: https://github.com/coverslide/node-alea

export type AleaState = [number, number, number, number];

export class Alea {
	static version = "Alea 0.9";

	#s0 = 0;
	#s1 = 0;
	#s2 = 0;
	#c = 1;

	args: unknown[];

	constructor(...args: unknown[]) {
		if (args.length === 0) {
			args = [performance.now()];
		}

		this.args = args;

		const mash = create_mash();

		this.#s0 = mash(" ");
		this.#s1 = mash(" ");
		this.#s2 = mash(" ");

		for (const arg of args) {
			this.#s0 -= mash(arg);
			if (this.#s0 < 0) {
				this.#s0 += 1;
			}

			this.#s1 -= mash(arg);
			if (this.#s1 < 0) {
				this.#s1 += 1;
			}

			this.#s2 -= mash(arg);
			if (this.#s2 < 0) {
				this.#s2 += 1;
			}
		}
	}

	next(): number {
		const t = 2091639 * this.#s0 + this.#c * 2.3283064365386963e-10;
		this.#s0 = this.#s1;
		this.#s1 = this.#s2;
		this.#s2 = t - (this.#c = t | 0);
		return this.#s2;
	}

	uint32(): number {
		return this.next() * 0x100000000;
	}

	fract53(): number {
		return this.next() + ((this.next() * 0x200000) | 0) * 1.1102230246251565e-16;
	}

	export_state(): AleaState {
		return [this.#s0, this.#s1, this.#s2, this.#c];
	}

	import_state(state: AleaState): void {
		this.#s0 = +state[0] || 0;
		this.#s1 = +state[1] || 0;
		this.#s2 = +state[2] || 0;
		this.#c = +state[3] || 0;
	}

	static import_state(state: AleaState): Alea {
		const rng = new Alea();
		rng.import_state(state);
		return rng;
	}
}

function create_mash() {
	let n = 0xefc8249d;

	const mash = (data: unknown): number => {
		const str = String(data);

		for (let i = 0; i < str.length; i++) {
			n += str.charCodeAt(i);

			let h = 0.02519603282416938 * n;
			n = h >>> 0;

			h -= n;
			h *= n;
			n = h >>> 0;

			h -= n;
			n += h * 0x100000000;
		}

		return (n >>> 0) * 2.3283064365386963e-10;
	};

	return mash;
}

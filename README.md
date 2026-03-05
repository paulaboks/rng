# RNG

## Alea

"A simple copy-and-paste implementation of Johannes Baagøe's Alea PRNG"

except its not a copy paste the api is different

```typescript
import { Alea } from "@paulaboks/rng";
const prng = new Alea();
console.log(prng.next(), prng.next(), prng.next());
```

## Noise

2D noise only

```typescript
import { create_noise_2d } from "@paulaboks/rng";
const noise2d = create_noise_2d();
console.log(noise2d(x, y)); // value between -1 and 1
```

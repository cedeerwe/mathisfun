// step 1: a basic LUT with a few steps of Pascal's triangle
const binomials = [
  [1],
  [1, 1],
  [1, 2, 1],
  [1, 3, 3, 1],
  [1, 4, 6, 4, 1],
  [1, 5, 10, 10, 5, 1],
  [1, 6, 15, 20, 15, 6, 1],
  [1, 7, 21, 35, 35, 21, 7, 1],
  [1, 8, 28, 56, 70, 56, 28, 8, 1],
  //  ...
];

// step 2: a function that builds out the LUT if it needs to.
export function binomial(n: number, k: number): number {
  while (n >= binomials.length) {
    const s = binomials.length;
    const nextRow = [];
    nextRow[0] = 1;
    for (let i = 1, prev = s - 1; i < s; i++) {
      nextRow[i] = binomials[prev][i - 1] + binomials[prev][i];
    }
    nextRow[s] = 1;
    binomials.push(nextRow);
  }
  return binomials[n][k];
}

export function winProbMatch(x: number, goal: number): number {
  const hash = (m: number, n: number) => `${m}-${n}`;
  const cache = new Map();
  // We set the corner probabilities of winning. These will be used to compute all the others
  for (let n = 0; n < goal; n++) {
    cache.set(hash(goal, n), 1);
    cache.set(hash(n, goal), 0);
  }
  for (let m = goal - 1; m >= 0; m--) {
    for (let n = goal - 1; n >= 0; n--) {
      const prob =
        cache.get(hash(m + 1, n)) * x + cache.get(hash(m, n + 1)) * (1 - x);
      cache.set(hash(m, n), prob);
    }
  }
  return cache.get(hash(0, 0));
}

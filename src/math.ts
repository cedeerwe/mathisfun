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
  let result = 0;
  const stack = [{ prob: 1, m: 0, n: 0 }];
  while (stack.length > 0) {
    const { prob, m, n } = stack.pop()!;
    if (m >= goal) {
      result += prob;
      continue;
    }
    if (n >= goal) {
      continue;
    }
    stack.push({ prob: prob * x, m: m + 1, n });
    stack.push({ prob: prob * (1 - x), m, n: n + 1 });
  }
  return result;
}

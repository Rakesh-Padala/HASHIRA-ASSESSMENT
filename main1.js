const fs = require('fs');

// 1. Read JSON from file
const data = JSON.parse(fs.readFileSync('input2.json', 'utf-8'));

const { n, k } = data.keys;

// 2. Extract and decode points
const points = [];

for (const key in data) {
  if (key === "keys") continue;

  const x = parseInt(key);
  const base = parseInt(data[key].base);
  const y = parseInt(data[key].value, base); // decode y from base

  points.push({ x, y });
}

// Use only first `k` points for interpolation
const selected = points.slice(0, k);

// 3. Lagrange Interpolation to find P(0)
function lagrangeAtZero(points) {
  let P0 = 0;

  for (let i = 0; i < points.length; i++) {
    const { x: xi, y: yi } = points[i];
    let term = yi;

    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const xj = points[j].x;
      term *= (-xj) / (xi - xj);
    }

    P0 += term;
  }

  return Math.round(P0); // round to avoid floating point precision errors
}

const secret = lagrangeAtZero(selected);

console.log("Secret constant term (P(0)):", secret);

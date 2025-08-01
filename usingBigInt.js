const fs = require('fs');

// 1. Read JSON from file
const data = JSON.parse(fs.readFileSync('input2.json', 'utf-8'));

const n = BigInt(data.keys.n);
const k = BigInt(data.keys.k);

// 2. Extract and decode points
const points = [];

for (const key in data) {
  if (key === "keys") continue;

  const x = BigInt(key);
  const base = parseInt(data[key].base);
  const y = BigInt(parseInt(data[key].value, base)); // decode y with base

  points.push({ x, y });
}

// Use only first `k` points (as Number because slice needs it)
const selected = points.slice(0, Number(k));

// 3. Lagrange Interpolation at x = 0
function lagrangeAtZeroBigInt(points) {
  let P0 = 0n;

  for (let i = 0; i < points.length; i++) {
    const { x: xi, y: yi } = points[i];
    let numerator = 1n;
    let denominator = 1n;

    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const xj = points[j].x;

      numerator *= -xj;
      denominator *= xi - xj;
    }

    const invDenominator = modInverse(denominator);
    const term = yi * numerator * invDenominator;
    P0 += term;
  }

  return P0;
}

// Helper: modular inverse (no mod here, so just use inverse in Q)
function modInverse(a) {
  // For non-modular inverse over Q: just return 1/a using BigInt division
  // In real modular field, you should implement Extended Euclidean Algorithm
  return 1n / a; // Will fail in BigInt — we use rational approximation only in floats
}

// ⚠️ JS BigInt does NOT support fractional division!
// ➤ So we’ll use rational approximation via float here
// Alternatively: Implement rational BigFraction if precise rational needed

function lagrangeAtZeroFloat(points) {
  let P0 = 0;

  for (let i = 0; i < points.length; i++) {
    const { x: xi, y: yi } = points[i];
    let term = Number(yi);

    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const xj = points[j].x;
      term *= Number(-xj) / Number(xi - xj);
    }

    P0 += term;
  }

  return Math.round(P0); // rounding to nearest integer
}

const secret = lagrangeAtZeroFloat(selected); // float fallback

console.log("Secret constant term (P(0)):", secret);

const fs = require('fs');

// Function to compute constant term P(0) using Lagrange interpolation
function computeConstantTerm(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const n = BigInt(data.keys.n);
  const k = BigInt(data.keys.k);

  // Decode and extract the points
  const points = [];

  for (const key in data) {
    if (key === "keys") continue;

    const x = BigInt(key);
    const base = parseInt(data[key].base);
    const y = BigInt(parseInt(data[key].value, base)); // decode y with base

    points.push({ x, y });
  }

  // Use only first `k` points (converted to Number for slicing)
  const selected = points.slice(0, Number(k));

  // Perform Lagrange interpolation at x = 0 using floating point
  return lagrangeAtZeroFloat(selected);
}

// Lagrange interpolation using float (since BigInt can't handle fractions)
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

  return Math.round(P0); // Final constant term (rounded to nearest integer)
}

// ----------- Call the function on both files -----------

const secret1 = computeConstantTerm('input1.json');
console.log("Secret from input1.json:", secret1);

const secret2 = computeConstantTerm('input2.json');
console.log("Secret from input2.json:", secret2);

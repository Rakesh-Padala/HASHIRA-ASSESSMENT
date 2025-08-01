const fs = require('fs');

// Function to decode a value from its base
function decodeValue(value, base) {
  return BigInt(parseInt(value, base));
}

// Function to compute modular inverse (if needed)
function modInverse(a, m) {
  let m0 = m, t, q;
  let x0 = BigInt(0), x1 = BigInt(1);
  a = a % m;

  if (m === BigInt(1)) return BigInt(0);

  while (a > 1) {
    q = a / m;
    t = m;

    m = a % m;
    a = t;
    t = x0;

    x0 = x1 - q * x0;
    x1 = t;
  }

  if (x1 < 0) x1 += m0;
  return x1;
}

// Lagrange interpolation at x=0
function lagrangeInterpolation(xVals, yVals) {
  let k = xVals.length;
  let result = BigInt(0);

  for (let i = 0; i < k; i++) {
    let xi = BigInt(xVals[i]);
    let yi = BigInt(yVals[i]);

    let num = BigInt(1);
    let den = BigInt(1);

    for (let j = 0; j < k; j++) {
      if (i !== j) {
        let xj = BigInt(xVals[j]);
        num *= -xj;
        den *= xi - xj;
      }
    }

    let invDen = modInverse(den, BigInt(Number.MAX_SAFE_INTEGER));
    let term = yi * num * invDen;
    result += term;
  }

  return result;
}

// Main function to read JSON and compute secret
function computeSecretFromFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const n = data.keys.n;
  const k = data.keys.k;

  const xVals = [];
  const yVals = [];

  let count = 0;
  for (let key of Object.keys(data)) {
    if (key === 'keys') continue;
    const x = parseInt(key);
    const base = parseInt(data[key].base);
    const valueStr = data[key].value;

    const y = decodeValue(valueStr, base);
    xVals.push(x);
    yVals.push(y);

    count++;
    if (count === k) break;
  }

  const secret = lagrangeInterpolation(xVals, yVals);
  console.log('Recovered secret (P(0)):', secret.toString());
}

// Run the function
computeSecretFromFile('input2.json');

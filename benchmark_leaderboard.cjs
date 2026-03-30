const { performance } = require('perf_hooks');

const iterations = 10000000;

// Baseline: creating the array inline on every "render"
const startBaseline = performance.now();
for (let i = 0; i < iterations; i++) {
  const arr = [{n: "Nichothéos", x: 99999}, {n: "Daragvener", x: 25000}, {n: "Thril_ler", x: 12000}];
  // Simulate mapping
  const sum = arr.reduce((acc, curr) => acc + curr.x, 0);
}
const endBaseline = performance.now();

// Optimized: using a static array outside the function
const STATIC_ARR = [{n: "Nichothéos", x: 99999}, {n: "Daragvener", x: 25000}, {n: "Thril_ler", x: 12000}];
const startOptimized = performance.now();
for (let i = 0; i < iterations; i++) {
  const arr = STATIC_ARR;
  // Simulate mapping
  const sum = arr.reduce((acc, curr) => acc + curr.x, 0);
}
const endOptimized = performance.now();

console.log(`Baseline (inline allocation): ${(endBaseline - startBaseline).toFixed(2)} ms`);
console.log(`Optimized (static allocation): ${(endOptimized - startOptimized).toFixed(2)} ms`);

const { performance } = require('perf_hooks');

const getRank = (xp) => {
  const RANKS = ["Basic", "Advanced Rank", "Elite", "Veteran", "Commander", "Knight", "King", "Emperor", "Saint", "Sage", "Primordial", "Progenitor", "God"];
  if (xp >= 50000) return { title: "Rank 14", level: "True God", color: "text-amber-400 font-black" };

  const xpPerSubStep = 1250;
  const stepIndex = Math.floor(xp / xpPerSubStep);
  const rankIndex = Math.floor(stepIndex / 3);
  const subLevelIndex = stepIndex % 3;
  const subLevels = ["Beginner", "Advanced", "Peak"];

  const rankName = RANKS[rankIndex] || "Basic";
  const subName = subLevels[subLevelIndex] || "Beginner";

  return {
    title: `Rank ${rankIndex + 1}`,
    level: `${rankName} (${subName})`,
    color: rankIndex >= 10 ? "text-rose-500" : rankIndex >= 8 ? "text-purple-400" : "text-blue-400"
  };
};

const xp = 15000;
const iterations = 1000000;

// Baseline: 3 calls per render
const startBaseline = performance.now();
for (let i = 0; i < iterations; i++) {
  const c1 = getRank(xp).color;
  const t1 = getRank(xp).title;
  const l1 = getRank(xp).level;
}
const endBaseline = performance.now();

// Optimized: 1 call per render
const startOptimized = performance.now();
for (let i = 0; i < iterations; i++) {
  const rank = getRank(xp);
  const c1 = rank.color;
  const t1 = rank.title;
  const l1 = rank.level;
}
const endOptimized = performance.now();

console.log(`Baseline (3 calls): ${(endBaseline - startBaseline).toFixed(2)} ms`);
console.log(`Optimized (1 call): ${(endOptimized - startOptimized).toFixed(2)} ms`);

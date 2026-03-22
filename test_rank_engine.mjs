import { getRank } from './rankEngine.js';
import assert from 'assert';

console.log("Testing getRank function...");

// Test basic boundary 0
let rank = getRank(0);
assert.strictEqual(rank.title, 'Rank 1');
assert.strictEqual(rank.level, 'Basic (Beginner)');
assert.strictEqual(rank.color, 'text-blue-400');

// Test Advanced sub level (1250)
rank = getRank(1250);
assert.strictEqual(rank.title, 'Rank 1');
assert.strictEqual(rank.level, 'Basic (Advanced)');
assert.strictEqual(rank.color, 'text-blue-400');

// Test Peak sub level (2500)
rank = getRank(2500);
assert.strictEqual(rank.title, 'Rank 1');
assert.strictEqual(rank.level, 'Basic (Peak)');
assert.strictEqual(rank.color, 'text-blue-400');

// Test next Rank boundary (3750)
rank = getRank(3750);
assert.strictEqual(rank.title, 'Rank 2');
assert.strictEqual(rank.level, 'Advanced Rank (Beginner)');
assert.strictEqual(rank.color, 'text-blue-400');

// Test color boundary purple (Rank 9 -> 8 * 3750 = 30000)
rank = getRank(30000);
assert.strictEqual(rank.title, 'Rank 9');
assert.strictEqual(rank.level, 'Saint (Beginner)');
assert.strictEqual(rank.color, 'text-purple-400');

// Test color boundary rose (Rank 11 -> 10 * 3750 = 37500)
rank = getRank(37500);
assert.strictEqual(rank.title, 'Rank 11');
assert.strictEqual(rank.level, 'Primordial (Beginner)');
assert.strictEqual(rank.color, 'text-rose-500');

// Test True God max boundary exact (50000)
rank = getRank(50000);
assert.strictEqual(rank.title, 'Rank 14');
assert.strictEqual(rank.level, 'True God');
assert.strictEqual(rank.color, 'text-amber-400 font-black');

// Test True God over boundary (>50000)
rank = getRank(60000);
assert.strictEqual(rank.title, 'Rank 14');
assert.strictEqual(rank.level, 'True God');
assert.strictEqual(rank.color, 'text-amber-400 font-black');

// Edge cases
rank = getRank(-10); // Negative xp should just default to Basic
assert.strictEqual(rank.title, 'Rank 0');
assert.strictEqual(rank.level, 'Basic (Beginner)');
rank = getRank(1249);
assert.strictEqual(rank.title, 'Rank 1');
assert.strictEqual(rank.level, 'Basic (Beginner)');

console.log("All tests passed!");

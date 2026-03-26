import { getRank } from './rankEngine.js';
import assert from 'assert';

console.log("Testing getRank function...");

let rank = getRank(0);
assert.strictEqual(rank.title, 'Rank 1');
assert.strictEqual(rank.level, 'Basic (Beginner)');
assert.strictEqual(rank.color, 'text-blue-400');

rank = getRank(1250);
assert.strictEqual(rank.title, 'Rank 1');
assert.strictEqual(rank.level, 'Basic (Advanced)');
assert.strictEqual(rank.color, 'text-blue-400');

rank = getRank(2500);
assert.strictEqual(rank.title, 'Rank 1');
assert.strictEqual(rank.level, 'Basic (Peak)');
assert.strictEqual(rank.color, 'text-blue-400');

rank = getRank(3750);
assert.strictEqual(rank.title, 'Rank 2');
assert.strictEqual(rank.level, 'Novice (Beginner)');
assert.strictEqual(rank.color, 'text-blue-400');

rank = getRank(30000);
assert.strictEqual(rank.title, 'Rank 9');
assert.strictEqual(rank.level, 'Emperor (Beginner)');
assert.strictEqual(rank.color, 'text-purple-400');

rank = getRank(41250); // 11 * 3 * 1250 = 41250 -> Rank 12
assert.strictEqual(rank.title, 'Rank 12');
assert.strictEqual(rank.level, 'Primordial (Beginner)');
assert.strictEqual(rank.color, 'text-rose-500');

// True God for admin uid
rank = getRank(48750, 'nichotheos_uid');
assert.strictEqual(rank.title, 'Rank 14');
assert.strictEqual(rank.level, 'True God');
assert.strictEqual(rank.color, 'text-amber-400 font-black');

// Non-admin cap
rank = getRank(48750, 'some_other_uid');
assert.strictEqual(rank.title, 'Rank 13');
assert.strictEqual(rank.level, 'God (Peak)');
assert.strictEqual(rank.color, 'text-rose-500');

rank = getRank(-10);
assert.strictEqual(rank.title, 'Rank 1');
assert.strictEqual(rank.level, 'Basic (Beginner)');

console.log("All tests passed!");

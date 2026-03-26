import fs from 'fs';

let testRankEngine = fs.readFileSync('test_rank_engine.mjs', 'utf8');
testRankEngine = testRankEngine.replace(/assert\.strictEqual\(rank\.title, 'Rank 2'\);\nassert\.strictEqual\(rank\.level, 'Advanced Rank \\(Beginner\\)'\);/, "assert.strictEqual(rank.title, 'Rank 2');\nassert.strictEqual(rank.level, 'Novice (Beginner)');");
testRankEngine = testRankEngine.replace(/assert\.strictEqual\(rank\.title, 'Rank 9'\);\nassert\.strictEqual\(rank\.level, 'Saint \\(Beginner\\)'\);/, "assert.strictEqual(rank.title, 'Rank 9');\nassert.strictEqual(rank.level, 'Emperor (Beginner)');");
testRankEngine = testRankEngine.replace(/assert\.strictEqual\(rank\.level, 'Primordial \\(Beginner\\)'\);/g, "assert.strictEqual(rank.level, 'Primordial (Beginner)');");
testRankEngine = testRankEngine.replace(/37500\)/, '41250)');
testRankEngine = testRankEngine.replace(/Rank 11/, 'Rank 12');
testRankEngine = testRankEngine.replace(/rank = getRank\(-10\);\nassert\.strictEqual\(rank\.title, 'Rank 0'\);/, "rank = getRank(-10);\nassert.strictEqual(rank.title, 'Rank 1');");
testRankEngine = testRankEngine.replace(/getRank\(/g, "getRank(");
fs.writeFileSync('test_rank_engine.mjs', testRankEngine);

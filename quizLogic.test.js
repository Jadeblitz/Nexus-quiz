import { describe, it } from 'vitest';
import assert from 'node:assert';
import { getRank, calculateQuizResults } from './quizLogic.js';

describe('quizLogic', () => {
    describe('getRank', () => {
        it('should return Rank 1 Basic (Beginner) for 0 XP', () => {
            assert.deepEqual(getRank(0), {
                title: "Rank 1",
                level: "Basic (Beginner)",
                color: "text-blue-400"
            });
        });

        it('should return Rank 1 Basic (Advanced) for 1250 XP', () => {
            assert.deepEqual(getRank(1250), {
                title: "Rank 1",
                level: "Basic (Advanced)",
                color: "text-blue-400"
            });
        });

        it('should return Rank 1 Basic (Peak) for 2500 XP', () => {
            assert.deepEqual(getRank(2500), {
                title: "Rank 1",
                level: "Basic (Peak)",
                color: "text-blue-400"
            });
        });

        it('should return Rank 2 Advanced Rank (Beginner) for 3750 XP', () => {
            assert.deepEqual(getRank(3750), {
                title: "Rank 2",
                level: "Novice (Beginner)",
                color: "text-blue-400"
            });
        });

        it('should return Rank 14 True God for 50000+ XP', () => {
            assert.deepEqual(getRank(50000, true), {
                title: "Rank 14",
                level: "True God",
                color: "text-amber-400 font-black"
            });
        });

        it('should return Rank 13 God (Peak) for 50000+ XP for non-admin', () => {
            assert.deepEqual(getRank(50000, false), {
                title: "Rank 13",
                level: "God (Peak)",
                color: "text-rose-500"
            });
        });

        it('should transition colors correctly at higher ranks', () => {
            assert.strictEqual(getRank(8 * 3 * 1250).color, "text-purple-400"); // Rank 9
            assert.strictEqual(getRank(11 * 3 * 1250).color, "text-rose-500"); // Rank 11
        });
    });

    describe('calculateQuizResults', () => {
        it('should calculate Standard Mode XP correctly without ranking up', () => {
            const results = calculateQuizResults(5, false, 0); // 5 * 10 = 50xp
            assert.strictEqual(results.newXp, 50);
            assert.strictEqual(results.hasRankedUp, false);
            assert.strictEqual(results.newRankData, null);
        });

        it('should calculate Time Attack Mode XP correctly without ranking up', () => {
            const results = calculateQuizResults(5, true, 0); // 5 * 20 = 100xp
            assert.strictEqual(results.newXp, 100);
            assert.strictEqual(results.hasRankedUp, false);
            assert.strictEqual(results.newRankData, null);
        });

        it('should detect a rank up and return new rank data', () => {
            const results = calculateQuizResults(10, false, 1200); // 1200 + 10*10 = 1300xp (crosses 1250 milestone)
            assert.strictEqual(results.newXp, 1300);
            assert.strictEqual(results.hasRankedUp, true);
            assert.deepEqual(results.newRankData, {
                title: "Rank 1",
                level: "Basic (Advanced)",
                color: "text-blue-400"
            });
        });

        it('should not rank up if exactly on the boundary from the start', () => {
            const results = calculateQuizResults(5, false, 1250);
            assert.strictEqual(results.newXp, 1300);
            assert.strictEqual(results.hasRankedUp, false);
            assert.strictEqual(results.newRankData, null);
        });
    });
});

import { performance } from 'perf_hooks';

// Mock data
const mockQuestions = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    question: `Question ${i}`,
    options: ['A', 'B', 'C', 'D']
}));

const shuffle = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

function runBaseline() {
    let pool = [...mockQuestions];
    const limit = 20;
    const actualLimit = Math.min(pool.length, limit);

    const selectedQuestions = pool.splice(0, actualLimit);

    const randomized = selectedQuestions.map(q => ({
        ...q, options: shuffle(q.options)
    }));
    return randomized;
}

function runOptimized() {
    let pool = [...mockQuestions];
    const limit = 20;
    const actualLimit = Math.min(pool.length, limit);

    // Instead of multiple map and shuffle calls, we can do it more efficiently
    const randomized = [];
    for (let i = 0; i < actualLimit; i++) {
        // Since we are taking from the start of the array, pool.splice(0, actualLimit) is basically what we need
        // but pool is already populated, wait the original code is:
        // const selectedQuestions = pool.splice(0, actualLimit);
        // const randomized = selectedQuestions.map(q => ({ ...q, options: shuffle(q.options) }));
        const q = pool.shift();

        // Inline shuffle options
        const opts = [...q.options];
        for (let j = opts.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [opts[j], opts[k]] = [opts[k], opts[j]];
        }
        randomized.push({ ...q, options: opts });
    }
    return randomized;
}

const ITERATIONS = 10000;

const startBaseline = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    runBaseline();
}
const endBaseline = performance.now();
console.log(`Baseline: ${endBaseline - startBaseline} ms`);

const startOptimized = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    runOptimized();
}
const endOptimized = performance.now();
console.log(`Optimized: ${endOptimized - startOptimized} ms`);

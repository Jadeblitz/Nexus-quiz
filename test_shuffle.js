import assert from 'assert';
import { shuffle } from './shuffle.js';

function runTests() {
  console.log('Running tests for shuffle utility...\n');

  // Test 1: Should not mutate the original array
  try {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    const shuffled = shuffle(original);

    assert.deepStrictEqual(original, copy, 'Original array was mutated');
    assert.notStrictEqual(original, shuffled, 'Returned array is the same reference as the original');
    console.log('✅ Test 1 Passed: Does not mutate original array');
  } catch (error) {
    console.error('❌ Test 1 Failed:', error.message);
    process.exit(1);
  }

  // Test 2: Should return an array of the same length
  try {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffle(original);

    assert.strictEqual(shuffled.length, original.length, `Expected length ${original.length}, got ${shuffled.length}`);
    console.log('✅ Test 2 Passed: Returns array of the same length');
  } catch (error) {
    console.error('❌ Test 2 Failed:', error.message);
    process.exit(1);
  }

  // Test 3: Should contain the exact same elements
  try {
    const original = [1, 2, 3, 4, 5, 5, 6];
    const shuffled = shuffle(original);

    const originalSorted = [...original].sort();
    const shuffledSorted = [...shuffled].sort();

    assert.deepStrictEqual(originalSorted, shuffledSorted, 'Shuffled array contains different elements');
    console.log('✅ Test 3 Passed: Contains the exact same elements');
  } catch (error) {
    console.error('❌ Test 3 Failed:', error.message);
    process.exit(1);
  }

  // Test 4: Should handle an empty array
  try {
    const original = [];
    const shuffled = shuffle(original);

    assert.deepStrictEqual(shuffled, [], 'Failed to handle empty array');
    console.log('✅ Test 4 Passed: Handles empty array');
  } catch (error) {
    console.error('❌ Test 4 Failed:', error.message);
    process.exit(1);
  }

  // Test 5: Should handle a single-element array
  try {
    const original = [42];
    const shuffled = shuffle(original);

    assert.deepStrictEqual(shuffled, [42], 'Failed to handle single-element array');
    console.log('✅ Test 5 Passed: Handles single-element array');
  } catch (error) {
    console.error('❌ Test 5 Failed:', error.message);
    process.exit(1);
  }

  // Test 6: Should actually shuffle the array (non-deterministic, but very likely to change order for a large array)
  try {
    const original = Array.from({ length: 100 }, (_, i) => i);
    let changed = false;

    // Give it a few tries to shuffle at least once
    for (let i = 0; i < 5; i++) {
      const shuffled = shuffle(original);
      // Check if at least one element is in a different position
      for (let j = 0; j < original.length; j++) {
        if (original[j] !== shuffled[j]) {
          changed = true;
          break;
        }
      }
      if (changed) break;
    }

    assert.ok(changed, 'Array was not shuffled after 5 attempts');
    console.log('✅ Test 6 Passed: Actually shuffles the array elements');
  } catch (error) {
    console.error('❌ Test 6 Failed:', error.message);
    process.exit(1);
  }

  console.log('\n🎉 All tests passed successfully!');
}

runTests();

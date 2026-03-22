import assert from 'assert';
import { parseData } from './utils.js';

function runTests() {
  console.log("Running parseData tests...");
  let passed = 0;
  let total = 0;

  function runTest(name, testFn) {
    total++;
    try {
      testFn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (e) {
      console.error(`❌ ${name}`);
      console.error(e);
    }
  }

  runTest("Happy path", () => {
    const data = { science: { foundational: [ ["Q1", "A1", "W1", "W2", "W3"] ] } };
    const res = parseData(data);
    assert.strictEqual(res.science.foundational.length, 1);
    assert.strictEqual(res.science.foundational[0].text, "Q1");
  });

  runTest("Incomplete question defaults", () => {
    const data = { math: { adv: [ ["", "A1", "", null, undefined] ] } };
    const res = parseData(data);
    assert.strictEqual(res.math.adv.length, 1);
    assert.strictEqual(res.math.adv[0].text, "Question text missing");
    assert.strictEqual(res.math.adv[0].options[0].text, "A1");
    assert.strictEqual(res.math.adv[0].options[1].text, "B");
    assert.strictEqual(res.math.adv[0].options[2].text, "C");
    assert.strictEqual(res.math.adv[0].options[3].text, "D");
  });

  runTest("Malformed elements in questions array", () => {
    const data = { lore: { found: [ null, "string", [], ["1 item"], ["Valid", "Ans"] ] } };
    const res = parseData(data);
    assert.strictEqual(res.lore.found.length, 1);
    assert.strictEqual(res.lore.found[0].text, "Valid");
  });

  runTest("Category is not an array", () => {
    const data = { test: { weird: "Not array" } };
    const res = parseData(data);
    assert.ok(Array.isArray(res.test.weird));
    assert.strictEqual(res.test.weird.length, 0);
  });

  runTest("Array with empty question/correct answer", () => {
    const data = { lore: { found: [ ["", "", "Wrong 1", "Wrong 2", "Wrong 3"] ] } };
    const res = parseData(data);
    assert.strictEqual(res.lore.found.length, 1);
    assert.strictEqual(res.lore.found[0].text, "Question text missing");
    assert.strictEqual(res.lore.found[0].options[0].text, "A");
    assert.strictEqual(res.lore.found[0].options[1].text, "Wrong 1");
  });

  runTest("Null/undefined values as array items", () => {
    const data = { lore: { found: [ [null, undefined, null, undefined, null] ] } };
    const res = parseData(data);
    assert.strictEqual(res.lore.found.length, 1);
    assert.strictEqual(res.lore.found[0].text, "Question text missing");
    assert.strictEqual(res.lore.found[0].options[0].text, "A");
    assert.strictEqual(res.lore.found[0].options[1].text, "B");
    assert.strictEqual(res.lore.found[0].options[2].text, "C");
    assert.strictEqual(res.lore.found[0].options[3].text, "D");
  });

  runTest("Empty array in question", () => {
    const data = { lore: { found: [ [] ] } };
    const res = parseData(data);
    // the check is `q && Array.isArray(q) && q.length > 1` so it should skip an empty array
    assert.strictEqual(res.lore.found.length, 0);
  });

  runTest("Objects instead of strings", () => {
    const data = { lore: { found: [ [{}, {}, {}, {}, {}] ] } };
    const res = parseData(data);
    assert.strictEqual(res.lore.found.length, 1);
    // It should ideally not crash and keep the object as text (since Javascript stringifies object as [object Object] typically or passes the object).
    // The current code passes `q[0] || ...`, since `{}` is truthy, it's used.
    assert.ok(typeof res.lore.found[0].text === 'object' || typeof res.lore.found[0].text === 'string');
  });

  console.log(`\nResults: ${passed}/${total} passed`);
  if (passed !== total) process.exit(1);
}

runTests();

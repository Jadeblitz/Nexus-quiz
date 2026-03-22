import test from 'node:test';
import assert from 'node:assert';
import { parseData } from './parser.js';

test('parseData - happy path', () => {
  const input = {
    science: {
      foundational: [
        ["Question 1", "Correct", "Wrong1", "Wrong2", "Wrong3"]
      ]
    }
  };

  const result = parseData(input);

  assert.deepEqual(result, {
    science: {
      foundational: [
        {
          id: 'science_foundational_0',
          text: 'Question 1',
          options: [
            { text: 'Correct', isCorrect: true },
            { text: 'Wrong1', isCorrect: false },
            { text: 'Wrong2', isCorrect: false },
            { text: 'Wrong3', isCorrect: false }
          ]
        }
      ]
    }
  });
});

test('parseData - malformed array missing text', () => {
  const input = {
    math: {
      advanced: [
        ["Just one item"] // Length is 1, so it shouldn't load
      ]
    }
  };

  const result = parseData(input);
  assert.deepEqual(result.math.advanced, []);
});

test('parseData - handles missing data gracefully', () => {
  const input = {
    history: {
      foundational: null // Not an array, should not crash and just create an empty array
    }
  };

  const result = parseData(input);
  assert.deepEqual(result.history.foundational, []);
});

test('parseData - gracefully skips broken questions completely', () => {
  const input = {
    science: {
      foundational: [
        ["Question 1", "Correct", "Wrong1", "Wrong2", "Wrong3"],
        null, // Broken question
        undefined,
        "not an array",
        ["Question 2", "A", "B", "C", "D"]
      ]
    }
  };

  const result = parseData(input);

  assert.equal(result.science.foundational.length, 2);
  assert.equal(result.science.foundational[0].text, "Question 1");
  assert.equal(result.science.foundational[1].text, "Question 2");
  assert.equal(result.science.foundational[1].id, "science_foundational_4"); // Index is preserved from original array iteration
});

test('parseData - applies default text for missing options if array length > 1 but < 5', () => {
  const input = {
    tech: {
      foundational: [
        ["Q", "Correct"] // Length 2
      ]
    }
  };

  const result = parseData(input);

  assert.equal(result.tech.foundational.length, 1);
  assert.equal(result.tech.foundational[0].options[0].text, "Correct");
  assert.equal(result.tech.foundational[0].options[1].text, "B");
  assert.equal(result.tech.foundational[0].options[2].text, "C");
  assert.equal(result.tech.foundational[0].options[3].text, "D");
});

test('parseData - creates empty categories if no data provided', () => {
  const input = {
    emptySubject: {
      diff1: [],
      diff2: "wrong type"
    }
  };

  const result = parseData(input);
  assert.deepEqual(result.emptySubject.diff1, []);
  assert.deepEqual(result.emptySubject.diff2, []);
});

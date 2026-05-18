import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseData } from './utils.js';

describe('utils.js', () => {
  describe('parseData', () => {
    it('parses valid question data correctly', () => {
      const data = {
        math: {
          foundational: [
            ['What is 1+1?', '2', '3', '4', '5']
          ]
        }
      };

      const parsed = parseData(data);

      expect(parsed).toEqual({
        math: {
          foundational: [
            {
              id: 'math_foundational_0',
              text: 'What is 1+1?',
              options: [
                { text: '2', isCorrect: true },
                { text: '3', isCorrect: false },
                { text: '4', isCorrect: false },
                { text: '5', isCorrect: false }
              ]
            }
          ]
        }
      });
    });

    it('handles missing question options gracefully with defaults', () => {
      const data = {
        math: {
          foundational: [
            // Note: utils.js checks for `q.length > 1`, so we need at least one option
            // to trigger the parsing logic. If it only had 1 element, it would be skipped.
            ['What is 1+1?', '2'] // Missing options for wrong answers
          ]
        }
      };

      const parsed = parseData(data);

      expect(parsed).toEqual({
        math: {
          foundational: [
            {
              id: 'math_foundational_0',
              text: 'What is 1+1?',
              options: [
                { text: '2', isCorrect: true },
                { text: 'B', isCorrect: false },
                { text: 'C', isCorrect: false },
                { text: 'D', isCorrect: false }
              ]
            }
          ]
        }
      });
    });

    it('skips a broken question when data parsing throws an error', () => {
      // Mock console.error to check if it's called with the correct message
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Create a mock proxy array that will throw an error when its first element is accessed
      // Since it's passed as `q` inside parseData: `q[0] || "Question text missing"`
      // We will throw when getting index '0'
      const brokenQuestion = new Proxy([], {
        get(target, prop) {
          if (prop === '0') {
            throw new Error('Simulated parsing error');
          }
          if (prop === 'length') {
            return 2; // Needs to be > 1 to pass `q.length > 1`
          }
          return Reflect.get(target, prop);
        }
      });

      const data = {
        science: {
          advanced: [
            ['Valid question', 'A', 'B', 'C', 'D'],
            brokenQuestion,
            ['Another valid question', 'W', 'X', 'Y', 'Z']
          ]
        }
      };

      const parsed = parseData(data);

      // Should contain only the 2 valid questions
      expect(parsed.science.advanced).toHaveLength(2);
      expect(parsed.science.advanced[0].id).toBe('science_advanced_0');
      expect(parsed.science.advanced[0].text).toBe('Valid question');

      // The broken question was at idx 1, so the third element in original array is at idx 2
      expect(parsed.science.advanced[1].id).toBe('science_advanced_2');
      expect(parsed.science.advanced[1].text).toBe('Another valid question');

      // Ensure console.error was called
      expect(consoleSpy).toHaveBeenCalledWith('Skipped a broken question in science');

      // Restore console.error
      consoleSpy.mockRestore();
    });

    it('creates empty categories if difficulty array is empty or undefined', () => {
      const data = {
        history: {
          advanced: []
        }
      };

      const parsed = parseData(data);
      expect(parsed.history.advanced).toEqual([]);
    });
  });
});

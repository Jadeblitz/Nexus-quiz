import { describe, it, expect } from 'vitest';
import { calculateBaseGain } from './quizLogic';

describe('calculateBaseGain', () => {
  it('should return 10 for basic difficulty and generic subject', () => {
    expect(calculateBaseGain({ id: 'foundational' }, { id: 'math' })).toBe(10);
  });

  it('should return 30 for intermediate difficulty and lore subject', () => {
    expect(calculateBaseGain({ id: 'intermediate' }, { id: 'lore' })).toBe(30);
  });

  it('should return 20 for intermediate difficulty and tech subject', () => {
    expect(calculateBaseGain({ id: 'intermediate' }, { id: 'tech' })).toBe(20);
  });

  it('should return 15 for intermediate difficulty and generic subject', () => {
    expect(calculateBaseGain({ id: 'intermediate' }, { id: 'math' })).toBe(15);
  });

  it('should return 50 for advanced difficulty and lore subject', () => {
    expect(calculateBaseGain({ id: 'advanced' }, { id: 'lore' })).toBe(50);
  });

  it('should return 30 for advanced difficulty and tech subject', () => {
    expect(calculateBaseGain({ id: 'advanced' }, { id: 'tech' })).toBe(30);
  });

  it('should return 20 for advanced difficulty and generic subject', () => {
    expect(calculateBaseGain({ id: 'advanced' }, { id: 'math' })).toBe(20);
  });

  it('should handle missing selectedDifficulty or selectedSubject gracefully', () => {
    expect(calculateBaseGain(null, null)).toBe(10);
    expect(calculateBaseGain({ id: 'intermediate' }, null)).toBe(15);
    expect(calculateBaseGain({ id: 'advanced' }, null)).toBe(20);
  });
});

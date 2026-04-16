import React, { useEffect } from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GameProvider, useGame, getRank } from './GameContext';
import { Haptics, NotificationType, ImpactStyle } from '@capacitor/haptics';

// Mocks
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()) // returns unsubscribe function
}));

vi.mock('../config/firebase', () => ({
  db: {}
}));

vi.mock('@capacitor-firebase/authentication', () => ({
  FirebaseAuthentication: {
    addListener: vi.fn(),
    getCurrentUser: vi.fn().mockResolvedValue({ user: null })
  }
}));

vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    notification: vi.fn().mockResolvedValue(),
    impact: vi.fn().mockResolvedValue()
  },
  ImpactStyle: { Heavy: 'HEAVY' },
  NotificationType: { Success: 'SUCCESS' }
}));

// Mock Audio
class MockAudio {
  constructor() {}
  play() {
    return Promise.resolve();
  }
  pause() {}
}
global.Audio = MockAudio;

const TestComponent = ({ testAction }) => {
  const game = useGame();

  useEffect(() => {
    if (testAction) {
      testAction(game);
    }
  }, [testAction, game]);

  return (
    <div>
      <div data-testid="score">{game.score}</div>
      <div data-testid="streak">{game.streak}</div>
      <div data-testid="sessionXp">{game.sessionXp}</div>
      <div data-testid="isChecking">{String(game.isChecking)}</div>
      <div data-testid="selectedAnswerIndex">{game.selectedAnswerIndex}</div>
      <div data-testid="currentIndex">{game.currentIndex}</div>
      <div data-testid="showStreakBonus">{String(game.showStreakBonus)}</div>
      <button data-testid="btn-correct" onClick={() => game.handleAnswer(1, true)}>Answer Correct</button>
      <button data-testid="btn-incorrect" onClick={() => game.handleAnswer(2, false)}>Answer Incorrect</button>
    </div>
  );
};
describe('GameContext - handleAnswer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('handles a correct answer correctly', async () => {
    const action = (game) => {
      if (game.score === 0 && !game.isChecking && game.sessionXp === 0 && game.questions.length === 0) {
        act(() => {
            game.setSelectedSubject({ id: 'lore' });
            game.setSelectedDifficulty({ id: 'intermediate' });
            game.setQuestions([{}, {}]);
            game.setCurrentIndex(0);
            game.setScore(0);
            game.setSessionXp(0);
            game.setStreak(0);
            game.setSettings({ sfxEnabled: true, hapticsEnabled: true });
        });
      }
    };

    render(
      <GameProvider>
        <TestComponent testAction={action} />
      </GameProvider>
    );

    await act(async () => {
      screen.getByTestId('btn-correct').click();
    });

    expect(screen.getByTestId('score').textContent).toBe('1');
    expect(screen.getByTestId('streak').textContent).toBe('1');
    expect(screen.getByTestId('sessionXp').textContent).toBe('30');
    expect(screen.getByTestId('isChecking').textContent).toBe('true');
    expect(screen.getByTestId('selectedAnswerIndex').textContent).toBe('1');
    expect(Haptics.notification).toHaveBeenCalledWith({ type: NotificationType.Success });

    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.getByTestId('isChecking').textContent).toBe('false');
    expect(screen.getByTestId('currentIndex').textContent).toBe('1');
    expect(screen.getByTestId('selectedAnswerIndex').textContent).toBe('');
  });

  it('handles an incorrect answer correctly', async () => {
    const action = (game) => {
      if (game.score === 0 && !game.isChecking && game.sessionXp === 0 && game.questions.length === 0) {
        act(() => {
            game.setSelectedSubject({ id: 'tech' });
            game.setSelectedDifficulty({ id: 'advanced' });
            game.setQuestions([{}, {}]);
            game.setCurrentIndex(0);
            game.setScore(5);
            game.setSessionXp(100);
            game.setStreak(3);
            game.setSettings({ sfxEnabled: true, hapticsEnabled: true });
        });
      }
    };

    render(
      <GameProvider>
        <TestComponent testAction={action} />
      </GameProvider>
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    await act(async () => {
      screen.getByTestId('btn-incorrect').click();
    });

    expect(screen.getByTestId('score').textContent).toBe('5');
    expect(screen.getByTestId('streak').textContent).toBe('0');
    expect(screen.getByTestId('sessionXp').textContent).toBe('85');

    expect(screen.getByTestId('isChecking').textContent).toBe('true');
    expect(screen.getByTestId('selectedAnswerIndex').textContent).toBe('2');
    expect(Haptics.impact).toHaveBeenCalledWith({ style: ImpactStyle.Heavy });

    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.getByTestId('isChecking').textContent).toBe('false');
    expect(screen.getByTestId('currentIndex').textContent).toBe('1');
    expect(screen.getByTestId('selectedAnswerIndex').textContent).toBe('');
  });

  it('handles streak bonuses correctly', async () => {
    const action = (game) => {
      if (game.score === 0 && !game.isChecking && game.sessionXp === 0 && game.questions.length === 0) {
        act(() => {
            game.setSelectedSubject({ id: 'science' });
            game.setSelectedDifficulty({ id: 'foundational' });
            game.setQuestions([{}, {}]);
            game.setCurrentIndex(0);
            game.setScore(4);
            game.setSessionXp(40);
            game.setStreak(4);
            game.setSettings({ sfxEnabled: true, hapticsEnabled: true });
        });
      }
    };

    render(
      <GameProvider>
        <TestComponent testAction={action} />
      </GameProvider>
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    await act(async () => {
      screen.getByTestId('btn-correct').click();
    });

    expect(screen.getByTestId('score').textContent).toBe('5');
    expect(screen.getByTestId('streak').textContent).toBe('5');
    expect(screen.getByTestId('sessionXp').textContent).toBe('70');
    expect(screen.getByTestId('showStreakBonus').textContent).toBe('true');

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId('showStreakBonus').textContent).toBe('false');
  });

  it('finishes quiz when on last question', async () => {
    const action = (game) => {
      if (game.score === 0 && !game.isChecking && game.questions.length === 0) {
        act(() => {
            game.setSelectedSubject({ id: 'science' });
            game.setSelectedDifficulty({ id: 'foundational' });
            game.setQuestions([{}]);
            game.setCurrentIndex(0);
            game.setScore(0);
            game.setSessionXp(0);
            game.setStreak(0);
        });
      }
    };

    render(
      <GameProvider>
        <TestComponent testAction={action} />
      </GameProvider>
    );

    await act(async () => {
      vi.advanceTimersByTime(1);
    });

    await act(async () => {
      screen.getByTestId('btn-correct').click();
    });

    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.getByTestId('isChecking').textContent).toBe('false');
    expect(screen.getByTestId('selectedAnswerIndex').textContent).toBe('');
  });
});

describe('GameContext - getRank', () => {
  it('should return Basic (Beginner) for 0 or negative xp', () => {
    expect(getRank(0)).toEqual({
      title: 'Rank 1',
      level: 'Basic (Beginner)',
      color: 'text-blue-400'
    });
    expect(getRank(-10)).toEqual({
      title: 'Rank 1',
      level: 'Basic (Beginner)',
      color: 'text-blue-400'
    });
  });

  it('should return correct rank for intermediate xp', () => {
    // 1 step = 1250.
    // 13 steps * 1250 = 16250 => stepIndex = 13
    // rankIndex = Math.min(Math.floor(13 / 3), 12) = Math.min(4, 12) = 4 (Veteran)
    // subLevelIndex = Math.min(13 % 3, 2) = 1 (Advanced)
    expect(getRank(13 * 1250)).toEqual({
      title: 'Rank 5',
      level: 'Veteran (Advanced)',
      color: 'text-blue-400'
    });
  });

  it('should cap at God (Peak) for non-admins when xp is very high', () => {
    // Cap is at 13 * 3 * 1250 = 48750
    expect(getRank(48750, false)).toEqual({
      title: 'Rank 13',
      level: 'God (Peak)',
      color: 'text-rose-500'
    });
    expect(getRank(50000, false)).toEqual({
      title: 'Rank 13',
      level: 'God (Peak)',
      color: 'text-rose-500'
    });
  });

  it('should return True God for admins when xp is at or above cap', () => {
    expect(getRank(48750, true)).toEqual({
      title: 'Rank 14',
      level: 'True God',
      color: 'text-amber-400 font-black'
    });
    expect(getRank(100000, true)).toEqual({
      title: 'Rank 14',
      level: 'True God',
      color: 'text-amber-400 font-black'
    });
  });

  it('should return proper color formatting for higher ranks', () => {
    // rankIndex >= 8 is text-purple-400
    // rankIndex 8 => 8 * 3 * 1250 = 30000 => Emperor
    expect(getRank(30000)).toEqual({
      title: 'Rank 9',
      level: 'Emperor (Beginner)',
      color: 'text-purple-400'
    });

    // rankIndex >= 11 is text-rose-500
    // rankIndex 11 => 11 * 3 * 1250 = 41250 => Primordial
    expect(getRank(41250)).toEqual({
      title: 'Rank 12',
      level: 'Primordial (Beginner)',
      color: 'text-rose-500'
    });
  });
});

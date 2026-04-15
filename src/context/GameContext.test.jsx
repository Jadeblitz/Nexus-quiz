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


describe('GameContext - getRank', () => {
  it('handles zero and negative xp', () => {
    expect(getRank(0)).toEqual({ title: 'Rank 1', level: 'Basic (Beginner)', color: 'text-blue-400' });
    expect(getRank(-100)).toEqual({ title: 'Rank 1', level: 'Basic (Beginner)', color: 'text-blue-400' });
  });

  it('handles basic progression (Beginner -> Advanced -> Peak)', () => {
    expect(getRank(1249)).toEqual({ title: 'Rank 1', level: 'Basic (Beginner)', color: 'text-blue-400' });
    expect(getRank(1250)).toEqual({ title: 'Rank 1', level: 'Basic (Advanced)', color: 'text-blue-400' });
    expect(getRank(2500)).toEqual({ title: 'Rank 1', level: 'Basic (Peak)', color: 'text-blue-400' });
  });

  it('handles rank progression (Basic -> Novice)', () => {
    expect(getRank(3750)).toEqual({ title: 'Rank 2', level: 'Novice (Beginner)', color: 'text-blue-400' });
  });

  it('handles color assignments correctly', () => {
    // Rank 8 (index 7) is text-blue-400, Rank 9 (index 8) is text-purple-400
    // Rank 9 starts at stepIndex = 8 * 3 = 24. 24 * 1250 = 30000
    expect(getRank(29999).color).toBe('text-blue-400');
    expect(getRank(30000).color).toBe('text-purple-400');

    // Rank 11 starts at index 10 -> step 30. 30 * 1250 = 37500
    // Rank 12 starts at index 11 -> step 33. 33 * 1250 = 41250
    // wait, rankIndex >= 11 means rank 12.
    expect(getRank(41249).color).toBe('text-purple-400');
    expect(getRank(41250).color).toBe('text-rose-500');
  });

  it('handles max XP for non-admins', () => {
    // Max XP logic: if xp >= 13 * 3 * 1250 = 48750
    expect(getRank(48750)).toEqual({ title: 'Rank 13', level: 'God (Peak)', color: 'text-rose-500' });
    expect(getRank(1000000)).toEqual({ title: 'Rank 13', level: 'God (Peak)', color: 'text-rose-500' });
  });

  it('handles max XP for admins', () => {
    expect(getRank(48750, true)).toEqual({ title: 'Rank 14', level: 'True God', color: 'text-amber-400 font-black' });
    expect(getRank(1000000, true)).toEqual({ title: 'Rank 14', level: 'True God', color: 'text-amber-400 font-black' });
  });
});

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

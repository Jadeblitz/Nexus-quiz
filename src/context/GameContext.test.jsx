import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { GameProvider, useGame } from './GameContext';

// Mock Capacitor plugins
vi.mock('@capacitor-firebase/authentication', () => ({
  FirebaseAuthentication: {
    addListener: vi.fn(),
    getCurrentUser: vi.fn(() => Promise.resolve({ user: null })),
  }
}));

vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    notification: vi.fn(),
    impact: vi.fn(),
  },
  ImpactStyle: { Heavy: 'HEAVY' },
  NotificationType: { Success: 'SUCCESS' },
}));

// Mock Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
}));

// Mock HTMLAudioElement
window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
window.HTMLMediaElement.prototype.pause = vi.fn();

// We need to mock alert as it's used in startQuiz
const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

// A test component to interact with the context
const TestComponent = () => {
  const {
    startQuiz,
    gameState,
    isTimeAttack,
    timeLeft,
    streak,
    questions,
    setSelectedSubject,
    setSelectedDifficulty
  } = useGame();

  return (
    <div>
      <div data-testid="gameState">{gameState}</div>
      <div data-testid="isTimeAttack">{isTimeAttack ? 'true' : 'false'}</div>
      <div data-testid="timeLeft">{timeLeft}</div>
      <div data-testid="streak">{streak}</div>
      <div data-testid="questionsLength">{questions.length}</div>

      <button onClick={() => {
        setSelectedSubject({ id: 'lore' });
        setSelectedDifficulty({ id: 'foundational' });
      }}>
        Set Valid Selection
      </button>

      <button onClick={() => {
        setSelectedSubject({ id: 'invalid_subject' });
        setSelectedDifficulty({ id: 'invalid_diff' });
      }}>
        Set Invalid Selection
      </button>

      <button onClick={() => startQuiz(false)}>Start Normal</button>
      <button onClick={() => startQuiz(true)}>Start Time Attack</button>
    </div>
  );
};

describe('GameContext - startQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reset state and set up for a normal game', async () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Initial state setup is somewhat async because of auth effects,
    // but the button clicks will interact with the current state.

    // Set valid subject/difficulty
    fireEvent.click(screen.getByText('Set Valid Selection'));

    // Start normal quiz
    await act(async () => {
      fireEvent.click(screen.getByText('Start Normal'));
    });

    expect(screen.getByTestId('isTimeAttack').textContent).toBe('false');
    expect(screen.getByTestId('timeLeft').textContent).toBe('60');
    expect(screen.getByTestId('streak').textContent).toBe('0');
    expect(screen.getByTestId('gameState').textContent).toBe('playing');

    // Normal limit is 10 questions
    const qLen = parseInt(screen.getByTestId('questionsLength').textContent, 10);
    expect(qLen).toBeGreaterThan(0);
    expect(qLen).toBeLessThanOrEqual(10);
  });

  it('should reset state and set up for time attack game', async () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Set valid subject/difficulty
    fireEvent.click(screen.getByText('Set Valid Selection'));

    // Start normal quiz
    await act(async () => {
      fireEvent.click(screen.getByText('Start Time Attack'));
    });

    expect(screen.getByTestId('isTimeAttack').textContent).toBe('true');
    expect(screen.getByTestId('timeLeft').textContent).toBe('60');
    expect(screen.getByTestId('streak').textContent).toBe('0');
    expect(screen.getByTestId('gameState').textContent).toBe('playing');

    // Time Attack limit is 20 questions
    const qLen = parseInt(screen.getByTestId('questionsLength').textContent, 10);
    expect(qLen).toBeGreaterThan(0);
    expect(qLen).toBeLessThanOrEqual(20);
  });

  it('should handle missing questions for a subject/difficulty gracefully', async () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Set invalid subject/difficulty
    fireEvent.click(screen.getByText('Set Invalid Selection'));

    // Start normal quiz
    await act(async () => {
      fireEvent.click(screen.getByText('Start Normal'));
    });

    expect(alertMock).toHaveBeenCalledWith("No questions available for this level yet!");
    expect(screen.getByTestId('gameState').textContent).toBe('subject_select');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React, { useContext } from 'react';
import { GameProvider, GameContext } from './GameContext';

// Mock Capacitor plugins
vi.mock('@capacitor-firebase/authentication', () => {
  let authCallback = null;
  return {
    FirebaseAuthentication: {
      addListener: vi.fn((event, callback) => {
        if (event === 'authStateChange') authCallback = callback;
        return { remove: vi.fn() };
      }),
      getCurrentUser: vi.fn(() => Promise.resolve({ user: { uid: 'test-uid', displayName: 'Test User' } })),
      __triggerAuthChange: (user) => {
        if (authCallback) authCallback({ user });
      }
    }
  };
});

vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    notification: vi.fn(),
    impact: vi.fn(),
  },
  ImpactStyle: { Heavy: 'HEAVY' },
  NotificationType: { Success: 'SUCCESS' },
}));

// Mock Firebase config
vi.mock('../config/firebase', () => ({
  db: {}
}));

// Mock Firebase Firestore methods
const getDocMock = vi.fn();
const setDocMock = vi.fn();
const docMock = vi.fn();

vi.mock('firebase/firestore', () => ({
  getDoc: (...args) => getDocMock(...args),
  setDoc: (...args) => setDocMock(...args),
  doc: (...args) => docMock(...args),
}));

// Test component to read context state
const TestComponent = () => {
  const { stats, gameState, isLoading } = useContext(GameContext);
  return (
    <div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
      <div data-testid="game-state">{gameState}</div>
      <div data-testid="total-xp">{stats.totalXp}</div>
      <div data-testid="completed">{stats.completed}</div>
      <div data-testid="passes">{JSON.stringify(stats.passes)}</div>
    </div>
  );
};

describe('GameContext - Firebase Persistence Fallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fallback to Guest state when Firebase persistence fails on getDoc', async () => {
    // Make getDoc throw an error to simulate Firebase persistence failure
    const errorMsg = 'Firebase error on getDoc';
    getDocMock.mockRejectedValueOnce(new Error(errorMsg));
    docMock.mockReturnValue('mocked-doc-ref');

    // Spy on console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(
        <GameProvider>
          <TestComponent />
        </GameProvider>
      );
    });

    // We wait for the promise rejection and state updates to settle
    // The context should transition out of loading state
    expect(screen.getByTestId('is-loading').textContent).toBe('false');

    // The stats should be set to the fallback guest state ({ totalXp: 0, completed: 0, passes: {} })
    expect(screen.getByTestId('total-xp').textContent).toBe('0');
    expect(screen.getByTestId('completed').textContent).toBe('0');
    expect(screen.getByTestId('passes').textContent).toBe('{}');

    // Check that console.error was called with our simulated error
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Firebase persistence failed, falling back to Guest state:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should fallback to Guest state when Firebase persistence fails on setDoc', async () => {
    // Make getDoc return non-existent document
    getDocMock.mockResolvedValueOnce({ exists: () => false });
    // Make setDoc throw an error
    const errorMsg = 'Firebase error on setDoc';
    setDocMock.mockRejectedValueOnce(new Error(errorMsg));
    docMock.mockReturnValue('mocked-doc-ref');

    // Spy on console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      render(
        <GameProvider>
          <TestComponent />
        </GameProvider>
      );
    });

    // We wait for the promise rejection and state updates to settle
    // The context should transition out of loading state
    expect(screen.getByTestId('is-loading').textContent).toBe('false');

    // The stats should be set to the fallback guest state ({ totalXp: 0, completed: 0, passes: {} })
    expect(screen.getByTestId('total-xp').textContent).toBe('0');
    expect(screen.getByTestId('completed').textContent).toBe('0');
    expect(screen.getByTestId('passes').textContent).toBe('{}');

    // Check that console.error was called with our simulated error
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Firebase persistence failed, falling back to Guest state:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});

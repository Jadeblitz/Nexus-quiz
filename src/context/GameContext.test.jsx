import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { GameProvider, useGame } from './GameContext';
import { getDoc } from 'firebase/firestore';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn()
}));

vi.mock('../config/firebase', () => ({
  db: {}
}));

vi.mock('@capacitor-firebase/authentication', () => ({
  FirebaseAuthentication: {
    addListener: vi.fn(),
    getCurrentUser: vi.fn()
  }
}));

vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    notification: vi.fn(),
    impact: vi.fn()
  },
  NotificationType: {},
  ImpactStyle: {}
}));

const TestComponent = () => {
  const { stats, isLoading } = useGame();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <span data-testid="totalXp">{stats.totalXp}</span>
      <span data-testid="completed">{stats.completed}</span>
      <span data-testid="passes">{JSON.stringify(stats.passes)}</span>
    </div>
  );
};

describe('GameContext - Firebase Persistence Fallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('falls back to Guest state when Firebase persistence fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const mockUser = { uid: 'test-uid', displayName: 'Test User' };

    FirebaseAuthentication.getCurrentUser.mockResolvedValue({ user: mockUser });
    FirebaseAuthentication.addListener.mockImplementation((event, callback) => {
      return { remove: vi.fn() };
    });

    getDoc.mockRejectedValue(new Error('Firebase Network Error'));

    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Firebase persistence failed, falling back to Guest state:",
      expect.any(Error)
    );

    expect(screen.getByTestId('totalXp').textContent).toBe('0');
    expect(screen.getByTestId('completed').textContent).toBe('0');
    expect(screen.getByTestId('passes').textContent).toBe('{}');

    consoleErrorSpy.mockRestore();
  });
});

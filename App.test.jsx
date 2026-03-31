import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import React from 'react';
import App from './App';

// Mock Capacitor plugins used in App.jsx to avoid throwing errors during rendering
vi.mock('@capacitor-firebase/authentication', () => ({
  FirebaseAuthentication: {
    addListener: vi.fn(),
    getCurrentUser: vi.fn(() => Promise.resolve({ user: null })),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithGoogle: vi.fn(),
    signInWithFacebook: vi.fn(),
    signOut: vi.fn(),
  }
}));

vi.mock('@capacitor/app', () => ({
  App: {
    addListener: vi.fn(),
    removeAllListeners: vi.fn(),
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
  onSnapshot: vi.fn(() => vi.fn()) // returns unsubscribe function
}));

// Mock HTMLAudioElement
window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
window.HTMLMediaElement.prototype.pause = vi.fn();

describe('App Component - localStorage fallback logic', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.restoreAllMocks();
  });

  it('should handle corrupted localStorage data and reset it', async () => {
    // Spy on console.log
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Mock localStorage
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'nexus_stats' || key === 'nexus_settings') {
        throw new Error('Corrupted data mock error');
      }
      return null;
    });

    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});

    // Render the app which triggers useEffect
    await act(async () => {
      render(<App />);
    });

    // Assertions
    expect(getItemSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Corrupted save data detected. Resetting.");
    expect(removeItemSpy).toHaveBeenCalledWith('nexus_stats');
    expect(removeItemSpy).toHaveBeenCalledWith('nexus_settings');
  });
});

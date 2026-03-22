import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App.jsx';

// Mock the capacitor and firebase dependencies
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => false
  }
}));

vi.mock('@capacitor-firebase/authentication', () => ({
  FirebaseAuthentication: {
    addListener: vi.fn(() => ({ remove: vi.fn() })),
    getCurrentUser: vi.fn().mockImplementation(() => new Promise(() => {})),
    signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: '123' } }),
    signInWithGoogle: vi.fn().mockResolvedValue({ user: { uid: '123' } }),
    signInWithFacebook: vi.fn().mockResolvedValue({ user: { uid: '123' } }),
    createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: '123' } }),
    signOut: vi.fn().mockResolvedValue(),
  }
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn().mockReturnValue([]),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({ exists: () => true, data: () => ({ rank: 'Novice', score: 0 }) }),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
}));

describe('App - startQuiz coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing and shows login screen', async () => {
    render(<App />);
    expect(screen.getByText(/Prove your knowledge/i)).toBeInTheDocument();
  });

  it('allows user to start a standard quiz and tests startQuiz initialization via guest mode', async () => {
    render(<App />);

    // Click 'Play as Guest' to bypass login
    const guestBtn = screen.getByText('Play as Guest');
    fireEvent.click(guestBtn);

    await waitFor(() => {
      expect(screen.getByText(/Power Level/i)).toBeInTheDocument();
    });

    const scienceCard = screen.getByText('Science & Engineering').closest('button');
    fireEvent.click(scienceCard);

    await waitFor(() => {
      expect(screen.getByText(/Foundational/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Foundational/i));

    await waitFor(() => {
      expect(screen.getByText(/Standard Mode/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Standard Mode/i));

    await waitFor(() => {
      expect(screen.queryByText(/Score:/i)).not.toBeInTheDocument();
    });

    expect(screen.queryByText(/Time Left/i)).not.toBeInTheDocument();
  });

  it('allows user to start a time attack quiz and tests time mode branch', async () => {
    render(<App />);

    // Click 'Play as Guest' to bypass login
    const guestBtn = screen.getByText('Play as Guest');
    fireEvent.click(guestBtn);

    await waitFor(() => {
      expect(screen.getByText(/Power Level/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('History').closest('button'));

    await waitFor(() => {
      expect(screen.getByText(/Intermediate/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/Intermediate/i));

    await waitFor(() => {
      expect(screen.getByText(/Time Attack/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Time Attack/i));

    await waitFor(() => {
      expect(screen.queryByText(/Score:/i)).not.toBeInTheDocument();
    });

    // Test that Time Left is displayed, verifying `setIsTimeAttack(timeMode)` branch
    expect(screen.getByText(/60s/i)).toBeInTheDocument();
  });
});

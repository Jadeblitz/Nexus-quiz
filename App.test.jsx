import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { vi } from 'vitest';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

// Mock Capacitor and Firebase so they don't break JS DOM rendering
vi.mock('@capacitor-firebase/authentication', () => ({
  FirebaseAuthentication: {
    addListener: vi.fn((event, callback) => {
      // Simulate auth state change resolving to not logged in by default
      if (event === 'authStateChange') {
        setTimeout(() => callback({ user: null }), 0);
      }
      return Promise.resolve({ remove: vi.fn() });
    }),
    getCurrentUser: vi.fn().mockResolvedValue({ user: null }),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithGoogle: vi.fn(),
    signInWithFacebook: vi.fn(),
    signOut: vi.fn()
  }
}));

vi.mock('@capacitor/app', () => ({
  App: {
    addListener: vi.fn(),
    removeAllListeners: vi.fn()
  }
}));

vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    impact: vi.fn(),
    notification: vi.fn()
  },
  ImpactStyle: {},
  NotificationType: {}
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn()
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn()
}));

// Mock audio
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    FirebaseAuthentication.getCurrentUser.mockResolvedValue({ user: null });
  });

  it('renders login screen by default when not logged in', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText('NexusQuiz').length).toBeGreaterThan(0);
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    });
  });

  it('navigates to subject select when logged in', async () => {
    FirebaseAuthentication.getCurrentUser.mockResolvedValue({ user: { uid: 'testuid', displayName: 'Test User' } });
    FirebaseAuthentication.addListener.mockImplementation((event, callback) => {
      if (event === 'authStateChange') {
        setTimeout(() => callback({ user: { uid: 'testuid', displayName: 'Test User' } }), 0);
      }
      return Promise.resolve({ remove: vi.fn() });
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('View Hall of Fame')).toBeInTheDocument();
    });
  });

  it('can login as guest', async () => {
    render(<App />);

    const user = userEvent.setup();
    const guestButton = await screen.findByText('Play as Guest');
    await user.click(guestButton);

    await waitFor(() => {
      expect(screen.getByText('View Hall of Fame')).toBeInTheDocument();
    });
  });
});
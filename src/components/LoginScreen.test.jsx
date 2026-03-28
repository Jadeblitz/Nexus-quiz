import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import LoginScreen from './LoginScreen';

describe('LoginScreen Component', () => {
  const defaultProps = {
    email: '',
    setEmail: vi.fn(),
    password: '',
    setPassword: vi.fn(),
    isRegistering: false,
    setIsRegistering: vi.fn(),
    handleLogin: vi.fn(),
    setGameState: vi.fn(),
  };

  it('renders correctly in Login mode', () => {
    render(<LoginScreen {...defaultProps} />);

    // Check titles
    expect(screen.getByText('NexusQuiz')).toBeInTheDocument();
    expect(screen.getByText('Prove your knowledge across the Ordverse.')).toBeInTheDocument();

    // Check inputs
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    // Check buttons
    expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue with Facebook/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Login$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play as Guest/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Don't have an account\? Sign Up/i })).toBeInTheDocument();
  });

  it('renders correctly in Registration mode', () => {
    render(<LoginScreen {...defaultProps} isRegistering={true} />);

    expect(screen.getByRole('button', { name: /^Sign Up$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Already have an account\? Login/i })).toBeInTheDocument();
  });

  it('calls setEmail when email input changes', () => {
    const setEmailMock = vi.fn();
    render(<LoginScreen {...defaultProps} setEmail={setEmailMock} />);

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(setEmailMock).toHaveBeenCalledWith('test@example.com');
  });

  it('calls setPassword when password input changes', () => {
    const setPasswordMock = vi.fn();
    render(<LoginScreen {...defaultProps} setPassword={setPasswordMock} />);

    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(setPasswordMock).toHaveBeenCalledWith('password123');
  });

  it('calls handleLogin with "google" when Google button is clicked', () => {
    const handleLoginMock = vi.fn();
    render(<LoginScreen {...defaultProps} handleLogin={handleLoginMock} />);

    const googleButton = screen.getByRole('button', { name: /Continue with Google/i });
    fireEvent.click(googleButton);

    expect(handleLoginMock).toHaveBeenCalledWith('google');
  });

  it('calls handleLogin with "facebook" when Facebook button is clicked', () => {
    const handleLoginMock = vi.fn();
    render(<LoginScreen {...defaultProps} handleLogin={handleLoginMock} />);

    const facebookButton = screen.getByRole('button', { name: /Continue with Facebook/i });
    fireEvent.click(facebookButton);

    expect(handleLoginMock).toHaveBeenCalledWith('facebook');
  });

  it('calls handleLogin with "email" when Login button is clicked', () => {
    const handleLoginMock = vi.fn();
    render(<LoginScreen {...defaultProps} handleLogin={handleLoginMock} />);

    const loginButton = screen.getByRole('button', { name: /^Login$/i });
    fireEvent.click(loginButton);

    expect(handleLoginMock).toHaveBeenCalledWith('email');
  });

  it('calls handleLogin with "email" when Sign Up button is clicked', () => {
    const handleLoginMock = vi.fn();
    render(<LoginScreen {...defaultProps} isRegistering={true} handleLogin={handleLoginMock} />);

    const signUpButton = screen.getByRole('button', { name: /^Sign Up$/i });
    fireEvent.click(signUpButton);

    expect(handleLoginMock).toHaveBeenCalledWith('email');
  });

  it('calls setGameState with "subject_select" when Play as Guest is clicked', () => {
    const setGameStateMock = vi.fn();
    render(<LoginScreen {...defaultProps} setGameState={setGameStateMock} />);

    const guestButton = screen.getByRole('button', { name: /Play as Guest/i });
    fireEvent.click(guestButton);

    expect(setGameStateMock).toHaveBeenCalledWith('subject_select');
  });

  it('calls setIsRegistering with toggled value when toggle button is clicked', () => {
    const setIsRegisteringMock = vi.fn();

    // Test when isRegistering is false
    const { rerender } = render(
      <LoginScreen {...defaultProps} isRegistering={false} setIsRegistering={setIsRegisteringMock} />
    );

    let toggleButton = screen.getByRole('button', { name: /Don't have an account\? Sign Up/i });
    fireEvent.click(toggleButton);
    expect(setIsRegisteringMock).toHaveBeenCalledWith(true);

    // Clear mock
    setIsRegisteringMock.mockClear();

    // Test when isRegistering is true
    rerender(
      <LoginScreen {...defaultProps} isRegistering={true} setIsRegistering={setIsRegisteringMock} />
    );

    toggleButton = screen.getByRole('button', { name: /Already have an account\? Login/i });
    fireEvent.click(toggleButton);
    expect(setIsRegisteringMock).toHaveBeenCalledWith(false);
  });
});

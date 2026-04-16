import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import Leaderboard from './Leaderboard';

describe('Leaderboard Component', () => {
  const mockSetGameState = vi.fn();

  const defaultProps = {
    props: {
      setGameState: mockSetGameState,
      stats: {
        totalXp: 1250,
      }
    }
  };

  beforeEach(() => {
    mockSetGameState.mockClear();
  });

  it('renders User stats correctly', () => {
    render(<Leaderboard {...defaultProps} />);

    expect(screen.getByText('1250 XP')).toBeInTheDocument();
    expect(screen.getByText('Level 12')).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('renders leaderboard data correctly', () => {
    render(<Leaderboard {...defaultProps} />);

    expect(screen.getByText('Nichothéos')).toBeInTheDocument();
    expect(screen.getByText('99999 XP')).toBeInTheDocument();

    expect(screen.getByText('Daragvener')).toBeInTheDocument();
    expect(screen.getByText('25000 XP')).toBeInTheDocument();

    expect(screen.getByText('Thril_ler')).toBeInTheDocument();
    expect(screen.getByText('12000 XP')).toBeInTheDocument();
  });

  it('calls setGameState when Back Home is clicked', () => {
    render(<Leaderboard {...defaultProps} />);

    const backButton = screen.getByText('Back Home');
    fireEvent.click(backButton);

    expect(mockSetGameState).toHaveBeenCalledWith('subject_select');
    expect(mockSetGameState).toHaveBeenCalledTimes(1);
  });
});

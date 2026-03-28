import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import QuizEngine from './QuizEngine';

// Mock the context
vi.mock('../context/GameContext.jsx', () => ({
  useGame: vi.fn(),
  getRank: vi.fn(() => ({ title: 'Rank 1', level: 'Basic', color: 'text-blue-400' })),
}));

import { useGame } from '../context/GameContext.jsx';

describe('QuizEngine Component', () => {
  const mockHandleAnswer = vi.fn();
  const mockSetGameState = vi.fn();
  const mockHandleShareWrapper = vi.fn();

  const defaultMockState = {
    user: { displayName: 'Test User', uid: '123' },
    stats: { totalXp: 1000 },
    gameState: 'playing',
    setGameState: mockSetGameState,
    isTimeAttack: false,
    timeLeft: 60,
    streak: 0,
    showStreakBonus: false,
    score: 0,
    questions: [
      {
        text: 'What is the capital of France?',
        options: [
          { text: 'Paris', isCorrect: true },
          { text: 'London', isCorrect: false },
        ]
      }
    ],
    currentIndex: 0,
    isChecking: false,
    selectedAnswerIndex: null,
    handleAnswer: mockHandleAnswer,
    handleShareWrapper: mockHandleShareWrapper,
    sessionXp: 50,
    lastPassesNeeded: 0,
    selectedSubject: { id: 'tech' }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing if gameState is not playing, results, or leaderboard', () => {
    useGame.mockReturnValue({ ...defaultMockState, gameState: 'login' });
    const { container } = render(<QuizEngine />);
    expect(container.firstChild).toBeNull();
  });

  describe('playing state', () => {
    it('renders the current question and options', () => {
      useGame.mockReturnValue({ ...defaultMockState });
      render(<QuizEngine />);

      expect(screen.getByText('What is the capital of France?')).toBeTruthy();
      expect(screen.getByText('Paris')).toBeTruthy();
      expect(screen.getByText('London')).toBeTruthy();
    });

    it('calls handleAnswer when an option is clicked', () => {
      useGame.mockReturnValue({ ...defaultMockState });
      render(<QuizEngine />);

      const parisBtn = screen.getByText('Paris');
      fireEvent.click(parisBtn);

      expect(mockHandleAnswer).toHaveBeenCalledWith(0, true);
    });

    it('displays streak and timer when applicable', () => {
      useGame.mockReturnValue({
        ...defaultMockState,
        streak: 3,
        isTimeAttack: true,
        timeLeft: 45
      });
      render(<QuizEngine />);

      expect(screen.getByText('3')).toBeTruthy();
      expect(screen.getByText('45s')).toBeTruthy();
    });

    it('shows streak bonus when showStreakBonus is true', () => {
      useGame.mockReturnValue({ ...defaultMockState, showStreakBonus: true });
      render(<QuizEngine />);

      expect(screen.getByText('+50 XP STREAK!')).toBeTruthy();
    });

    it('disables option buttons when isChecking is true', () => {
      useGame.mockReturnValue({ ...defaultMockState, isChecking: true, selectedAnswerIndex: 0 });
      render(<QuizEngine />);

      const parisBtn = screen.getByText('Paris');
      const londonBtn = screen.getByText('London');

      expect(parisBtn.disabled).toBe(true);
      expect(londonBtn.disabled).toBe(true);
    });
  });

  describe('results state', () => {
    const resultsState = {
      ...defaultMockState,
      gameState: 'results',
      score: 7,
      questions: new Array(10).fill({}),
      sessionXp: 120,
      lastPassesNeeded: 2,
    };

    it('renders the final score and pass grade', () => {
      useGame.mockReturnValue(resultsState);
      render(<QuizEngine />);

      expect(screen.getByText('Quiz Over!')).toBeTruthy();
      expect(screen.getByText('7')).toBeTruthy();
      expect(screen.getByText('/10')).toBeTruthy();
      expect(screen.getByText('Pass')).toBeTruthy(); // 7/10 = 70%
      expect(screen.getByText('+120 XP')).toBeTruthy();
      expect(screen.getByText('Need 2 more Pass(es) to unlock next difficulty!')).toBeTruthy();
    });

    it('renders fail grade correctly', () => {
      useGame.mockReturnValue({ ...resultsState, score: 2 });
      render(<QuizEngine />);

      expect(screen.getByText('Failed')).toBeTruthy(); // 2/10 = 20%
    });

    it('calls handleShareWrapper when Share button is clicked', () => {
      useGame.mockReturnValue(resultsState);
      render(<QuizEngine />);

      const shareBtn = screen.getByText('Share My Score');
      fireEvent.click(shareBtn);

      expect(mockHandleShareWrapper).toHaveBeenCalled();
    });

    it('calls setGameState when Return to Hub is clicked', () => {
      useGame.mockReturnValue(resultsState);
      render(<QuizEngine />);

      const returnBtn = screen.getByText('Return to Hub');
      fireEvent.click(returnBtn);

      expect(mockSetGameState).toHaveBeenCalledWith('subject_select');
    });
  });

  describe('leaderboard state', () => {
    const leaderboardState = {
      ...defaultMockState,
      gameState: 'leaderboard',
      user: { displayName: 'EpicGamer' },
      stats: { totalXp: 5000 }
    };

    it('renders the leaderboard with user stats', () => {
      useGame.mockReturnValue(leaderboardState);
      render(<QuizEngine />);

      expect(screen.getByText('Hall of Fame')).toBeTruthy();
      expect(screen.getByText('EpicGamer')).toBeTruthy();
      expect(screen.getByText('Level 50')).toBeTruthy(); // 5000 / 100
      expect(screen.getByText('5000 XP')).toBeTruthy();

      // Check hardcoded static leaderboard entries
      expect(screen.getByText('Nichothéos')).toBeTruthy();
      expect(screen.getByText('Daragvener')).toBeTruthy();
      expect(screen.getByText('Thril_ler')).toBeTruthy();
    });

    it('calls setGameState when Back Home is clicked', () => {
      useGame.mockReturnValue(leaderboardState);
      render(<QuizEngine />);

      const backBtn = screen.getByText('Back Home');
      fireEvent.click(backBtn);

      expect(mockSetGameState).toHaveBeenCalledWith('subject_select');
    });
  });
});

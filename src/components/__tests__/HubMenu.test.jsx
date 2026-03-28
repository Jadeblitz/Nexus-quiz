import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import HubMenu from '../HubMenu';
import * as GameContextModule from '../../context/GameContext';

// Mock getRank
vi.mock('../../context/GameContext', async () => {
  const actual = await vi.importActual('../../context/GameContext');
  return {
    ...actual,
    useGame: vi.fn(),
    getRank: vi.fn(),
  };
});

describe('HubMenu Component', () => {
  const mockSetGameState = vi.fn();
  const mockSetSelectedSubject = vi.fn();
  const mockSetSelectedDifficulty = vi.fn();
  const mockStartQuiz = vi.fn();

  const mockUseGame = {
    user: { uid: 'test_uid' },
    stats: { totalXp: 1250 },
    gameState: 'subject_select',
    setGameState: mockSetGameState,
    selectedSubject: null,
    setSelectedSubject: mockSetSelectedSubject,
    selectedDifficulty: null,
    setSelectedDifficulty: mockSetSelectedDifficulty,
    startQuiz: mockStartQuiz,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    GameContextModule.useGame.mockReturnValue(mockUseGame);
    GameContextModule.getRank.mockReturnValue({
      title: 'Rank 2',
      level: 'Novice (Beginner)',
      color: 'text-blue-400',
    });
  });

  it('renders subject_select state correctly', () => {
    render(<HubMenu />);

    // Check user info
    expect(screen.getByText('Rank 2')).toBeInTheDocument();
    expect(screen.getByText('Novice (Beginner)')).toBeInTheDocument();
    expect(screen.getByText('1250')).toBeInTheDocument();

    // Check subjects are rendered
    GameContextModule.SUBJECTS.forEach((sub) => {
      expect(screen.getByText(sub.title)).toBeInTheDocument();
    });

    // Check Hall of Fame button
    expect(screen.getByText('View Hall of Fame')).toBeInTheDocument();
  });

  it('handles subject selection', () => {
    render(<HubMenu />);

    // Click on the first subject
    const subjectTitle = GameContextModule.SUBJECTS[0].title;
    const subjectBtn = screen.getByText(subjectTitle).closest('button');
    fireEvent.click(subjectBtn);

    expect(mockSetSelectedSubject).toHaveBeenCalledWith(GameContextModule.SUBJECTS[0]);
    expect(mockSetGameState).toHaveBeenCalledWith('difficulty_select');
  });

  it('handles leaderboard navigation', () => {
    render(<HubMenu />);

    const hofBtn = screen.getByText('View Hall of Fame').closest('button');
    fireEvent.click(hofBtn);

    expect(mockSetGameState).toHaveBeenCalledWith('leaderboard');
  });

  it('renders difficulty_select state correctly', () => {
    GameContextModule.useGame.mockReturnValue({
      ...mockUseGame,
      gameState: 'difficulty_select',
      selectedSubject: GameContextModule.SUBJECTS[0],
    });

    render(<HubMenu />);

    // Check selected subject title
    expect(screen.getByText(GameContextModule.SUBJECTS[0].title)).toBeInTheDocument();

    // Check back button
    expect(screen.getByText('Back')).toBeInTheDocument();

    // Check difficulties are rendered
    GameContextModule.DIFFICULTIES.forEach((diff) => {
      expect(screen.getByText(diff.title)).toBeInTheDocument();
    });
  });

  it('handles difficulty selection', () => {
    GameContextModule.useGame.mockReturnValue({
      ...mockUseGame,
      gameState: 'difficulty_select',
      selectedSubject: GameContextModule.SUBJECTS[0],
    });

    render(<HubMenu />);

    // Click on the first difficulty
    const diffTitle = GameContextModule.DIFFICULTIES[0].title;
    const diffBtn = screen.getByText(diffTitle).closest('button');
    fireEvent.click(diffBtn);

    expect(mockSetSelectedDifficulty).toHaveBeenCalledWith(GameContextModule.DIFFICULTIES[0]);
    expect(mockSetGameState).toHaveBeenCalledWith('mode_select');
  });

  it('handles back navigation from difficulty_select', () => {
    GameContextModule.useGame.mockReturnValue({
      ...mockUseGame,
      gameState: 'difficulty_select',
    });

    render(<HubMenu />);

    const backBtn = screen.getByText('Back').closest('button');
    fireEvent.click(backBtn);

    expect(mockSetGameState).toHaveBeenCalledWith('subject_select');
  });

  it('renders mode_select state correctly', () => {
    GameContextModule.useGame.mockReturnValue({
      ...mockUseGame,
      gameState: 'mode_select',
      selectedSubject: GameContextModule.SUBJECTS[0],
      selectedDifficulty: GameContextModule.DIFFICULTIES[0],
    });

    render(<HubMenu />);

    // Check selected subject and difficulty titles
    expect(screen.getByText(GameContextModule.SUBJECTS[0].title)).toBeInTheDocument();
    expect(screen.getByText(`${GameContextModule.DIFFICULTIES[0].title} Level`)).toBeInTheDocument();

    // Check mode buttons
    expect(screen.getByText('Standard Mode (10Q)')).toBeInTheDocument();
    expect(screen.getByText(/Time Attack \(60s\)/)).toBeInTheDocument();
  });

  it('handles standard mode selection', () => {
    GameContextModule.useGame.mockReturnValue({
      ...mockUseGame,
      gameState: 'mode_select',
      selectedSubject: GameContextModule.SUBJECTS[0],
      selectedDifficulty: GameContextModule.DIFFICULTIES[0],
    });

    render(<HubMenu />);

    const standardBtn = screen.getByText('Standard Mode (10Q)').closest('button');
    fireEvent.click(standardBtn);

    expect(mockStartQuiz).toHaveBeenCalledWith(false);
  });

  it('handles time attack mode selection', () => {
    GameContextModule.useGame.mockReturnValue({
      ...mockUseGame,
      gameState: 'mode_select',
      selectedSubject: GameContextModule.SUBJECTS[0],
      selectedDifficulty: GameContextModule.DIFFICULTIES[0],
    });

    render(<HubMenu />);

    const timeAttackBtn = screen.getByText(/Time Attack \(60s\)/).closest('button');
    fireEvent.click(timeAttackBtn);

    expect(mockStartQuiz).toHaveBeenCalledWith(true);
  });

  it('handles back navigation from mode_select', () => {
    GameContextModule.useGame.mockReturnValue({
      ...mockUseGame,
      gameState: 'mode_select',
    });

    render(<HubMenu />);

    const backBtn = screen.getByText('Back').closest('button');
    fireEvent.click(backBtn);

    expect(mockSetGameState).toHaveBeenCalledWith('difficulty_select');
  });
});

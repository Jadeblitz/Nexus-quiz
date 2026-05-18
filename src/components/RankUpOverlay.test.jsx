import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import RankUpOverlay from './RankUpOverlay';

describe('RankUpOverlay Component', () => {
  it('renders correctly with given rank info', () => {
    const mockRankInfo = {
      title: 'Grandmaster',
      level: 'Level 42'
    };

    render(<RankUpOverlay newRankInfo={mockRankInfo} />);

    // Check static texts
    expect(screen.getByText('Evolution Complete')).toBeInTheDocument();
    expect(screen.getByText('RANK UP!')).toBeInTheDocument();

    // Check dynamic texts
    expect(screen.getByText('Grandmaster')).toBeInTheDocument();
    expect(screen.getByText('Level 42')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import VaultModal from './VaultModal';

describe('VaultModal Component', () => {
  const mockSetShowVault = vi.fn();

  const mockConstants = [
    { name: 'Pi', value: '3.14159', formula: 'Ratio of circumference to diameter' },
    { name: 'Euler', value: '2.71828', formula: 'Base of the natural logarithm' }
  ];

  beforeEach(() => {
    mockSetShowVault.mockClear();
  });

  it('renders title and constants correctly', () => {
    render(<VaultModal VAULT_CONSTANTS={mockConstants} setShowVault={mockSetShowVault} />);

    // Check title
    expect(screen.getByText('Formula Vault')).toBeInTheDocument();

    // Check constants rendering
    expect(screen.getByText('Pi')).toBeInTheDocument();
    expect(screen.getByText('3.14159')).toBeInTheDocument();
    expect(screen.getByText('Ratio of circumference to diameter')).toBeInTheDocument();

    expect(screen.getByText('Euler')).toBeInTheDocument();
    expect(screen.getByText('2.71828')).toBeInTheDocument();
    expect(screen.getByText('Base of the natural logarithm')).toBeInTheDocument();
  });

  it('calls setShowVault with false when Close button is clicked', () => {
    render(<VaultModal VAULT_CONSTANTS={mockConstants} setShowVault={mockSetShowVault} />);

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(mockSetShowVault).toHaveBeenCalledWith(false);
    expect(mockSetShowVault).toHaveBeenCalledTimes(1);
  });
});

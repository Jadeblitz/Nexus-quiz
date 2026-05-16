import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Modal from './Modal';

describe('Modal Component', () => {
  const defaultProps = {
    title: 'Test Modal',
    onClose: vi.fn(),
  };

  it('renders the title correctly', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <Modal {...defaultProps}>
        <div data-testid="child-element">Child Content</div>
      </Modal>
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('renders the icon when provided', () => {
    const MockIcon = ({ className }) => <svg data-testid="mock-icon" className={className} />;
    render(<Modal {...defaultProps} icon={MockIcon} iconColor="text-red-500" />);

    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('mr-3');
    expect(icon).toHaveClass('text-red-500');
  });

  it('calls onClose when the close button is clicked', () => {
    const onCloseMock = vi.fn();
    render(<Modal {...defaultProps} onClose={onCloseMock} />);

    const closeButton = screen.getByRole('button', { name: /^Close$/i });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';

import { PinButton } from '../ui/Toolbar/components/PinButton';

describe('PinButton Component', () => {
  let mockOnClick: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnClick = vi.fn();
  });

  describe('Visual States', () => {
    test('renders with unpinned state attributes', () => {
      // GIVEN: Button is in unpinned state
      render(<PinButton isPinned={false} onClick={mockOnClick} data-testid="pin-btn" />);

      // WHEN: Button is rendered
      const button = screen.getByTestId('pin-btn');

      // THEN: It has correct aria-label and title for unpinned state
      expect(button).toHaveAttribute('aria-label', 'Pin flag');
      expect(button).toHaveAttribute('title', 'Pin flag');
    });

    test('renders with pinned state attributes', () => {
      // GIVEN: Button is in pinned state
      render(<PinButton isPinned={true} onClick={mockOnClick} data-testid="pin-btn" />);

      // WHEN: Button is rendered
      const button = screen.getByTestId('pin-btn');

      // THEN: It has correct aria-label and title for pinned state
      expect(button).toHaveAttribute('aria-label', 'Unpin flag');
      expect(button).toHaveAttribute('title', 'Unpin flag');
    });
  });

  describe('User Interactions', () => {
    test('calls onClick handler when clicked', () => {
      // GIVEN: Button is rendered
      render(<PinButton isPinned={false} onClick={mockOnClick} data-testid="pin-btn" />);

      // WHEN: Button is clicked
      fireEvent.click(screen.getByTestId('pin-btn'));

      // THEN: onClick handler is called once
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('handles multiple clicks', () => {
      // GIVEN: Button is rendered
      render(<PinButton isPinned={false} onClick={mockOnClick} data-testid="pin-btn" />);

      // WHEN: Button is clicked multiple times
      const button = screen.getByTestId('pin-btn');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // THEN: onClick handler is called for each click
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    test('is keyboard accessible and focusable', () => {
      // GIVEN: Button is rendered
      render(<PinButton isPinned={false} onClick={mockOnClick} data-testid="pin-btn" />);

      // WHEN: Button receives focus
      const button = screen.getByTestId('pin-btn');
      button.focus();

      // THEN: Button is a proper button element and can be focused
      expect(button.tagName).toBe('BUTTON');
      expect(document.activeElement).toBe(button);

      // AND: Can be activated via keyboard
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('updates aria attributes based on pinned state', () => {
      // GIVEN: Button in unpinned state
      const { rerender } = render(<PinButton isPinned={false} onClick={mockOnClick} data-testid="pin-btn" />);

      // WHEN: Button is rendered in unpinned state
      let button = screen.getByTestId('pin-btn');

      // THEN: Aria attributes reflect unpinned state
      expect(button).toHaveAttribute('aria-label', 'Pin flag');
      expect(button.tagName).toBe('BUTTON');

      // WHEN: Button state changes to pinned
      rerender(<PinButton isPinned={true} onClick={mockOnClick} data-testid="pin-btn" />);
      button = screen.getByTestId('pin-btn');

      // THEN: Aria attributes update to reflect pinned state
      expect(button).toHaveAttribute('aria-label', 'Unpin flag');
    });
  });

  describe('Custom Properties', () => {
    test('accepts custom data-testid prop', () => {
      // GIVEN: Button with custom data-testid
      render(<PinButton isPinned={false} onClick={mockOnClick} data-testid="custom-pin-button" />);

      // WHEN: Querying for button with custom testid
      const button = screen.getByTestId('custom-pin-button');

      // THEN: Button is found and rendered
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Pin flag');
    });
  });
});

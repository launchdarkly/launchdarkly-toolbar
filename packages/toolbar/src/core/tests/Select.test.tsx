import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Select, SelectOption } from '../ui/Toolbar/components/Select';
import '@testing-library/jest-dom/vitest';
import React from 'react';

describe('Select', () => {
  const mockOptions: SelectOption[] = [
    { id: 'option1', label: 'Option 1', value: 'value1' },
    { id: 'option2', label: 'Option 2', value: 'value2' },
    { id: 'option3', label: 'Option 3', value: 'value3' },
  ];

  const mockOnSelectionChange = vi.fn();

  beforeEach(() => {
    mockOnSelectionChange.mockClear();
  });

  describe('Rendering', () => {
    test('renders with placeholder when no selection', () => {
      render(
        <Select
          options={mockOptions}
          onSelectionChange={mockOnSelectionChange}
          placeholder="Choose an option"
          aria-label="Test select"
        />,
      );

      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    test('renders with selected value', () => {
      render(
        <Select
          options={mockOptions}
          selectedKey="option2"
          onSelectionChange={mockOnSelectionChange}
          aria-label="Test select"
        />,
      );

      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    test('renders with default placeholder when none provided', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    test('applies custom className', () => {
      const { container } = render(
        <Select
          options={mockOptions}
          onSelectionChange={mockOnSelectionChange}
          className="custom-class"
          aria-label="Test select"
        />,
      );

      const selectContainer = container.querySelector('.custom-class');
      expect(selectContainer).toBeInTheDocument();
    });

    test('applies data-theme attribute', () => {
      const { container } = render(
        <Select
          options={mockOptions}
          onSelectionChange={mockOnSelectionChange}
          data-theme="light"
          aria-label="Test select"
        />,
      );

      const selectContainer = container.querySelector('[data-theme="light"]');
      expect(selectContainer).toBeInTheDocument();
    });

    test('defaults to dark theme', () => {
      const { container } = render(
        <Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />,
      );

      const selectContainer = container.querySelector('[data-theme="dark"]');
      expect(selectContainer).toBeInTheDocument();
    });
  });

  describe('Dropdown Interaction', () => {
    test('opens dropdown on trigger click', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
    });

    test('closes dropdown on trigger click when already open', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.click(trigger);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('calls onSelectionChange when option is clicked', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const option2 = screen.getByRole('option', { name: 'Option 2' });
      fireEvent.click(option2);

      expect(mockOnSelectionChange).toHaveBeenCalledWith('option2');
      expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
    });

    test('closes dropdown after selection', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const option1 = screen.getByRole('option', { name: 'Option 1' });
      fireEvent.click(option1);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('returns focus to trigger after selection', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const option1 = screen.getByRole('option', { name: 'Option 1' });
      fireEvent.click(option1);

      expect(trigger).toHaveFocus();
    });

    test('updates focused index on mouse enter', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const option2 = screen.getByRole('option', { name: 'Option 2' });
      fireEvent.mouseEnter(option2);

      // Check that the option has the focused class
      expect(option2.className).toContain('focused');
    });
  });

  describe('Keyboard Navigation', () => {
    test('opens dropdown on Enter key', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'Enter' });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    test('opens dropdown on Space key', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: ' ' });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    test('opens dropdown and focuses first item on ArrowDown', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      const firstOption = screen.getByRole('option', { name: 'Option 1' });
      expect(firstOption.className).toContain('focused');
    });

    test('opens dropdown and focuses last item on ArrowUp', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowUp' });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      const lastOption = screen.getByRole('option', { name: 'Option 3' });
      expect(lastOption.className).toContain('focused');
    });

    test('navigates down through options with ArrowDown', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });

      const option1 = screen.getByRole('option', { name: 'Option 1' });
      expect(option1.className).toContain('focused');

      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      const option2 = screen.getByRole('option', { name: 'Option 2' });
      expect(option2.className).toContain('focused');

      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      const option3 = screen.getByRole('option', { name: 'Option 3' });
      expect(option3.className).toContain('focused');
    });

    test('wraps to first option when navigating down from last', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowUp' }); // Start at last

      fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // Wrap to first
      const option1 = screen.getByRole('option', { name: 'Option 1' });
      expect(option1.className).toContain('focused');
    });

    test('navigates up through options with ArrowUp', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowUp' }); // Start at last

      const option3 = screen.getByRole('option', { name: 'Option 3' });
      expect(option3.className).toContain('focused');

      fireEvent.keyDown(trigger, { key: 'ArrowUp' });
      const option2 = screen.getByRole('option', { name: 'Option 2' });
      expect(option2.className).toContain('focused');

      fireEvent.keyDown(trigger, { key: 'ArrowUp' });
      const option1 = screen.getByRole('option', { name: 'Option 1' });
      expect(option1.className).toContain('focused');
    });

    test('wraps to last option when navigating up from first', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // Start at first

      fireEvent.keyDown(trigger, { key: 'ArrowUp' }); // Wrap to last
      const option3 = screen.getByRole('option', { name: 'Option 3' });
      expect(option3.className).toContain('focused');
    });

    test('selects focused option on Enter', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // Open and focus first
      fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // Move to second

      fireEvent.keyDown(trigger, { key: 'Enter' }); // Select second

      expect(mockOnSelectionChange).toHaveBeenCalledWith('option2');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('selects focused option on Space', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // Open and focus first
      fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // Move to second

      fireEvent.keyDown(trigger, { key: ' ' }); // Select second

      expect(mockOnSelectionChange).toHaveBeenCalledWith('option2');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('closes dropdown on Escape key', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.keyDown(trigger, { key: 'Escape' });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('returns focus to trigger on Escape', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      fireEvent.keyDown(trigger, { key: 'Escape' });
      expect(trigger).toHaveFocus();
    });
  });

  describe('Disabled State', () => {
    test('does not open dropdown when disabled', () => {
      render(
        <Select
          options={mockOptions}
          onSelectionChange={mockOnSelectionChange}
          isDisabled={true}
          aria-label="Test select"
        />,
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('ignores keyboard events when disabled', () => {
      render(
        <Select
          options={mockOptions}
          onSelectionChange={mockOnSelectionChange}
          isDisabled={true}
          aria-label="Test select"
        />,
      );

      const trigger = screen.getByRole('button');
      fireEvent.keyDown(trigger, { key: 'Enter' });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('applies disabled attribute to button', () => {
      render(
        <Select
          options={mockOptions}
          onSelectionChange={mockOnSelectionChange}
          isDisabled={true}
          aria-label="Test select"
        />,
      );

      const trigger = screen.getByRole('button');
      expect(trigger).toBeDisabled();
    });
  });

  describe('Click Outside Handling', () => {
    test('closes dropdown when clicking outside', async () => {
      const { container } = render(
        <div>
          <Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />
          <button>Outside button</button>
        </div>,
      );

      const trigger = screen.getByRole('button', { name: /Test select/i });
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      const outsideButton = screen.getByRole('button', { name: 'Outside button' });
      fireEvent.mouseDown(outsideButton);

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    test('does not close dropdown when clicking inside', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      const listbox = screen.getByRole('listbox');
      fireEvent.mouseDown(listbox);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    test('uses composedPath for Shadow DOM compatibility', async () => {
      const { container } = render(
        <div>
          <Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />
          <button>Outside button</button>
        </div>,
      );

      const trigger = screen.getByRole('button', { name: /Test select/i });
      fireEvent.click(trigger);

      const outsideButton = screen.getByRole('button', { name: 'Outside button' });

      // Create a mock event with composedPath
      const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
      const composedPathSpy = vi.spyOn(mouseDownEvent, 'composedPath');
      composedPathSpy.mockReturnValue([outsideButton, document.body, document.documentElement]);

      fireEvent(outsideButton, mouseDownEvent);

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });

      expect(composedPathSpy).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA attributes on trigger', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-label');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('updates aria-expanded when dropdown opens', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('has proper ARIA attributes on options', () => {
      render(
        <Select
          options={mockOptions}
          selectedKey="option2"
          onSelectionChange={mockOnSelectionChange}
          aria-label="Test select"
        />,
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const option2 = screen.getByRole('option', { name: 'Option 2' });
      expect(option2).toHaveAttribute('aria-selected', 'true');

      const option1 = screen.getByRole('option', { name: 'Option 1' });
      expect(option1).toHaveAttribute('aria-selected', 'false');
    });

    test('listbox has aria-label', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-label', 'Test select');
    });
  });

  describe('Edge Cases', () => {
    test('handles empty options array', () => {
      render(<Select options={[]} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const listbox = screen.getByRole('listbox');
      expect(listbox.children).toHaveLength(0);
    });

    test('handles null selectedKey', () => {
      render(
        <Select
          options={mockOptions}
          selectedKey={null}
          onSelectionChange={mockOnSelectionChange}
          aria-label="Test select"
        />,
      );

      expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    test('handles undefined selectedKey', () => {
      render(
        <Select
          options={mockOptions}
          selectedKey={undefined}
          onSelectionChange={mockOnSelectionChange}
          aria-label="Test select"
        />,
      );

      expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    test('handles selectedKey that does not exist in options', () => {
      render(
        <Select
          options={mockOptions}
          selectedKey="nonexistent"
          onSelectionChange={mockOnSelectionChange}
          aria-label="Test select"
        />,
      );

      expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    test('does not call onSelectionChange if not provided', () => {
      render(<Select options={mockOptions} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const option1 = screen.getByRole('option', { name: 'Option 1' });
      expect(() => fireEvent.click(option1)).not.toThrow();
    });

    test('handles rapid toggle clicks', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');

      fireEvent.click(trigger);
      fireEvent.click(trigger);
      fireEvent.click(trigger);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('Visual State', () => {
    test('applies selected class to selected option', () => {
      render(
        <Select
          options={mockOptions}
          selectedKey="option2"
          onSelectionChange={mockOnSelectionChange}
          aria-label="Test select"
        />,
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const option2 = screen.getByRole('option', { name: 'Option 2' });
      expect(option2.className).toContain('selected');
    });

    test('dropdown opens and closes correctly', () => {
      render(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');

      // Initially closed
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      // Opens on click
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      // Closes on click
      fireEvent.click(trigger);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });
});

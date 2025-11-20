import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select, SelectOption } from '../ui/Toolbar/components/Select';
import ReactMountContext from '../context/ReactMountContext';
import React from 'react';
import '@testing-library/jest-dom';

// Test wrapper to provide ReactMountContext with proper portal target
function SelectWrapper({ children }: { children: React.ReactNode }) {
  const [portalTarget] = React.useState(() => document.createElement('div'));

  React.useEffect(() => {
    document.body.appendChild(portalTarget);
    return () => {
      document.body.removeChild(portalTarget);
    };
  }, [portalTarget]);

  return <ReactMountContext.Provider value={portalTarget}>{children}</ReactMountContext.Provider>;
}

// Helper function to render Select with proper context
function renderSelect(ui: React.ReactElement) {
  return render(<SelectWrapper>{ui}</SelectWrapper>);
}

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
      renderSelect(
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
      renderSelect(
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
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    test('applies custom className', () => {
      const { container } = renderSelect(
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
      const { container } = renderSelect(
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
      const { container } = renderSelect(
        <Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />,
      );

      const selectContainer = container.querySelector('[data-theme="dark"]');
      expect(selectContainer).toBeInTheDocument();
    });
  });

  describe('Dropdown Interaction', () => {
    test('opens dropdown on trigger click', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
    });

    test('closes dropdown on trigger click when already open', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.click(trigger);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('calls onSelectionChange when option is clicked', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const option2 = screen.getByRole('option', { name: 'Option 2' });
      fireEvent.click(option2);

      expect(mockOnSelectionChange).toHaveBeenCalledWith('option2');
      expect(mockOnSelectionChange).toHaveBeenCalledTimes(1);
    });

    test('closes dropdown after selection', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const option1 = screen.getByRole('option', { name: 'Option 1' });
      fireEvent.click(option1);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('returns focus to trigger after selection', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const option1 = screen.getByRole('option', { name: 'Option 1' });
      fireEvent.click(option1);

      expect(trigger).toHaveFocus();
    });

    test('updates focused index on mouse enter', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

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
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'Enter' });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    test('opens dropdown on Space key', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: ' ' });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    test('opens dropdown and focuses first item on ArrowDown', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      const firstOption = screen.getByRole('option', { name: 'Option 1' });
      expect(firstOption.className).toContain('focused');
    });

    test('opens dropdown and focuses last item on ArrowUp', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowUp' });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      const lastOption = screen.getByRole('option', { name: 'Option 3' });
      expect(lastOption.className).toContain('focused');
    });

    test('navigates down through options with ArrowDown', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

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
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowUp' }); // Start at last

      fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // Wrap to first
      const option1 = screen.getByRole('option', { name: 'Option 1' });
      expect(option1.className).toContain('focused');
    });

    test('navigates up through options with ArrowUp', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

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
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // Start at first

      fireEvent.keyDown(trigger, { key: 'ArrowUp' }); // Wrap to last
      const option3 = screen.getByRole('option', { name: 'Option 3' });
      expect(option3.className).toContain('focused');
    });

    test('selects focused option on Enter', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // Open and focus first
      fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // Move to second

      fireEvent.keyDown(trigger, { key: 'Enter' }); // Select second

      expect(mockOnSelectionChange).toHaveBeenCalledWith('option2');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('selects focused option on Space', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // Open and focus first
      fireEvent.keyDown(trigger, { key: 'ArrowDown' }); // Move to second

      fireEvent.keyDown(trigger, { key: ' ' }); // Select second

      expect(mockOnSelectionChange).toHaveBeenCalledWith('option2');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('closes dropdown on Escape key', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.keyDown(trigger, { key: 'Escape' });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('returns focus to trigger on Escape', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      fireEvent.keyDown(trigger, { key: 'Escape' });
      expect(trigger).toHaveFocus();
    });
  });

  describe('Disabled State', () => {
    test('does not open dropdown when disabled', () => {
      renderSelect(
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
      renderSelect(
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
      renderSelect(
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

  describe('Click Outside Handler', () => {
    test('closes dropdown when clicking outside', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // Click outside (on document body)
      fireEvent.mouseDown(document.body);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('does not close dropdown when clicking inside dropdown', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      const listbox = screen.getByRole('listbox');
      fireEvent.mouseDown(listbox);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    test('does not close dropdown when clicking on an option (before option click handler)', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      const option1 = screen.getByRole('option', { name: 'Option 1' });
      fireEvent.mouseDown(option1);

      // Dropdown should still be open at this point (closes on click, not mouseDown)
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    test('does not close dropdown when clicking on trigger (via click outside handler)', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // MouseDown on trigger should not close it via click outside handler
      // (the trigger is part of the select container and excluded from outside clicks)
      fireEvent.mouseDown(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    test('click outside handler is only active when dropdown is open', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      // Dropdown is closed, clicking outside should not cause issues
      fireEvent.mouseDown(document.body);

      // No errors thrown, and dropdown remains closed
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    test('removes click outside listener when dropdown closes', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');

      // Open dropdown
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      // Close dropdown by clicking trigger
      fireEvent.click(trigger);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

      // Click outside - should not cause any issues since listener is removed
      expect(() => fireEvent.mouseDown(document.body)).not.toThrow();
    });
  });

  describe('Scroll Prevention', () => {
    test('prevents wheel events on document when dropdown is open', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const wheelEvent = new WheelEvent('wheel', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault');

      document.dispatchEvent(wheelEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test('prevents touchmove events on document when dropdown is open', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const touchEvent = new TouchEvent('touchmove', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(touchEvent, 'preventDefault');

      document.dispatchEvent(touchEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test('does not prevent scroll events when dropdown is closed', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const wheelEvent = new WheelEvent('wheel', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault');

      document.dispatchEvent(wheelEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    test('removes scroll prevention listeners when dropdown closes', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');

      // Open dropdown
      fireEvent.click(trigger);

      // Close dropdown
      fireEvent.click(trigger);

      const wheelEvent = new WheelEvent('wheel', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault');

      document.dispatchEvent(wheelEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    test('allows scrolling within the dropdown list', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const listbox = screen.getByRole('listbox');

      // Create a wheel event that originates from within the listbox
      const wheelEvent = new WheelEvent('wheel', { bubbles: true, cancelable: true });
      Object.defineProperty(wheelEvent, 'composedPath', {
        value: () => [listbox, document.body],
      });

      const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault');

      listbox.dispatchEvent(wheelEvent);

      // Should NOT prevent default for events within the list
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    test('removes scroll listeners when component unmounts', () => {
      const { unmount } = renderSelect(
        <Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />,
      );

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      // Unmount component
      unmount();

      // Scroll event should not be prevented after unmount
      const wheelEvent = new WheelEvent('wheel', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault');

      document.dispatchEvent(wheelEvent);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA attributes on trigger', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-label');
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('updates aria-expanded when dropdown opens', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('has proper ARIA attributes on options', () => {
      renderSelect(
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
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const listbox = screen.getByRole('listbox');
      expect(listbox).toHaveAttribute('aria-label', 'Test select');
    });
  });

  describe('Edge Cases', () => {
    test('handles empty options array', () => {
      renderSelect(<Select options={[]} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const listbox = screen.getByRole('listbox');
      expect(listbox.children).toHaveLength(0);
    });

    test('handles null selectedKey', () => {
      renderSelect(
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
      renderSelect(
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
      renderSelect(
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
      renderSelect(<Select options={mockOptions} aria-label="Test select" />);

      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      const option1 = screen.getByRole('option', { name: 'Option 1' });
      expect(() => fireEvent.click(option1)).not.toThrow();
    });

    test('handles rapid toggle clicks', () => {
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

      const trigger = screen.getByRole('button');

      fireEvent.click(trigger);
      fireEvent.click(trigger);
      fireEvent.click(trigger);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('Visual State', () => {
    test('applies selected class to selected option', () => {
      renderSelect(
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
      renderSelect(<Select options={mockOptions} onSelectionChange={mockOnSelectionChange} aria-label="Test select" />);

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

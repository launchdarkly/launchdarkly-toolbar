import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Tooltip } from '../../ui/Toolbar/components/new/Tooltip';
import React from 'react';
import '@testing-library/jest-dom/vitest';

// Mock motion/react to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({
      children,
      className,
      style,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & { style?: React.CSSProperties }) => (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock CSS module using star export pattern
vi.mock('../../ui/Toolbar/components/new/Tooltip.module.css', () => ({
  container: 'container',
  tooltip: 'tooltip',
}));

describe('Tooltip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>,
    );

    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('should not show tooltip initially', () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>,
    );

    expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
  });

  it('should show tooltip on mouse enter', async () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Hover me' });
    fireEvent.mouseEnter(button.parentElement!);

    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });
  });

  it('should hide tooltip on mouse leave', async () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Hover me</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Hover me' });
    const container = button.parentElement!;

    // Show tooltip
    fireEvent.mouseEnter(container);
    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });

    // Hide tooltip
    fireEvent.mouseLeave(container);
    await waitFor(() => {
      expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
    });
  });

  it('should hide tooltip on click', async () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Click me</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    const container = button.parentElement!;

    // Show tooltip first
    fireEvent.mouseEnter(container);
    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });

    // Click should hide tooltip
    fireEvent.click(container);
    await waitFor(() => {
      expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
    });
  });

  it('should pass through click events to children', async () => {
    const handleClick = vi.fn();

    render(
      <Tooltip content="Test tooltip">
        <button onClick={handleClick}>Click me</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should render with custom content', async () => {
    render(
      <Tooltip content="Custom tooltip content">
        <span>Target</span>
      </Tooltip>,
    );

    const container = screen.getByText('Target').parentElement!;
    fireEvent.mouseEnter(container);

    await waitFor(() => {
      expect(screen.getByText('Custom tooltip content')).toBeInTheDocument();
    });
  });

  it('should apply offset props for positioning', async () => {
    render(
      <Tooltip content="Test tooltip" offsetTop={10} offsetLeft={20}>
        <button>Hover me</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Hover me' });
    fireEvent.mouseEnter(button.parentElement!);

    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });
  });

  it('should work with multiple tooltips', async () => {
    render(
      <div>
        <Tooltip content="Tooltip 1">
          <button>Button 1</button>
        </Tooltip>
        <Tooltip content="Tooltip 2">
          <button>Button 2</button>
        </Tooltip>
      </div>,
    );

    const button1 = screen.getByRole('button', { name: 'Button 1' });
    const button2 = screen.getByRole('button', { name: 'Button 2' });

    // Hover first button
    fireEvent.mouseEnter(button1.parentElement!);
    await waitFor(() => {
      expect(screen.getByText('Tooltip 1')).toBeInTheDocument();
    });
    expect(screen.queryByText('Tooltip 2')).not.toBeInTheDocument();

    // Leave first, hover second
    fireEvent.mouseLeave(button1.parentElement!);
    fireEvent.mouseEnter(button2.parentElement!);

    await waitFor(() => {
      expect(screen.getByText('Tooltip 2')).toBeInTheDocument();
    });
    expect(screen.queryByText('Tooltip 1')).not.toBeInTheDocument();
  });

  it('should hide tooltip when clicking button that opens overlay', async () => {
    // This simulates the filter button scenario where clicking opens an overlay
    render(
      <Tooltip content="Filter Events">
        <button>Filter</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Filter' });
    const container = button.parentElement!;

    // Show tooltip
    fireEvent.mouseEnter(container);
    await waitFor(() => {
      expect(screen.getByText('Filter Events')).toBeInTheDocument();
    });

    // Click to "open overlay" - tooltip should hide
    // This is the key behavior we're testing: clicking hides the tooltip
    fireEvent.click(container);
    await waitFor(() => {
      expect(screen.queryByText('Filter Events')).not.toBeInTheDocument();
    });
  });
});

describe('Tooltip accessibility', () => {
  it('should not interfere with keyboard navigation', () => {
    render(
      <Tooltip content="Test tooltip">
        <button>Focusable button</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Focusable button' });
    button.focus();

    expect(document.activeElement).toBe(button);
  });

  it('should allow keyboard interaction with children', () => {
    const handleKeyDown = vi.fn();

    render(
      <Tooltip content="Test tooltip">
        <button onKeyDown={handleKeyDown}>Press Enter</button>
      </Tooltip>,
    );

    const button = screen.getByRole('button', { name: 'Press Enter' });
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(handleKeyDown).toHaveBeenCalled();
  });
});

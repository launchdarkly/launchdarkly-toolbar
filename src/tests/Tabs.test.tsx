import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';

import { Tabs } from '../ui/Tabs/Tabs';
import { TabButton } from '../ui/Tabs/TabButton';

describe('Tabs', () => {
  test('renders children correctly', () => {
    render(
      <Tabs>
        <TabButton id="tab1" label="Tab 1" />
        <TabButton id="tab2" label="Tab 2" />
        <TabButton id="tab3" label="Tab 3" />
      </Tabs>,
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  test('calls onTabChange when tab is clicked', () => {
    const onTabChange = vi.fn();
    render(
      <Tabs onTabChange={onTabChange}>
        <TabButton id="tab1" label="Tab 1" />
        <TabButton id="tab2" label="Tab 2" />
        <TabButton id="tab3" label="Tab 3" />
      </Tabs>,
    );

    fireEvent.click(screen.getByText('Tab 2'));
    expect(onTabChange).toHaveBeenCalledWith('tab2');
  });

  test('handles disabled tabs', () => {
    render(
      <Tabs>
        <TabButton id="tab1" label="Tab 1" />
        <TabButton id="tab2" label="Tab 2" disabled />
        <TabButton id="tab3" label="Tab 3" />
      </Tabs>,
    );

    const disabledTab = screen.getByText('Tab 2');
    expect(disabledTab).toBeDisabled();
  });

  test('throws error when TabButton is used outside Tabs', () => {
    const consoleError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TabButton id="tab1" label="Tab 1" />);
    }).toThrow('useTabsContext must be used within a Tabs component');

    console.error = consoleError;
  });
});

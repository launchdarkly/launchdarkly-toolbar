import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';

import { Tabs } from '../ui/Tabs/Tabs';
import { TabButton } from '../ui/Tabs/TabButton';

describe('Tabs', () => {
  test('renders children correctly', () => {
    render(
      <Tabs>
        <TabButton id="flag-sdk" label="SDK Flags" />
        <TabButton id="flag-dev-server" label="Dev Server Flags" />
        <TabButton id="settings" label="Settings" />
      </Tabs>,
    );

    expect(screen.getByText('SDK Flags')).toBeInTheDocument();
    expect(screen.getByText('Dev Server Flags')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('calls onTabChange when tab is clicked', () => {
    const onTabChange = vi.fn();
    render(
      <Tabs onTabChange={onTabChange}>
        <TabButton id="flag-sdk" label="SDK Flags" />
        <TabButton id="flag-dev-server" label="Dev Server Flags" />
        <TabButton id="settings" label="Settings" />
      </Tabs>,
    );

    fireEvent.click(screen.getByText('Dev Server Flags'));
    expect(onTabChange).toHaveBeenCalledWith('flag-dev-server');
  });

  test('handles disabled tabs', () => {
    render(
      <Tabs>
        <TabButton id="flag-sdk" label="SDK Flags" />
        <TabButton id="flag-dev-server" label="Dev Server Flags" disabled />
        <TabButton id="settings" label="Settings" />
      </Tabs>,
    );

    const disabledTab = screen.getByText('Dev Server Flags');
    expect(disabledTab).toBeDisabled();
  });

  test('throws error when TabButton is used outside Tabs', () => {
    const consoleError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TabButton id="settings" label="Settings" />);
    }).toThrow('useTabsContext must be used within a Tabs component');

    console.error = consoleError;
  });
});

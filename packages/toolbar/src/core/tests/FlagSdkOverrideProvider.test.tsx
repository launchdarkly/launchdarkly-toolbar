import { render, screen, act } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { FlagSdkOverrideProvider, useFlagSdkOverrideContext } from '../ui/Toolbar/context/FlagSdkOverrideProvider';
import { IFlagOverridePlugin } from '../../types';
import '@testing-library/jest-dom/vitest';
import React from 'react';

const API_FLAGS = [
  {
    key: 'feature-flag-1',
    name: 'Feature Flag 1',
  },
  {
    key: 'test-string-flag',
    name: 'Test String Flag',
  },
  {
    key: 'number-flag',
    name: 'Number Flag',
  },
  {
    key: 'object-flag',
    name: 'Object Flag',
  },
  {
    key: 'boolean-flag',
    name: 'Boolean Flag',
  },
  {
    key: 'string-flag',
    name: 'String Flag',
  },
  {
    key: 'dynamic-flag',
    name: 'Dynamic Flag',
  },
  {
    key: 'normal-flag',
    name: 'Normal Flag',
  },
];

// Mock the FlagsProvider
vi.mock('../ui/Toolbar/context/api/FlagsProvider', () => ({
  FlagsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useFlagsContext: () => ({
    flags: API_FLAGS,
    loading: false,
    getProjectFlags: vi.fn().mockResolvedValue([]),
  }),
}));

// Test component that uses the context
function TestConsumer() {
  const { flags, isLoading } = useFlagSdkOverrideContext();

  if (isLoading) {
    return <div data-testid="loading">Loading...</div>;
  }

  return (
    <div data-testid="flags-data">
      {Object.entries(flags).map(([key, flag]) => (
        <div key={key} data-testid={`flag-${key}`}>
          {flag.name}: {String(flag.currentValue)} ({flag.isOverridden ? 'overridden' : 'original'})
        </div>
      ))}
    </div>
  );
}

describe('FlagSdkOverrideProvider', () => {
  let mockLdClient: any;
  let mockFlagOverridePlugin: IFlagOverridePlugin;

  beforeEach(() => {
    // Mock LaunchDarkly client
    mockLdClient = {
      allFlags: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };

    // Mock flag override plugin
    mockFlagOverridePlugin = {
      getClient: vi.fn().mockReturnValue(mockLdClient),
      getAllOverrides: vi.fn().mockReturnValue({}),
      setOverride: vi.fn(),
      removeOverride: vi.fn(),
      clearAllOverrides: vi.fn(),
      getMetadata: vi.fn(),
      register: vi.fn(),
    };
  });

  test('provides initial flag data from LaunchDarkly client', () => {
    // GIVEN: LaunchDarkly client has some flags
    mockLdClient.allFlags.mockReturnValue({
      'feature-flag-1': true,
      'test-string-flag': 'hello',
      'number-flag': 42,
    });

    // WHEN: Component is rendered with the provider
    render(
      <FlagSdkOverrideProvider flagOverridePlugin={mockFlagOverridePlugin}>
        <TestConsumer />
      </FlagSdkOverrideProvider>,
    );

    // THEN: Flags are displayed (loading completes synchronously in this implementation)
    expect(screen.getByTestId('flags-data')).toBeInTheDocument();
    expect(screen.getByTestId('flag-feature-flag-1')).toHaveTextContent('Feature Flag 1: true (original)');
    expect(screen.getByTestId('flag-test-string-flag')).toHaveTextContent('Test String Flag: hello (original)');
    expect(screen.getByTestId('flag-number-flag')).toHaveTextContent('Number Flag: 42 (original)');
  });

  test('marks overridden flags correctly', async () => {
    // GIVEN: LaunchDarkly client has flags and some are overridden
    mockLdClient.allFlags.mockReturnValue({
      'feature-flag-1': false, // This one is overridden
      'normal-flag': true, // This one is not
    });

    (mockFlagOverridePlugin.getAllOverrides as any).mockReturnValue({
      'feature-flag-1': false, // Override exists
    });

    // WHEN: Component is rendered
    render(
      <FlagSdkOverrideProvider flagOverridePlugin={mockFlagOverridePlugin}>
        <TestConsumer />
      </FlagSdkOverrideProvider>,
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // THEN: Overridden flag is marked correctly
    expect(screen.getByTestId('flag-feature-flag-1')).toHaveTextContent('Feature Flag 1: false (overridden)');
    expect(screen.getByTestId('flag-normal-flag')).toHaveTextContent('Normal Flag: true (original)');
  });

  test('handles LaunchDarkly client change events', async () => {
    // GIVEN: Provider is set up with initial flags
    mockLdClient.allFlags.mockReturnValue({
      'dynamic-flag': 'initial',
    });

    let changeHandler: (changes: Record<string, { current: any }>) => void;
    mockLdClient.on.mockImplementation((event: string, handler: any) => {
      if (event === 'change') {
        changeHandler = handler;
      }
    });

    render(
      <FlagSdkOverrideProvider flagOverridePlugin={mockFlagOverridePlugin}>
        <TestConsumer />
      </FlagSdkOverrideProvider>,
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Initial state
    expect(screen.getByTestId('flag-dynamic-flag')).toHaveTextContent('Dynamic Flag: initial (original)');

    // WHEN: LaunchDarkly client emits a change event
    mockLdClient.allFlags.mockReturnValue({
      'dynamic-flag': 'updated',
    });

    await act(async () => {
      changeHandler!({ 'dynamic-flag': { current: 'updated' } });
    });

    // THEN: The flag value is updated
    expect(screen.getByTestId('flag-dynamic-flag')).toHaveTextContent('Dynamic Flag: updated (original)');
  });

  test('handles null LaunchDarkly client gracefully', async () => {
    // GIVEN: Plugin returns null client (edge case)
    (mockFlagOverridePlugin.getClient as any).mockReturnValue(null);

    // WHEN: Component is rendered
    render(
      <FlagSdkOverrideProvider flagOverridePlugin={mockFlagOverridePlugin}>
        <TestConsumer />
      </FlagSdkOverrideProvider>,
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // THEN: No flags are shown, but component doesn't crash
    expect(screen.getByTestId('flags-data')).toBeInTheDocument();
    expect(screen.getByTestId('flags-data')).toBeEmptyDOMElement();
  });

  test('throws error when useFlagSdkOverrideContext is used outside provider', () => {
    // GIVEN: Component tries to use context outside provider
    const TestComponentOutsideProvider = () => {
      useFlagSdkOverrideContext(); // This should throw
      return <div>Should not render</div>;
    };

    // WHEN/THEN: Error is thrown
    // Need to suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponentOutsideProvider />);
    }).toThrow('useFlagSdkOverrideContext must be used within a FlagSdkOverrideProvider');

    consoleSpy.mockRestore();
  });

  test('infers correct flag types', async () => {
    // GIVEN: Flags with different types
    mockLdClient.allFlags.mockReturnValue({
      'boolean-flag': true,
      'string-flag': 'hello',
      'number-flag': 42,
      'object-flag': { key: 'value' },
    });

    render(
      <FlagSdkOverrideProvider flagOverridePlugin={mockFlagOverridePlugin}>
        <TestConsumer />
      </FlagSdkOverrideProvider>,
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // THEN: All flag types are handled
    expect(screen.getByTestId('flag-boolean-flag')).toBeInTheDocument();
    expect(screen.getByTestId('flag-string-flag')).toBeInTheDocument();
    expect(screen.getByTestId('flag-number-flag')).toBeInTheDocument();
    expect(screen.getByTestId('flag-object-flag')).toBeInTheDocument();
  });

  test('displays flags from LD client even when API flags are empty', async () => {
    // Mock FlagsProvider to return empty flags (simulating API not loaded yet)
    const emptyFlagsModule = await import('../ui/Toolbar/context/api/FlagsProvider');
    vi.spyOn(emptyFlagsModule, 'useFlagsContext').mockReturnValue({
      flags: [], // Empty API flags
      loading: false,
      getProjectFlags: vi.fn().mockResolvedValue([]),
      resetFlags: vi.fn(),
    });

    // GIVEN: LD client has flags but API hasn't loaded
    mockLdClient.allFlags.mockReturnValue({
      'client-only-flag': true,
      'another-flag': 'test-value',
    });

    // WHEN: Component is rendered
    render(
      <FlagSdkOverrideProvider flagOverridePlugin={mockFlagOverridePlugin}>
        <TestConsumer />
      </FlagSdkOverrideProvider>,
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // THEN: Flags from LD client are displayed with formatted names
    expect(screen.getByTestId('flag-client-only-flag')).toBeInTheDocument();
    expect(screen.getByTestId('flag-client-only-flag')).toHaveTextContent('Client Only Flag: true (original)');
    expect(screen.getByTestId('flag-another-flag')).toBeInTheDocument();
    expect(screen.getByTestId('flag-another-flag')).toHaveTextContent('Another Flag: test-value (original)');
  });
});

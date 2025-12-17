import { render, screen, act } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock localStorage utilities
const mockLoadIsOptedInToAnalytics = vi.fn(() => false);
const mockSaveIsOptedInToAnalytics = vi.fn();
const mockLoadIsOptedInToEnhancedAnalytics = vi.fn(() => false);
const mockSaveIsOptedInToEnhancedAnalytics = vi.fn();
const mockLoadIsOptedInToSessionReplay = vi.fn(() => false);
const mockSaveIsOptedInToSessionReplay = vi.fn();

vi.mock('../ui/Toolbar/utils/localStorage', () => ({
  loadIsOptedInToAnalytics: () => mockLoadIsOptedInToAnalytics(),
  saveIsOptedInToAnalytics: (value: boolean) => mockSaveIsOptedInToAnalytics(value),
  loadIsOptedInToEnhancedAnalytics: () => mockLoadIsOptedInToEnhancedAnalytics(),
  saveIsOptedInToEnhancedAnalytics: (value: boolean) => mockSaveIsOptedInToEnhancedAnalytics(value),
  loadIsOptedInToSessionReplay: () => mockLoadIsOptedInToSessionReplay(),
  saveIsOptedInToSessionReplay: (value: boolean) => mockSaveIsOptedInToSessionReplay(value),
}));

import {
  AnalyticsPreferencesProvider,
  useAnalyticsPreferences,
} from '../ui/Toolbar/context/telemetry/AnalyticsPreferencesProvider';

// Test consumer component
function TestConsumer() {
  const {
    isOptedInToAnalytics,
    isOptedInToEnhancedAnalytics,
    isOptedInToSessionReplay,
    handleToggleAnalyticsOptOut,
    handleToggleEnhancedAnalyticsOptOut,
    handleToggleSessionReplayOptOut,
  } = useAnalyticsPreferences();

  return (
    <div>
      <div data-testid="analytics-opted-in">{isOptedInToAnalytics.toString()}</div>
      <div data-testid="enhanced-analytics-opted-in">{isOptedInToEnhancedAnalytics.toString()}</div>
      <div data-testid="session-replay-opted-in">{isOptedInToSessionReplay.toString()}</div>
      <button data-testid="toggle-analytics" onClick={() => handleToggleAnalyticsOptOut(!isOptedInToAnalytics)}>
        Toggle Analytics
      </button>
      <button
        data-testid="toggle-enhanced-analytics"
        onClick={() => handleToggleEnhancedAnalyticsOptOut(!isOptedInToEnhancedAnalytics)}
      >
        Toggle Enhanced Analytics
      </button>
      <button
        data-testid="toggle-session-replay"
        onClick={() => handleToggleSessionReplayOptOut(!isOptedInToSessionReplay)}
      >
        Toggle Session Replay
      </button>
      <button data-testid="disable-analytics" onClick={() => handleToggleAnalyticsOptOut(false)}>
        Disable Analytics
      </button>
    </div>
  );
}

describe('AnalyticsPreferencesProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadIsOptedInToAnalytics.mockReturnValue(false);
    mockLoadIsOptedInToEnhancedAnalytics.mockReturnValue(false);
    mockLoadIsOptedInToSessionReplay.mockReturnValue(false);
  });

  describe('Initialization', () => {
    test('loads initial preferences from localStorage', () => {
      mockLoadIsOptedInToAnalytics.mockReturnValue(true);
      mockLoadIsOptedInToEnhancedAnalytics.mockReturnValue(true);
      mockLoadIsOptedInToSessionReplay.mockReturnValue(true);

      render(
        <AnalyticsPreferencesProvider>
          <TestConsumer />
        </AnalyticsPreferencesProvider>,
      );

      expect(screen.getByTestId('analytics-opted-in')).toHaveTextContent('true');
      expect(screen.getByTestId('enhanced-analytics-opted-in')).toHaveTextContent('true');
      expect(screen.getByTestId('session-replay-opted-in')).toHaveTextContent('true');
    });

    test('defaults to false when localStorage returns false', () => {
      mockLoadIsOptedInToAnalytics.mockReturnValue(false);
      mockLoadIsOptedInToEnhancedAnalytics.mockReturnValue(false);
      mockLoadIsOptedInToSessionReplay.mockReturnValue(false);

      render(
        <AnalyticsPreferencesProvider>
          <TestConsumer />
        </AnalyticsPreferencesProvider>,
      );

      expect(screen.getByTestId('analytics-opted-in')).toHaveTextContent('false');
      expect(screen.getByTestId('enhanced-analytics-opted-in')).toHaveTextContent('false');
      expect(screen.getByTestId('session-replay-opted-in')).toHaveTextContent('false');
    });
  });

  describe('Toggle Analytics', () => {
    test('enables analytics and saves to localStorage', () => {
      render(
        <AnalyticsPreferencesProvider>
          <TestConsumer />
        </AnalyticsPreferencesProvider>,
      );

      expect(screen.getByTestId('analytics-opted-in')).toHaveTextContent('false');

      act(() => {
        screen.getByTestId('toggle-analytics').click();
      });

      expect(screen.getByTestId('analytics-opted-in')).toHaveTextContent('true');
      expect(mockSaveIsOptedInToAnalytics).toHaveBeenCalledWith(true);
    });

    test('disables analytics and saves to localStorage', () => {
      mockLoadIsOptedInToAnalytics.mockReturnValue(true);

      render(
        <AnalyticsPreferencesProvider>
          <TestConsumer />
        </AnalyticsPreferencesProvider>,
      );

      expect(screen.getByTestId('analytics-opted-in')).toHaveTextContent('true');

      act(() => {
        screen.getByTestId('toggle-analytics').click();
      });

      expect(screen.getByTestId('analytics-opted-in')).toHaveTextContent('false');
      expect(mockSaveIsOptedInToAnalytics).toHaveBeenCalledWith(false);
    });
  });

  describe('Toggle Enhanced Analytics', () => {
    test('enables enhanced analytics and saves to localStorage', () => {
      render(
        <AnalyticsPreferencesProvider>
          <TestConsumer />
        </AnalyticsPreferencesProvider>,
      );

      expect(screen.getByTestId('enhanced-analytics-opted-in')).toHaveTextContent('false');

      act(() => {
        screen.getByTestId('toggle-enhanced-analytics').click();
      });

      expect(screen.getByTestId('enhanced-analytics-opted-in')).toHaveTextContent('true');
      expect(mockSaveIsOptedInToEnhancedAnalytics).toHaveBeenCalledWith(true);
    });

    test('disables enhanced analytics and saves to localStorage', () => {
      mockLoadIsOptedInToEnhancedAnalytics.mockReturnValue(true);

      render(
        <AnalyticsPreferencesProvider>
          <TestConsumer />
        </AnalyticsPreferencesProvider>,
      );

      expect(screen.getByTestId('enhanced-analytics-opted-in')).toHaveTextContent('true');

      act(() => {
        screen.getByTestId('toggle-enhanced-analytics').click();
      });

      expect(screen.getByTestId('enhanced-analytics-opted-in')).toHaveTextContent('false');
      expect(mockSaveIsOptedInToEnhancedAnalytics).toHaveBeenCalledWith(false);
    });
  });

  describe('Toggle Session Replay', () => {
    test('enables session replay and saves to localStorage', () => {
      render(
        <AnalyticsPreferencesProvider>
          <TestConsumer />
        </AnalyticsPreferencesProvider>,
      );

      expect(screen.getByTestId('session-replay-opted-in')).toHaveTextContent('false');

      act(() => {
        screen.getByTestId('toggle-session-replay').click();
      });

      expect(screen.getByTestId('session-replay-opted-in')).toHaveTextContent('true');
      expect(mockSaveIsOptedInToSessionReplay).toHaveBeenCalledWith(true);
    });

    test('disables session replay and saves to localStorage', () => {
      mockLoadIsOptedInToSessionReplay.mockReturnValue(true);

      render(
        <AnalyticsPreferencesProvider>
          <TestConsumer />
        </AnalyticsPreferencesProvider>,
      );

      expect(screen.getByTestId('session-replay-opted-in')).toHaveTextContent('true');

      act(() => {
        screen.getByTestId('toggle-session-replay').click();
      });

      expect(screen.getByTestId('session-replay-opted-in')).toHaveTextContent('false');
      expect(mockSaveIsOptedInToSessionReplay).toHaveBeenCalledWith(false);
    });
  });

  describe('Cascading Disable', () => {
    test('disabling analytics also disables enhanced analytics and session replay', () => {
      mockLoadIsOptedInToAnalytics.mockReturnValue(true);
      mockLoadIsOptedInToEnhancedAnalytics.mockReturnValue(true);
      mockLoadIsOptedInToSessionReplay.mockReturnValue(true);

      render(
        <AnalyticsPreferencesProvider>
          <TestConsumer />
        </AnalyticsPreferencesProvider>,
      );

      // Verify initial state
      expect(screen.getByTestId('analytics-opted-in')).toHaveTextContent('true');
      expect(screen.getByTestId('enhanced-analytics-opted-in')).toHaveTextContent('true');
      expect(screen.getByTestId('session-replay-opted-in')).toHaveTextContent('true');

      // Disable analytics
      act(() => {
        screen.getByTestId('disable-analytics').click();
      });

      // All should be disabled
      expect(screen.getByTestId('analytics-opted-in')).toHaveTextContent('false');
      expect(screen.getByTestId('enhanced-analytics-opted-in')).toHaveTextContent('false');
      expect(screen.getByTestId('session-replay-opted-in')).toHaveTextContent('false');

      // All save functions should have been called with false
      expect(mockSaveIsOptedInToAnalytics).toHaveBeenCalledWith(false);
      expect(mockSaveIsOptedInToEnhancedAnalytics).toHaveBeenCalledWith(false);
      expect(mockSaveIsOptedInToSessionReplay).toHaveBeenCalledWith(false);
    });

    test('enabling analytics does not automatically enable enhanced analytics or session replay', () => {
      mockLoadIsOptedInToAnalytics.mockReturnValue(false);
      mockLoadIsOptedInToEnhancedAnalytics.mockReturnValue(false);
      mockLoadIsOptedInToSessionReplay.mockReturnValue(false);

      render(
        <AnalyticsPreferencesProvider>
          <TestConsumer />
        </AnalyticsPreferencesProvider>,
      );

      // Verify initial state
      expect(screen.getByTestId('analytics-opted-in')).toHaveTextContent('false');
      expect(screen.getByTestId('enhanced-analytics-opted-in')).toHaveTextContent('false');
      expect(screen.getByTestId('session-replay-opted-in')).toHaveTextContent('false');

      // Enable analytics
      act(() => {
        screen.getByTestId('toggle-analytics').click();
      });

      // Only analytics should be enabled
      expect(screen.getByTestId('analytics-opted-in')).toHaveTextContent('true');
      expect(screen.getByTestId('enhanced-analytics-opted-in')).toHaveTextContent('false');
      expect(screen.getByTestId('session-replay-opted-in')).toHaveTextContent('false');

      // Only analytics save function should have been called
      expect(mockSaveIsOptedInToAnalytics).toHaveBeenCalledWith(true);
      expect(mockSaveIsOptedInToEnhancedAnalytics).not.toHaveBeenCalled();
      expect(mockSaveIsOptedInToSessionReplay).not.toHaveBeenCalled();
    });
  });

  describe('useAnalyticsPreferences Hook', () => {
    test('throws error when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestConsumer />);
      }).toThrow('useAnalyticsPreferences must be used within an AnalyticsPreferencesProvider');

      consoleError.mockRestore();
    });
  });
});

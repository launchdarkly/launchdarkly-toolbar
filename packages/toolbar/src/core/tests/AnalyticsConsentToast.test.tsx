import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Control localStorage mock values
const {
  getMockAnalyticsConsentShown,
  setMockAnalyticsConsentShown,
  mockSaveAnalyticsConsentShown,
} = vi.hoisted(() => {
  let consentShown = false;
  const saveFn = vi.fn();
  return {
    getMockAnalyticsConsentShown: () => consentShown,
    setMockAnalyticsConsentShown: (v: boolean) => {
      consentShown = v;
    },
    mockSaveAnalyticsConsentShown: saveFn,
  };
});

// Mock localStorage functions - keep other exports intact
vi.mock('../ui/Toolbar/utils/localStorage', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../ui/Toolbar/utils/localStorage')>();
  return {
    ...actual,
    loadAnalyticsConsentShown: () => getMockAnalyticsConsentShown(),
    saveAnalyticsConsentShown: mockSaveAnalyticsConsentShown,
  };
});

// Mock analytics preferences with trackable function
const mockHandleToggleAnalyticsOptOut = vi.fn();

vi.mock('../ui/Toolbar/context/telemetry/AnalyticsPreferencesProvider', () => ({
  useAnalyticsPreferences: () => ({
    isOptedInToAnalytics: false,
    isOptedInToEnhancedAnalytics: false,
    isOptedInToSessionReplay: false,
    handleToggleAnalyticsOptOut: mockHandleToggleAnalyticsOptOut,
    handleToggleEnhancedAnalyticsOptOut: vi.fn(),
    handleToggleSessionReplayOptOut: vi.fn(),
  }),
  AnalyticsPreferencesProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import { AnalyticsConsentToast } from '../ui/Toolbar/components/new/AnalyticsConsentToast';

describe('AnalyticsConsentToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setMockAnalyticsConsentShown(false);
  });

  describe('Visibility', () => {
    test('displays toast when user has not seen it before', () => {
      setMockAnalyticsConsentShown(false);

      render(<AnalyticsConsentToast />);

      expect(screen.getByText('Help us improve')).toBeInTheDocument();
      expect(screen.getByText('Help us improve the toolbar by sharing usage data.')).toBeInTheDocument();
    });

    test('does NOT display toast when user has already seen it', () => {
      setMockAnalyticsConsentShown(true);

      render(<AnalyticsConsentToast />);

      expect(screen.queryByText('Help us improve')).not.toBeInTheDocument();
    });
  });

  describe('Content', () => {
    test('displays Privacy Policy link with correct URL', () => {
      render(<AnalyticsConsentToast />);

      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      expect(privacyLink).toHaveAttribute('href', 'https://launchdarkly.com/policies/privacy');
      expect(privacyLink).toHaveAttribute('target', '_blank');
      expect(privacyLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('displays Accept and Dismiss buttons', () => {
      render(<AnalyticsConsentToast />);

      expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
    });

    test('displays close button', () => {
      render(<AnalyticsConsentToast />);

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });
  });

  describe('Accept Button', () => {
    test('enables analytics when Accept is clicked', () => {
      render(<AnalyticsConsentToast />);

      const acceptButton = screen.getByRole('button', { name: /accept/i });
      fireEvent.click(acceptButton);

      expect(mockHandleToggleAnalyticsOptOut).toHaveBeenCalledWith(true);
    });

    test('saves consent shown state when Accept is clicked', () => {
      render(<AnalyticsConsentToast />);

      const acceptButton = screen.getByRole('button', { name: /accept/i });
      fireEvent.click(acceptButton);

      expect(mockSaveAnalyticsConsentShown).toHaveBeenCalledWith(true);
    });

    test('hides toast after Accept is clicked', () => {
      render(<AnalyticsConsentToast />);

      const acceptButton = screen.getByRole('button', { name: /accept/i });
      fireEvent.click(acceptButton);

      expect(screen.queryByText('Help us improve')).not.toBeInTheDocument();
    });
  });

  describe('Dismiss Button', () => {
    test('does NOT enable analytics when Dismiss is clicked', () => {
      render(<AnalyticsConsentToast />);

      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      fireEvent.click(dismissButton);

      expect(mockHandleToggleAnalyticsOptOut).not.toHaveBeenCalled();
    });

    test('saves consent shown state when Dismiss is clicked', () => {
      render(<AnalyticsConsentToast />);

      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      fireEvent.click(dismissButton);

      expect(mockSaveAnalyticsConsentShown).toHaveBeenCalledWith(true);
    });

    test('hides toast after Dismiss is clicked', () => {
      render(<AnalyticsConsentToast />);

      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      fireEvent.click(dismissButton);

      expect(screen.queryByText('Help us improve')).not.toBeInTheDocument();
    });
  });

  describe('Close Button (X)', () => {
    test('does NOT enable analytics when close button is clicked', () => {
      render(<AnalyticsConsentToast />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(mockHandleToggleAnalyticsOptOut).not.toHaveBeenCalled();
    });

    test('saves consent shown state when close button is clicked', () => {
      render(<AnalyticsConsentToast />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(mockSaveAnalyticsConsentShown).toHaveBeenCalledWith(true);
    });

    test('hides toast after close button is clicked', () => {
      render(<AnalyticsConsentToast />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(screen.queryByText('Help us improve')).not.toBeInTheDocument();
    });
  });
});


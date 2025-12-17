import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Control localStorage mock values
const { getMockAnalyticsConsentShown, setMockAnalyticsConsentShown, mockSaveAnalyticsConsentShown } = vi.hoisted(() => {
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

// Mock analytics preferences with trackable functions
const mockHandleToggleAnalyticsOptOut = vi.fn();
const mockHandleToggleEnhancedAnalyticsOptOut = vi.fn();
const mockHandleToggleSessionReplayOptOut = vi.fn();

vi.mock('../ui/Toolbar/context/telemetry/AnalyticsPreferencesProvider', () => ({
  useAnalyticsPreferences: () => ({
    isOptedInToAnalytics: false,
    isOptedInToEnhancedAnalytics: false,
    isOptedInToSessionReplay: false,
    handleToggleAnalyticsOptOut: mockHandleToggleAnalyticsOptOut,
    handleToggleEnhancedAnalyticsOptOut: mockHandleToggleEnhancedAnalyticsOptOut,
    handleToggleSessionReplayOptOut: mockHandleToggleSessionReplayOptOut,
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

    test('displays Accept and Decline buttons', () => {
      render(<AnalyticsConsentToast />);

      expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /decline/i })).toBeInTheDocument();
    });

    test('displays close button', () => {
      render(<AnalyticsConsentToast />);

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });
  });

  describe('Accept Button', () => {
    test('enables base analytics when Accept is clicked', () => {
      render(<AnalyticsConsentToast />);

      const acceptButton = screen.getByRole('button', { name: /accept/i });
      fireEvent.click(acceptButton);

      expect(mockHandleToggleAnalyticsOptOut).toHaveBeenCalledWith(true);
    });

    test('enables enhanced analytics when Accept is clicked', () => {
      render(<AnalyticsConsentToast />);

      const acceptButton = screen.getByRole('button', { name: /accept/i });
      fireEvent.click(acceptButton);

      expect(mockHandleToggleEnhancedAnalyticsOptOut).toHaveBeenCalledWith(true);
    });

    test('enables session replay when Accept is clicked', () => {
      render(<AnalyticsConsentToast />);

      const acceptButton = screen.getByRole('button', { name: /accept/i });
      fireEvent.click(acceptButton);

      expect(mockHandleToggleSessionReplayOptOut).toHaveBeenCalledWith(true);
    });

    test('enables all analytics preferences when Accept is clicked', () => {
      render(<AnalyticsConsentToast />);

      const acceptButton = screen.getByRole('button', { name: /accept/i });
      fireEvent.click(acceptButton);

      // Verify all three analytics preferences are enabled
      expect(mockHandleToggleAnalyticsOptOut).toHaveBeenCalledWith(true);
      expect(mockHandleToggleEnhancedAnalyticsOptOut).toHaveBeenCalledWith(true);
      expect(mockHandleToggleSessionReplayOptOut).toHaveBeenCalledWith(true);
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

  describe('Decline Button', () => {
    test('explicitly disables all analytics when Decline is clicked', () => {
      render(<AnalyticsConsentToast />);

      const declineButton = screen.getByRole('button', { name: /decline/i });
      fireEvent.click(declineButton);

      expect(mockHandleToggleAnalyticsOptOut).toHaveBeenCalledWith(false);
      expect(mockHandleToggleEnhancedAnalyticsOptOut).toHaveBeenCalledWith(false);
      expect(mockHandleToggleSessionReplayOptOut).toHaveBeenCalledWith(false);
    });

    test('saves consent shown state when Decline is clicked', () => {
      render(<AnalyticsConsentToast />);

      const declineButton = screen.getByRole('button', { name: /decline/i });
      fireEvent.click(declineButton);

      expect(mockSaveAnalyticsConsentShown).toHaveBeenCalledWith(true);
    });

    test('hides toast after Decline is clicked', () => {
      render(<AnalyticsConsentToast />);

      const declineButton = screen.getByRole('button', { name: /decline/i });
      fireEvent.click(declineButton);

      expect(screen.queryByText('Help us improve')).not.toBeInTheDocument();
    });
  });

  describe('Close Button (X)', () => {
    test('does NOT enable any analytics when close button is clicked', () => {
      render(<AnalyticsConsentToast />);

      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);

      expect(mockHandleToggleAnalyticsOptOut).not.toHaveBeenCalled();
      expect(mockHandleToggleEnhancedAnalyticsOptOut).not.toHaveBeenCalled();
      expect(mockHandleToggleSessionReplayOptOut).not.toHaveBeenCalled();
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

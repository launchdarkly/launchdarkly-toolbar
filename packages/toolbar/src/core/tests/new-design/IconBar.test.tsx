import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { IconBar } from '../../ui/Toolbar/components/new/IconBar/IconBar';
import { ActiveTabProvider } from '../../ui/Toolbar/context/state/ActiveTabProvider';
import { ElementSelectionProvider } from '../../ui/Toolbar/context/ElementSelectionProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Create mock functions that can be reassigned
const mockEnableInteractiveIcon = vi.fn();
const mockEnableAiIcon = vi.fn();
const mockEnableOptimizeIcon = vi.fn();

// Mock the toolbar flags
vi.mock('../../../flags/toolbarFlags', () => ({
  enableInteractiveIcon: () => mockEnableInteractiveIcon(),
  enableAiIcon: () => mockEnableAiIcon(),
  enableOptimizeIcon: () => mockEnableOptimizeIcon(),
}));

// Mock the Tooltip component to show the content as title attribute for easier testing
vi.mock('../../ui/Toolbar/components/new/Tooltip', () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode; content: string }) => (
    <div title={content}>{children}</div>
  ),
}));

// Mock analytics
vi.mock('../../ui/Toolbar/context/telemetry/AnalyticsProvider', () => ({
  useAnalytics: vi.fn().mockReturnValue({
    trackTabChange: vi.fn(),
  }),
}));

describe('IconBar', () => {
  const defaultProps = {
    defaultActiveTab: 'flags' as const,
  };

  const renderIconBar = (props = defaultProps) => {
    return render(
      <ElementSelectionProvider>
        <ActiveTabProvider>
          <IconBar {...props} />
        </ActiveTabProvider>
      </ElementSelectionProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Set default mock return values - interactive enabled by default
    mockEnableInteractiveIcon.mockReturnValue(true);
    mockEnableAiIcon.mockReturnValue(false);
    mockEnableOptimizeIcon.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Icon Rendering', () => {
    it('should render all icons in the correct order', () => {
      renderIconBar();

      const buttons = screen.getAllByRole('button');

      // Verify all icons are present in order: interactive, flags, optimize, ai, monitoring, settings
      expect(buttons).toHaveLength(6);
      expect(buttons[0]).toHaveAttribute('aria-label', 'Interactive Mode');
      expect(buttons[1].getAttribute('aria-label')).toContain('Flags');
      expect(buttons[2]).toHaveAttribute('aria-label', 'Optimize');
      expect(buttons[3]).toHaveAttribute('aria-label', 'AI');
      expect(buttons[4]).toHaveAttribute('aria-label', 'Analytics');
      expect(buttons[5]).toHaveAttribute('aria-label', 'Settings');
    });

    it('should render all icons even when features are disabled', () => {
      mockEnableAiIcon.mockReturnValue(false);
      mockEnableOptimizeIcon.mockReturnValue(false);

      renderIconBar();

      const buttons = screen.getAllByRole('button');

      // All icons should still be present
      expect(screen.getByLabelText('Interactive Mode')).toBeInTheDocument();
      expect(buttons.find((btn) => btn.getAttribute('aria-label')?.includes('Flags'))).toBeInTheDocument();
      expect(screen.getByLabelText('Optimize')).toBeInTheDocument();
      expect(screen.getByLabelText('AI')).toBeInTheDocument();
      expect(screen.getByLabelText('Analytics')).toBeInTheDocument();
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should disable interactive icon when feature flag is disabled', () => {
      mockEnableInteractiveIcon.mockReturnValue(false);
      renderIconBar();

      const interactiveButton = screen.getByLabelText('Interactive Mode');
      expect(interactiveButton).toBeDisabled();
      expect(interactiveButton.className).toContain('disabled');
    });

    it('should enable interactive icon when feature flag is enabled', () => {
      mockEnableInteractiveIcon.mockReturnValue(true);
      renderIconBar();

      const interactiveButton = screen.getByLabelText('Interactive Mode');
      expect(interactiveButton).not.toBeDisabled();
      expect(interactiveButton.className).not.toContain('disabled');
    });

    it('should disable AI icon when feature flag is disabled', () => {
      mockEnableAiIcon.mockReturnValue(false);
      renderIconBar();

      const aiButton = screen.getByLabelText('AI');
      expect(aiButton).toBeDisabled();
      expect(aiButton.className).toContain('disabled');
    });

    it('should enable AI icon when feature flag is enabled', () => {
      mockEnableAiIcon.mockReturnValue(true);
      renderIconBar();

      const aiButton = screen.getByLabelText('AI');
      expect(aiButton).not.toBeDisabled();
      expect(aiButton.className).not.toContain('disabled');
    });

    it('should disable Optimize icon when feature flag is disabled', () => {
      mockEnableOptimizeIcon.mockReturnValue(false);
      renderIconBar();

      const optimizeButton = screen.getByLabelText('Optimize');
      expect(optimizeButton).toBeDisabled();
      expect(optimizeButton.className).toContain('disabled');
    });

    it('should enable Optimize icon when feature flag is enabled', () => {
      mockEnableOptimizeIcon.mockReturnValue(true);
      renderIconBar();

      const optimizeButton = screen.getByLabelText('Optimize');
      expect(optimizeButton).not.toBeDisabled();
      expect(optimizeButton.className).not.toContain('disabled');
    });

    it('should never disable Flags, Analytics, or Settings icons', () => {
      renderIconBar();

      const buttons = screen.getAllByRole('button');
      const flagsButton = buttons.find((btn) => btn.getAttribute('aria-label')?.includes('Flags'));
      const analyticsButton = screen.getByLabelText('Analytics');
      const settingsButton = screen.getByLabelText('Settings');

      expect(flagsButton).not.toBeDisabled();
      expect(analyticsButton).not.toBeDisabled();
      expect(settingsButton).not.toBeDisabled();
    });
  });

  describe('Tooltips', () => {
    it('should show standard tooltips for always-enabled icons', () => {
      renderIconBar();

      const buttons = screen.getAllByRole('button');
      const flagsButton = buttons.find((btn) => btn.getAttribute('aria-label')?.includes('Flags'));
      const analyticsButton = screen.getByLabelText('Analytics');
      const settingsButton = screen.getByLabelText('Settings');

      expect(flagsButton?.parentElement).toHaveAttribute('title', 'Feature Flags');
      expect(analyticsButton.parentElement).toHaveAttribute('title', 'Monitoring');
      expect(settingsButton.parentElement).toHaveAttribute('title', 'Settings');
    });

    it('should show "Coming Soon" tooltip for disabled interactive icon', () => {
      mockEnableInteractiveIcon.mockReturnValue(false);
      renderIconBar();

      const interactiveButton = screen.getByLabelText('Interactive Mode');
      expect(interactiveButton.parentElement).toHaveAttribute('title', 'Interactive Mode (Coming Soon)');
    });

    it('should show regular tooltip for enabled interactive icon', () => {
      mockEnableInteractiveIcon.mockReturnValue(true);
      renderIconBar();

      const interactiveButton = screen.getByLabelText('Interactive Mode');
      expect(interactiveButton.parentElement).toHaveAttribute('title', 'Interactive Mode');
    });

    it('should show "Coming Soon" tooltip for disabled AI icon', () => {
      mockEnableAiIcon.mockReturnValue(false);
      renderIconBar();

      const aiButton = screen.getByLabelText('AI');
      expect(aiButton.parentElement).toHaveAttribute('title', 'AI (Coming Soon)');
    });

    it('should show regular tooltip for enabled AI icon', () => {
      mockEnableAiIcon.mockReturnValue(true);
      renderIconBar();

      const aiButton = screen.getByLabelText('AI');
      expect(aiButton.parentElement).toHaveAttribute('title', 'AI');
    });

    it('should show "Coming Soon" tooltip for disabled Optimize icon', () => {
      mockEnableOptimizeIcon.mockReturnValue(false);
      renderIconBar();

      const optimizeButton = screen.getByLabelText('Optimize');
      expect(optimizeButton.parentElement).toHaveAttribute('title', 'Optimization (Coming Soon)');
    });

    it('should show regular tooltip for enabled Optimize icon', () => {
      mockEnableOptimizeIcon.mockReturnValue(true);
      renderIconBar();

      const optimizeButton = screen.getByLabelText('Optimize');
      expect(optimizeButton.parentElement).toHaveAttribute('title', 'Optimization');
    });
  });

  describe('Tab Selection', () => {
    it('should set the default active tab on mount', () => {
      renderIconBar();

      const buttons = screen.getAllByRole('button');
      const flagsButton = buttons.find((btn) => btn.getAttribute('aria-label')?.includes('Flags'));
      expect(flagsButton?.className).toContain('active');
    });

    it('should accept different default active tabs', () => {
      render(
        <ElementSelectionProvider>
          <ActiveTabProvider>
            <IconBar defaultActiveTab="settings" />
          </ActiveTabProvider>
        </ElementSelectionProvider>,
      );

      const settingsButton = screen.getByLabelText('Settings');
      expect(settingsButton.className).toContain('active');
    });

    it('should change active tab when enabled icon is clicked', () => {
      renderIconBar();

      const analyticsButton = screen.getByLabelText('Analytics');
      fireEvent.click(analyticsButton);

      expect(analyticsButton.className).toContain('active');
    });

    it('should not change active tab when disabled icon is clicked', () => {
      mockEnableInteractiveIcon.mockReturnValue(false);
      renderIconBar();

      const buttons = screen.getAllByRole('button');
      const flagsButton = buttons.find((btn) => btn.getAttribute('aria-label')?.includes('Flags'));
      const interactiveButton = screen.getByLabelText('Interactive Mode');

      // Flags should be active initially
      expect(flagsButton?.className).toContain('active');

      // Try to click disabled interactive icon
      fireEvent.click(interactiveButton);

      // Flags should still be active
      expect(flagsButton?.className).toContain('active');
      expect(interactiveButton.className).not.toContain('active');
    });

    it('should handle switching between multiple enabled tabs', () => {
      renderIconBar();

      const buttons = screen.getAllByRole('button');
      const flagsButton = buttons.find((btn) => btn.getAttribute('aria-label')?.includes('Flags'));
      const settingsButton = screen.getByLabelText('Settings');
      const analyticsButton = screen.getByLabelText('Analytics');

      // Initially flags should be active
      expect(flagsButton?.className).toContain('active');

      // Click settings
      fireEvent.click(settingsButton);
      expect(settingsButton.className).toContain('active');
      expect(flagsButton?.className).not.toContain('active');

      // Click analytics
      fireEvent.click(analyticsButton);
      expect(analyticsButton.className).toContain('active');
      expect(settingsButton.className).not.toContain('active');
    });

    it('should allow switching to enabled feature icons', () => {
      mockEnableAiIcon.mockReturnValue(true);
      mockEnableOptimizeIcon.mockReturnValue(true);

      renderIconBar();

      const interactiveButton = screen.getByLabelText('Interactive Mode');
      const aiButton = screen.getByLabelText('AI');
      const optimizeButton = screen.getByLabelText('Optimize');

      fireEvent.click(interactiveButton);
      expect(interactiveButton.className).toContain('active');

      fireEvent.click(aiButton);
      expect(aiButton.className).toContain('active');
      expect(interactiveButton.className).not.toContain('active');

      fireEvent.click(optimizeButton);
      expect(optimizeButton.className).toContain('active');
      expect(aiButton.className).not.toContain('active');
    });
  });

  describe('Feature Flag Combinations', () => {
    it('should handle all features enabled', () => {
      mockEnableInteractiveIcon.mockReturnValue(true);
      mockEnableAiIcon.mockReturnValue(true);
      mockEnableOptimizeIcon.mockReturnValue(true);

      renderIconBar();

      expect(screen.getByLabelText('Interactive Mode')).not.toBeDisabled();
      expect(screen.getByLabelText('AI')).not.toBeDisabled();
      expect(screen.getByLabelText('Optimize')).not.toBeDisabled();
    });

    it('should handle all features disabled', () => {
      mockEnableInteractiveIcon.mockReturnValue(false);
      mockEnableAiIcon.mockReturnValue(false);
      mockEnableOptimizeIcon.mockReturnValue(false);

      renderIconBar();

      expect(screen.getByLabelText('Interactive Mode')).toBeDisabled();
      expect(screen.getByLabelText('AI')).toBeDisabled();
      expect(screen.getByLabelText('Optimize')).toBeDisabled();
    });

    it('should handle mixed enabled/disabled state', () => {
      mockEnableInteractiveIcon.mockReturnValue(true);
      mockEnableAiIcon.mockReturnValue(false);
      mockEnableOptimizeIcon.mockReturnValue(true);

      renderIconBar();

      expect(screen.getByLabelText('Interactive Mode')).not.toBeDisabled();
      expect(screen.getByLabelText('AI')).toBeDisabled();
      expect(screen.getByLabelText('Optimize')).not.toBeDisabled();
    });
  });
});

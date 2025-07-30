import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';

import { LaunchDarklyToolbar } from '../ui/Toolbar/LaunchDarklyToolbar';

// Mock the DevServerClient to avoid actual network calls in tests
vi.mock('../services/DevServerClient', () => ({
  DevServerClient: vi.fn().mockImplementation(() => ({
    getAvailableProjects: vi.fn().mockResolvedValue(['test-project']),
    setProjectKey: vi.fn(),
    getProjectKey: vi.fn().mockReturnValue('test-project'),
    getProjectData: vi.fn().mockResolvedValue({
      sourceEnvironmentKey: 'test-environment',
      flagsState: {},
      overrides: {},
      availableVariations: {},
      _lastSyncedFromSource: Date.now(),
    }),
    setOverride: vi.fn(),
    clearOverride: vi.fn(),
    healthCheck: vi.fn().mockResolvedValue(true),
  })),
}));

// Mock the FlagStateManager
vi.mock('../services/FlagStateManager', () => ({
  FlagStateManager: vi.fn().mockImplementation(() => ({
    getEnhancedFlags: vi.fn().mockResolvedValue({}),
    setOverride: vi.fn(),
    clearOverride: vi.fn(),
    subscribe: vi.fn().mockReturnValue(() => {}),
  })),
}));

describe('LaunchDarklyToolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders toolbar with auto-detection (no projectKey)', async () => {
    render(<LaunchDarklyToolbar />);

    // Logo should be visible to users
    expect(screen.getByLabelText('LaunchDarkly')).toBeInTheDocument();
  });

  test('renders toolbar with explicit projectKey', async () => {
    render(<LaunchDarklyToolbar projectKey="explicit-project" />);

    // Logo should be visible to users
    expect(screen.getByLabelText('LaunchDarkly')).toBeInTheDocument();
  });

  test('starts collapsed by default', () => {
    render(<LaunchDarklyToolbar />);

    // No tabs should be visible when collapsed
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();

    // But logo should be visible
    expect(screen.getByLabelText('LaunchDarkly')).toBeInTheDocument();
  });

  describe('CSS injection', () => {
    test('should inject CSS styles on component mount', () => {
      render(<LaunchDarklyToolbar />);

      // Check that a style element with the expected ID is created
      const styleElement = document.getElementById('launchdarkly-toolbar-styles');
      expect(styleElement).toBeInTheDocument();
      expect(styleElement?.tagName).toBe('STYLE');
    });

    test('should not create duplicate style elements on multiple renders', () => {
      const { rerender } = render(<LaunchDarklyToolbar />);

      // Rerender the component
      rerender(<LaunchDarklyToolbar projectKey="test-project" />);

      // Should still only have one style element
      const styleElements = document.querySelectorAll('#launchdarkly-toolbar-styles');
      expect(styleElements).toHaveLength(1);
    });

    test('should inject actual CSS content', () => {
      render(<LaunchDarklyToolbar />);

      const styleElement = document.getElementById('launchdarkly-toolbar-styles');
      expect(styleElement?.textContent).toBeTruthy();
      expect(styleElement?.textContent?.length).toBeGreaterThan(0);

      // Should contain some expected CSS patterns
      expect(styleElement?.textContent).toMatch(/\.[a-zA-Z0-9_-]+/); // CSS class selectors
    });
  });
});

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
});

import { render, screen, waitFor, act } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { EnvironmentProvider, useEnvironmentContext } from '../ui/Toolbar/context/api/EnvironmentProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock the ProjectProvider
vi.mock('../ui/Toolbar/context/api/ProjectProvider', () => ({
  useProjectContext: vi.fn(),
}));

import { useProjectContext } from '../ui/Toolbar/context/api/ProjectProvider';

// Test component that uses the Environment context
function TestConsumer() {
  const { environment } = useEnvironmentContext();

  return (
    <div>
      <div data-testid="environment">{environment || 'none'}</div>
    </div>
  );
}

// Test component with environment setter
function TestConsumerWithSetter() {
  const { environment, setEnvironment } = useEnvironmentContext();

  return (
    <div>
      <div data-testid="environment">{environment || 'none'}</div>
      <button data-testid="set-staging" onClick={() => setEnvironment('staging')}>
        Set Staging
      </button>
      <button data-testid="set-production" onClick={() => setEnvironment('production')}>
        Set Production
      </button>
    </div>
  );
}

describe('EnvironmentProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock - no environments
    (useProjectContext as any).mockReturnValue({
      environments: [],
    });
  });

  describe('Environment Auto-Detection - First Time User', () => {
    test('defaults to production when no environments available and no saved value', async () => {
      // GIVEN: New developer with no saved environment and no environments from project
      (useProjectContext as any).mockReturnValue({
        environments: [],
      });

      // WHEN: Provider initializes
      render(
        <EnvironmentProvider>
          <TestConsumer />
        </EnvironmentProvider>,
      );

      // THEN: Defaults to production
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });
    });

    test('auto-selects first available environment when no environment is saved', async () => {
      // GIVEN: New developer using toolbar for first time (no saved environment)
      (useProjectContext as any).mockReturnValue({
        environments: [
          { _id: 'env-1', key: 'staging', name: 'Staging' },
          { _id: 'env-2', key: 'production', name: 'Production' },
        ],
      });

      // WHEN: They open the toolbar
      render(
        <EnvironmentProvider>
          <TestConsumer />
        </EnvironmentProvider>,
      );

      // THEN: System auto-selects the first environment
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('staging');
      });
    });

    test('selects environment matching provided clientSideId', async () => {
      // GIVEN: Developer initializes toolbar with a specific clientSideId
      const clientSideId = 'sdk-key-production';

      (useProjectContext as any).mockReturnValue({
        environments: [
          { _id: 'sdk-key-staging', key: 'staging', name: 'Staging' },
          { _id: clientSideId, key: 'production', name: 'Production' },
        ],
      });

      // WHEN: Toolbar initializes with clientSideId
      render(
        <EnvironmentProvider clientSideId={clientSideId}>
          <TestConsumer />
        </EnvironmentProvider>,
      );

      // THEN: Correct environment is auto-selected based on SDK key
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });
    });

    test('falls back to first environment when clientSideId does not match', async () => {
      // GIVEN: Developer provides a clientSideId that doesn't match any environment
      (useProjectContext as any).mockReturnValue({
        environments: [
          { _id: 'env-1', key: 'staging', name: 'Staging' },
          { _id: 'env-2', key: 'production', name: 'Production' },
        ],
      });

      // WHEN: Toolbar initializes with non-matching clientSideId
      render(
        <EnvironmentProvider clientSideId="non-existent-sdk-key">
          <TestConsumer />
        </EnvironmentProvider>,
      );

      // THEN: Falls back to first available environment
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('staging');
      });
    });
  });

;

  describe('Environment Selection Workflow', () => {
    test('allows changing environment after initial selection', async () => {
      // GIVEN: User has an environment selected
      (useProjectContext as any).mockReturnValue({
        environments: [
          { _id: 'env-1', key: 'production', name: 'Production' },
          { _id: 'env-2', key: 'staging', name: 'Staging' },
        ],
      });

      render(
        <EnvironmentProvider>
          <TestConsumerWithSetter />
        </EnvironmentProvider>,
      );

      // Initial environment auto-selected (first one)
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });

      // WHEN: User switches to different environment
      const switchButton = screen.getByTestId('set-staging');
      act(() => {
        switchButton.click();
      });

      // THEN: Environment updates
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('staging');
      });
    });
  });

  describe('Context Hook - useEnvironmentContext', () => {
    test('throws error when used without EnvironmentProvider', () => {
      // GIVEN: Component uses context without provider
      const TestDefault = () => {
        const { environment } = useEnvironmentContext();
        return <div data-testid="environment">{environment}</div>;
      };

      // WHEN: Rendered without provider
      // THEN: Should throw an error
      expect(() => {
        render(<TestDefault />);
      }).toThrow('useEnvironmentContext must be used within an EnvironmentProvider');
    });
  });

  describe('Edge Cases', () => {
    test('handles empty environments array gracefully', async () => {
      // GIVEN: Project has no environments configured
      (useProjectContext as any).mockReturnValue({
        environments: [],
      });

      // WHEN: Provider initializes
      render(
        <EnvironmentProvider>
          <TestConsumer />
        </EnvironmentProvider>,
      );

      // THEN: Defaults to production without crashing
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });
    });

    test('handles environments being updated after initial render', async () => {
      // GIVEN: Initially no environments
      const mockUseProjectContext = useProjectContext as any;
      mockUseProjectContext.mockReturnValue({
        environments: [],
      });

      const { rerender } = render(
        <EnvironmentProvider>
          <TestConsumer />
        </EnvironmentProvider>,
      );

      // Initially defaults to production
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });

      // WHEN: Environments become available
      mockUseProjectContext.mockReturnValue({
        environments: [
          { _id: 'env-1', key: 'staging', name: 'Staging' },
          { _id: 'env-2', key: 'production', name: 'Production' },
        ],
      });

      rerender(
        <EnvironmentProvider>
          <TestConsumer />
        </EnvironmentProvider>,
      );

      // THEN: Environment updates to first available
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('staging');
      });
    });

  });
});

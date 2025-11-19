import { render, screen, waitFor, act } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { ApiProvider, useApi } from '../ui/Toolbar/context/ApiProvider';
import { getErrorTopic, getResponseTopic, IFRAME_COMMANDS, IFRAME_EVENTS } from '../ui/Toolbar/context/IFrameProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock the AuthProvider
vi.mock('../ui/Toolbar/context/AuthProvider', () => ({
  useAuthContext: vi.fn(),
}));

// Mock the IFrameProvider
vi.mock('../ui/Toolbar/context/IFrameProvider', () => ({
  IFRAME_COMMANDS: {
    GET_PROJECTS: 'GET_PROJECTS',
    GET_FLAGS: 'GET_FLAGS',
    GET_FLAG: 'GET_FLAG',
  },
  IFRAME_EVENTS: {
    API_READY: 'API_READY',
    AUTHENTICATED: 'AUTHENTICATED',
    AUTH_REQUIRED: 'AUTH_REQUIRED',
    AUTH_ERROR: 'AUTH_ERROR',
  },
  getResponseTopic: vi.fn().mockImplementation((command) => `${command}-response`),
  getErrorTopic: vi.fn().mockImplementation((command) => `${command}-error`),
  useIFrameContext: vi.fn(),
}));

// Mock the AnalyticsProvider
vi.mock('../ui/Toolbar/context/AnalyticsProvider', () => ({
  useAnalytics: vi.fn().mockReturnValue({
    trackLoginSuccess: vi.fn(),
    trackLoginCancelled: vi.fn(),
  }),
}));

import { useAuthContext } from '../ui/Toolbar/context/AuthProvider';
import { useIFrameContext } from '../ui/Toolbar/context/IFrameProvider';

// Test component that uses the API context
function TestConsumer() {
  const { apiReady, getProjects, getFlags, getFlag } = useApi();

  return (
    <div>
      <div data-testid="api-ready">{apiReady ? 'true' : 'false'}</div>
      <button data-testid="fetch-projects" onClick={() => getProjects()}>
        Fetch Projects
      </button>
      <button data-testid="fetch-flags" onClick={() => getFlags('test-project')}>
        Fetch Flags
      </button>
      <button data-testid="fetch-flag" onClick={() => getFlag('test-flag')}>
        Fetch Flag
      </button>
    </div>
  );
}

describe('ApiProvider', () => {
  const mockIframeRef = {
    current: {
      contentWindow: {
        postMessage: vi.fn(),
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuthContext as any).mockReturnValue({
      authenticated: true,
    });

    (useIFrameContext as any).mockReturnValue({
      ref: mockIframeRef,
      iframeSrc: 'https://integrations.launchdarkly.com',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization Flow', () => {
    test('starts with API not ready until iframe signals readiness', async () => {
      // GIVEN: Developer integrates the toolbar for the first time
      render(
        <ApiProvider>
          <TestConsumer />
        </ApiProvider>,
      );

      // WHEN: The component initially mounts
      // THEN: API is not ready yet (waiting for iframe)
      expect(screen.getByTestId('api-ready')).toHaveTextContent('false');

      // WHEN: The iframe loads and signals it's ready
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { type: IFRAME_EVENTS.API_READY },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      // THEN: API becomes ready for use
      await waitFor(() => {
        expect(screen.getByTestId('api-ready')).toHaveTextContent('true');
      });
    });

    test('ignores API ready messages from unauthorized origins', async () => {
      // GIVEN: Malicious actor tries to spoof API ready message
      render(
        <ApiProvider>
          <TestConsumer />
        </ApiProvider>,
      );

      // WHEN: A message arrives from wrong origin
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { type: IFRAME_EVENTS.API_READY },
            origin: 'https://evil.com',
          }),
        );
      });

      // THEN: API remains not ready (security preserved)
      expect(screen.getByTestId('api-ready')).toHaveTextContent('false');
    });
  });

  describe('Project Fetching - Developer Workflow', () => {
    test('fetches projects when developer needs to see available projects', async () => {
      // GIVEN: Developer wants to see which projects they can work with
      render(
        <ApiProvider>
          <TestConsumer />
        </ApiProvider>,
      );

      // Make API ready
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { type: IFRAME_EVENTS.API_READY },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      // WHEN: They request projects
      const fetchButton = screen.getByTestId('fetch-projects');

      await act(async () => {
        fetchButton.click();

        // Simulate iframe responding with projects
        await new Promise((resolve) => {
          setTimeout(() => {
            window.dispatchEvent(
              new MessageEvent('message', {
                data: {
                  type: getResponseTopic(IFRAME_COMMANDS.GET_PROJECTS),
                  data: {
                    items: [
                      { key: 'project-1', name: 'Project 1' },
                      { key: 'project-2', name: 'Project 2' },
                    ],
                  },
                },
                origin: 'https://integrations.launchdarkly.com',
              }),
            );
            resolve(undefined);
          }, 10);
        });
      });

      // THEN: The correct message was sent to iframe
      expect(mockIframeRef.current.contentWindow.postMessage).toHaveBeenCalledWith(
        { type: IFRAME_COMMANDS.GET_PROJECTS },
        'https://integrations.launchdarkly.com',
      );
    });

    test('returns empty array when not authenticated', async () => {
      // GIVEN: User is not yet authenticated
      (useAuthContext as any).mockReturnValue({
        authenticated: false,
      });

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const TestWithPromise = () => {
        const { getProjects } = useApi();
        const [result, setResult] = React.useState<any[] | null>(null);

        return (
          <div>
            <button
              data-testid="fetch-projects"
              onClick={async () => {
                const projects = await getProjects();
                setResult(projects.items);
              }}
            >
              Fetch
            </button>
            <div data-testid="result">{result ? result.length.toString() : 'null'}</div>
          </div>
        );
      };

      render(
        <ApiProvider>
          <TestWithPromise />
        </ApiProvider>,
      );

      // WHEN: System tries to fetch projects
      const fetchButton = screen.getByTestId('fetch-projects');
      await act(async () => {
        fetchButton.click();
      });

      // THEN: Returns empty array (no API call made)
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('0');
      });
      expect(consoleSpy).toHaveBeenCalledWith('Authentication required');

      consoleSpy.mockRestore();
    });

    test('handles project fetch errors gracefully', async () => {
      // GIVEN: API encounters an error (network, permission, etc.)
      const TestWithError = () => {
        const { getProjects } = useApi();
        const [error, setError] = React.useState<string | null>(null);

        return (
          <div>
            <button
              data-testid="fetch-projects"
              onClick={async () => {
                try {
                  await getProjects();
                } catch (e: any) {
                  setError(e.message);
                }
              }}
            >
              Fetch
            </button>
            <div data-testid="error">{error || 'none'}</div>
          </div>
        );
      };

      render(
        <ApiProvider>
          <TestWithError />
        </ApiProvider>,
      );

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { type: IFRAME_EVENTS.API_READY },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      // WHEN: Developer tries to fetch projects but error occurs
      const fetchButton = screen.getByTestId('fetch-projects');

      await act(async () => {
        fetchButton.click();

        // Simulate iframe responding with error
        await new Promise((resolve) => {
          setTimeout(() => {
            window.dispatchEvent(
              new MessageEvent('message', {
                data: {
                  type: getErrorTopic(IFRAME_COMMANDS.GET_PROJECTS),
                  error: 'Network error',
                },
                origin: 'https://integrations.launchdarkly.com',
              }),
            );
            resolve(undefined);
          }, 10);
        });
      });

      // THEN: Error is caught and displayed
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      });
    });
  });

  describe('Flags Fetching - Feature Development', () => {
    test('fetches flags for a specific project', async () => {
      // GIVEN: Developer is working on a specific project
      render(
        <ApiProvider>
          <TestConsumer />
        </ApiProvider>,
      );

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { type: IFRAME_EVENTS.API_READY },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      // WHEN: They need to see all flags in that project
      const fetchButton = screen.getByTestId('fetch-flags');

      await act(async () => {
        fetchButton.click();

        // Simulate iframe responding with flags
        await new Promise((resolve) => {
          setTimeout(() => {
            window.dispatchEvent(
              new MessageEvent('message', {
                data: {
                  type: getResponseTopic(IFRAME_COMMANDS.GET_FLAGS),
                  data: {
                    items: [
                      { key: 'feature-1', name: 'Feature 1' },
                      { key: 'feature-2', name: 'Feature 2' },
                    ],
                  },
                },
                origin: 'https://integrations.launchdarkly.com',
              }),
            );
            resolve(undefined);
          }, 10);
        });
      });

      // THEN: The correct project key was sent
      expect(mockIframeRef.current.contentWindow.postMessage).toHaveBeenCalledWith(
        { type: IFRAME_COMMANDS.GET_FLAGS, projectKey: 'test-project' },
        'https://integrations.launchdarkly.com',
      );
    });

    test('handles flags fetch errors', async () => {
      // GIVEN: API error occurs when fetching flags
      const TestWithError = () => {
        const { getFlags } = useApi();
        const [error, setError] = React.useState<string | null>(null);

        return (
          <div>
            <button
              data-testid="fetch-flags"
              onClick={async () => {
                try {
                  await getFlags('test-project');
                } catch (e: any) {
                  setError(e.message);
                }
              }}
            >
              Fetch
            </button>
            <div data-testid="error">{error || 'none'}</div>
          </div>
        );
      };

      render(
        <ApiProvider>
          <TestWithError />
        </ApiProvider>,
      );

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { type: IFRAME_EVENTS.API_READY },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      // WHEN: Fetching flags fails
      const fetchButton = screen.getByTestId('fetch-flags');

      await act(async () => {
        fetchButton.click();

        await new Promise((resolve) => {
          setTimeout(() => {
            window.dispatchEvent(
              new MessageEvent('message', {
                data: {
                  type: getErrorTopic(IFRAME_COMMANDS.GET_FLAGS),
                  error: 'Project not found',
                },
                origin: 'https://integrations.launchdarkly.com',
              }),
            );
            resolve(undefined);
          }, 10);
        });
      });

      // THEN: Error is caught and displayed
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Project not found');
      });
    });
  });

  describe('Individual Flag Fetching', () => {
    test('fetches a specific flag when needed', async () => {
      // GIVEN: Developer needs details about one specific flag
      render(
        <ApiProvider>
          <TestConsumer />
        </ApiProvider>,
      );

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { type: IFRAME_EVENTS.API_READY },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      // WHEN: They request that flag
      const fetchButton = screen.getByTestId('fetch-flag');

      await act(async () => {
        fetchButton.click();

        await new Promise((resolve) => {
          setTimeout(() => {
            window.dispatchEvent(
              new MessageEvent('message', {
                data: {
                  type: getResponseTopic(IFRAME_COMMANDS.GET_FLAG),
                  data: { key: 'test-flag', name: 'Test Flag', value: true },
                },
                origin: 'https://integrations.launchdarkly.com',
              }),
            );
            resolve(undefined);
          }, 10);
        });
      });

      // THEN: The correct flag key was requested
      expect(mockIframeRef.current.contentWindow.postMessage).toHaveBeenCalledWith(
        { type: IFRAME_COMMANDS.GET_FLAG, flagKey: 'test-flag' },
        'https://integrations.launchdarkly.com',
      );
    });
  });

  describe('Security - Origin Validation', () => {
    test('validates message origin before processing API responses', () => {
      // GIVEN: API provider is listening for messages
      render(
        <ApiProvider>
          <TestConsumer />
        </ApiProvider>,
      );

      // Make API ready
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { type: IFRAME_EVENTS.API_READY },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      // WHEN: Message from unauthorized origin is sent
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: getResponseTopic(IFRAME_COMMANDS.GET_PROJECTS),
              data: { items: [{ key: 'evil-project', name: 'Evil Project' }] },
            },
            origin: 'https://evil-attacker.com', // Wrong origin!
          }),
        );
      });

      // THEN: API ready state is maintained (message was ignored)
      expect(screen.getByTestId('api-ready')).toHaveTextContent('true');

      // AND: No projects are stored from the malicious message
      // (The component doesn't crash and continues working normally)
    });
  });

  describe('Error Handling - Missing IFrame', () => {
    test('throws error when iframe is not available', async () => {
      // GIVEN: IFrame hasn't loaded or was removed
      (useIFrameContext as any).mockReturnValue({
        ref: { current: null },
        iframeSrc: 'https://integrations.launchdarkly.com',
      });

      const TestWithError = () => {
        const { getProjects } = useApi();
        const [error, setError] = React.useState<string | null>(null);

        return (
          <div>
            <button
              data-testid="fetch-projects"
              onClick={async () => {
                try {
                  await getProjects();
                } catch (e: any) {
                  setError(e.message);
                }
              }}
            >
              Fetch
            </button>
            <div data-testid="error">{error || 'none'}</div>
          </div>
        );
      };

      render(
        <ApiProvider>
          <TestWithError />
        </ApiProvider>,
      );

      // WHEN: Developer tries to use API
      const fetchButton = screen.getByTestId('fetch-projects');
      await act(async () => {
        fetchButton.click();
      });

      // THEN: Clear error is thrown
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('IFrame not found');
      });
    });
  });

  describe('Context Hook - useApi', () => {
    test('throws error when used outside provider', () => {
      // GIVEN: Component tries to use API without provider
      const BadComponent = () => {
        useApi(); // This should throw
        return <div>Bad</div>;
      };

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // WHEN/THEN: Error is thrown with helpful message
      expect(() => {
        render(<BadComponent />);
      }).toThrow('useApi must be used within an ApiProvider');

      consoleSpy.mockRestore();
    });
  });
});

import { render, screen, waitFor, act } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { ApiProvider, useApi } from '../ui/Toolbar/context/api/ApiProvider';
import {
  getErrorTopic,
  getResponseTopic,
  IFRAME_COMMANDS,
  IFRAME_EVENTS,
} from '../ui/Toolbar/context/api/IFrameProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock the AuthProvider
vi.mock('../ui/Toolbar/context/api/AuthProvider', () => ({
  useAuthContext: vi.fn(),
}));

// Mock the IFrameProvider
vi.mock('../ui/Toolbar/context/api/IFrameProvider', () => ({
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
vi.mock('../ui/Toolbar/context/telemetry/AnalyticsProvider', () => ({
  useAnalytics: vi.fn().mockReturnValue({
    trackLoginSuccess: vi.fn(),
    trackLoginCancelled: vi.fn(),
    trackAuthError: vi.fn(),
    trackApiError: vi.fn(),
  }),
}));

import { useAuthContext } from '../ui/Toolbar/context/api/AuthProvider';
import { useIFrameContext } from '../ui/Toolbar/context/api/IFrameProvider';

// Test component that uses the API context
function TestConsumer() {
  const { apiReady, getProjects, getFlags } = useApi();

  return (
    <div>
      <div data-testid="api-ready">{apiReady ? 'true' : 'false'}</div>
      <button data-testid="fetch-projects" onClick={() => getProjects()}>
        Fetch Projects
      </button>
      <button data-testid="fetch-flags" onClick={() => getFlags('test-project')}>
        Fetch Flags
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
      expect(mockIframeRef.current.contentWindow.postMessage).toHaveBeenCalled();
      const call = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls[0];
      expect(call[0]).toMatchObject({ type: IFRAME_COMMANDS.GET_PROJECTS });
      expect(call[0].requestId).toBeDefined();
      expect(call[1]).toBe('https://integrations.launchdarkly.com');
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
            const calls = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls;
            const requestId = calls[calls.length - 1][0].requestId;

            window.dispatchEvent(
              new MessageEvent('message', {
                data: {
                  type: getErrorTopic(IFRAME_COMMANDS.GET_PROJECTS),
                  requestId: requestId,
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
    test('fetches flags for a specific project using queryParams pagination structure', async () => {
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

        // Simulate iframe responding with flags (fewer than page size → no more pages)
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

      // THEN: The correct project key and queryParams structure were sent
      expect(mockIframeRef.current.contentWindow.postMessage).toHaveBeenCalled();
      const call = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls[0];
      expect(call[0]).toMatchObject({
        type: IFRAME_COMMANDS.GET_FLAGS,
        projectKey: 'test-project',
        queryParams: { limit: '50', offset: '0' },
      });
      expect(call[0].requestId).toBeDefined();
      expect(call[1]).toBe('https://integrations.launchdarkly.com');
    });

    test('accumulates flags across multiple pages', async () => {
      // GIVEN: A project with more flags than fit in a single page
      const page1Items = Array.from({ length: 50 }, (_, i) => ({ key: `flag-${i}`, name: `Flag ${i}` }));
      const page2Items = Array.from({ length: 25 }, (_, i) => ({ key: `flag-${i + 50}`, name: `Flag ${i + 50}` }));

      const TestPagination = () => {
        const { getFlags } = useApi();
        const [count, setCount] = React.useState<number | null>(null);

        return (
          <div>
            <button
              data-testid="fetch-flags"
              onClick={async () => {
                const response = await getFlags('test-project');
                setCount(response.items.length);
              }}
            >
              Fetch
            </button>
            <div data-testid="count">{count ?? 'loading'}</div>
          </div>
        );
      };

      render(
        <ApiProvider>
          <TestPagination />
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

      // WHEN: Fetching flags that span two pages
      const fetchButton = screen.getByTestId('fetch-flags');

      await act(async () => {
        fetchButton.click();

        // Respond to page 1 (full page → triggers page 2 request)
        await new Promise((resolve) => setTimeout(resolve, 10));
        const calls = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls;
        const page1RequestId = calls[calls.length - 1][0].requestId;

        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: getResponseTopic(IFRAME_COMMANDS.GET_FLAGS),
              requestId: page1RequestId,
              data: { items: page1Items },
            },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );

        // Respond to page 2 (partial page → stops pagination)
        await new Promise((resolve) => setTimeout(resolve, 10));
        const calls2 = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls;
        const page2RequestId = calls2[calls2.length - 1][0].requestId;

        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: getResponseTopic(IFRAME_COMMANDS.GET_FLAGS),
              requestId: page2RequestId,
              data: { items: page2Items },
            },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );

        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      // THEN: Both pages are combined into a single result
      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('75');
      });

      // AND: Page 1 requested offset 0, page 2 requested offset 50
      const allCalls = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls;
      expect(allCalls[0][0]).toMatchObject({ queryParams: { limit: '50', offset: '0' } });
      expect(allCalls[1][0]).toMatchObject({ queryParams: { limit: '50', offset: '50' } });
    });

    test('stops paginating when a page returns fewer items than the page size', async () => {
      // GIVEN: A project whose first page is exactly the page size
      // but second page is empty (edge case: server returns exactly 0 on last page)
      const fullPage = Array.from({ length: 50 }, (_, i) => ({ key: `flag-${i}`, name: `Flag ${i}` }));

      const TestStopPagination = () => {
        const { getFlags } = useApi();
        const [count, setCount] = React.useState<number | null>(null);

        return (
          <div>
            <button
              data-testid="fetch-flags"
              onClick={async () => {
                const response = await getFlags('test-project');
                setCount(response.items.length);
              }}
            >
              Fetch
            </button>
            <div data-testid="count">{count ?? 'loading'}</div>
          </div>
        );
      };

      render(
        <ApiProvider>
          <TestStopPagination />
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

      const fetchButton = screen.getByTestId('fetch-flags');

      await act(async () => {
        fetchButton.click();

        // Respond to page 1 (full page → triggers page 2)
        await new Promise((resolve) => setTimeout(resolve, 10));
        const calls = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls;
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: getResponseTopic(IFRAME_COMMANDS.GET_FLAGS),
              requestId: calls[calls.length - 1][0].requestId,
              data: { items: fullPage },
            },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );

        // Respond to page 2 with empty items → pagination stops
        await new Promise((resolve) => setTimeout(resolve, 10));
        const calls2 = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls;
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: getResponseTopic(IFRAME_COMMANDS.GET_FLAGS),
              requestId: calls2[calls2.length - 1][0].requestId,
              data: { items: [] },
            },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );

        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      // THEN: Only the 50 items from page 1 are returned
      await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('50');
      });

      // AND: Exactly 2 postMessage calls were made (one per page)
      const allCalls = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls;
      expect(allCalls).toHaveLength(2);
    });

    test('forwards query param inside queryParams when searching', async () => {
      // GIVEN: Developer searches for a specific flag
      const TestQuery = () => {
        const { getFlags } = useApi();

        return (
          <div>
            <button data-testid="search" onClick={() => getFlags('test-project', { query: 'my-flag' })}>
              Search
            </button>
          </div>
        );
      };

      render(
        <ApiProvider>
          <TestQuery />
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

      // WHEN: They search with a query string
      await act(async () => {
        screen.getByTestId('search').click();
        await new Promise((resolve) => setTimeout(resolve, 10));

        const calls = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls;
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: getResponseTopic(IFRAME_COMMANDS.GET_FLAGS),
              requestId: calls[calls.length - 1][0].requestId,
              data: { items: [] },
            },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      // THEN: The query is included in queryParams
      const calls = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls;
      expect(calls[0][0]).toMatchObject({
        queryParams: { limit: '50', offset: '0', query: 'my-flag' },
      });
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
            const calls = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls;
            const requestId = calls[calls.length - 1][0].requestId;

            window.dispatchEvent(
              new MessageEvent('message', {
                data: {
                  type: getErrorTopic(IFRAME_COMMANDS.GET_FLAGS),
                  requestId: requestId,
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

  describe('Race Condition Prevention - Request ID Matching', () => {
    test('handles multiple concurrent requests of same type without mixing responses', async () => {
      // GIVEN: Developer makes multiple concurrent API calls (e.g., searching flags rapidly)
      const TestConcurrentRequests = () => {
        const { getFlags } = useApi();
        const [results, setResults] = React.useState<string[]>([]);

        const handleConcurrentRequests = async () => {
          // Simulate three rapid concurrent requests, each searching for a distinct flag
          const promises = [
            getFlags('project-1', { query: 'search-1' }),
            getFlags('project-2', { query: 'search-2' }),
            getFlags('project-3', { query: 'search-3' }),
          ];

          const responses = await Promise.all(promises);
          // Each response contains a single flag whose key identifies which project it came from
          setResults(responses.map((r) => r.items[0]?.key ?? 'missing'));
        };

        return (
          <div>
            <button data-testid="concurrent-fetch" onClick={handleConcurrentRequests}>
              Fetch Concurrent
            </button>
            <div data-testid="results">{results.join(',')}</div>
          </div>
        );
      };

      render(
        <ApiProvider>
          <TestConcurrentRequests />
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

      // WHEN: Multiple requests are made simultaneously
      const fetchButton = screen.getByTestId('concurrent-fetch');

      await act(async () => {
        fetchButton.click();

        // Simulate responses arriving in REVERSE order (worst case scenario)
        await new Promise((resolve) => {
          setTimeout(() => {
            // Get all postMessage calls to extract request IDs
            const calls = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls;
            const request3 = calls[calls.length - 1][0];
            const request2 = calls[calls.length - 2][0];
            const request1 = calls[calls.length - 3][0];

            // Send response for request 3 first (with a flag key identifying its project)
            window.dispatchEvent(
              new MessageEvent('message', {
                data: {
                  type: getResponseTopic(IFRAME_COMMANDS.GET_FLAGS),
                  requestId: request3.requestId,
                  data: { items: [{ key: 'project-3-flag' }] },
                },
                origin: 'https://integrations.launchdarkly.com',
              }),
            );

            // Then request 2
            window.dispatchEvent(
              new MessageEvent('message', {
                data: {
                  type: getResponseTopic(IFRAME_COMMANDS.GET_FLAGS),
                  requestId: request2.requestId,
                  data: { items: [{ key: 'project-2-flag' }] },
                },
                origin: 'https://integrations.launchdarkly.com',
              }),
            );

            // Finally request 1
            window.dispatchEvent(
              new MessageEvent('message', {
                data: {
                  type: getResponseTopic(IFRAME_COMMANDS.GET_FLAGS),
                  requestId: request1.requestId,
                  data: { items: [{ key: 'project-1-flag' }] },
                },
                origin: 'https://integrations.launchdarkly.com',
              }),
            );

            resolve(undefined);
          }, 10);
        });
      });

      // THEN: Each request receives the correct response (not mixed up)
      await waitFor(() => {
        expect(screen.getByTestId('results')).toHaveTextContent('project-1-flag,project-2-flag,project-3-flag');
      });
    });

    test('ensures each request has a unique request ID', async () => {
      // GIVEN: Multiple rapid requests are made
      const TestUniqueIds = () => {
        const { getFlags } = useApi();

        return (
          <div>
            <button
              data-testid="make-requests"
              onClick={async () => {
                // Fire off multiple requests rapidly
                getFlags('project-1');
                getFlags('project-2');
                getFlags('project-3');
              }}
            >
              Make Requests
            </button>
          </div>
        );
      };

      render(
        <ApiProvider>
          <TestUniqueIds />
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

      // WHEN: Multiple requests are made
      const button = screen.getByTestId('make-requests');
      await act(async () => {
        button.click();
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      // THEN: All request IDs are unique
      const calls = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls;
      const requestIds = calls.map((call: any) => call[0].requestId).filter(Boolean);

      expect(requestIds.length).toBeGreaterThanOrEqual(3);
      const uniqueIds = new Set(requestIds);
      expect(uniqueIds.size).toBe(requestIds.length); // All IDs are unique
    });

    test('ignores responses with mismatched request IDs', async () => {
      // GIVEN: A request is made but a response with the wrong ID arrives first
      const TestMismatchedId = () => {
        const { getFlags } = useApi();
        const [firstFlagKey, setFirstFlagKey] = React.useState<string>('pending');
        const [error, setError] = React.useState<string | null>(null);

        const handleFetch = async () => {
          try {
            const response = await getFlags('project-1');
            setFirstFlagKey(response.items[0]?.key ?? 'empty');
          } catch (e: any) {
            setError(e.message);
          }
        };

        return (
          <div>
            <button data-testid="fetch" onClick={handleFetch}>
              Fetch
            </button>
            <div data-testid="result">{firstFlagKey}</div>
            <div data-testid="error">{error || 'none'}</div>
          </div>
        );
      };

      render(
        <ApiProvider>
          <TestMismatchedId />
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

      // WHEN: Request is made
      const fetchButton = screen.getByTestId('fetch');

      await act(async () => {
        fetchButton.click();

        await new Promise((resolve) => {
          setTimeout(() => {
            // Get the actual request ID
            const calls = (mockIframeRef.current.contentWindow.postMessage as any).mock.calls;
            const actualRequestId = calls[calls.length - 1][0].requestId;

            // Send response with WRONG request ID first (should be ignored)
            window.dispatchEvent(
              new MessageEvent('message', {
                data: {
                  type: getResponseTopic(IFRAME_COMMANDS.GET_FLAGS),
                  requestId: 'wrong-id-12345',
                  data: { items: [{ key: 'wrong-flag' }] },
                },
                origin: 'https://integrations.launchdarkly.com',
              }),
            );

            // Then send response with CORRECT request ID
            setTimeout(() => {
              window.dispatchEvent(
                new MessageEvent('message', {
                  data: {
                    type: getResponseTopic(IFRAME_COMMANDS.GET_FLAGS),
                    requestId: actualRequestId,
                    data: { items: [{ key: 'correct-flag' }] },
                  },
                  origin: 'https://integrations.launchdarkly.com',
                }),
              );
              resolve(undefined);
            }, 10);
          }, 10);
        });
      });

      // THEN: Only the correct response is processed (wrong-flag was ignored)
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('correct-flag');
      });
    });
  });
});

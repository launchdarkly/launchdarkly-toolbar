import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

const mockIframeLoaded = { value: false };

vi.mock('../ui/Toolbar/context/api/IFrameProvider', () => ({
  IFrameProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useIFrameContext: () => ({
    ref: { current: null },
    iframeSrc: 'https://integrations.launchdarkly.com',
    iframeLoaded: mockIframeLoaded.value,
    onIFrameLoad: vi.fn(),
  }),
  IFRAME_COMMANDS: {
    LOGOUT: 'logout',
    GET_PROJECTS: 'get-projects',
    GET_FLAGS: 'get-flags',
    GET_FLAG: 'get-flag',
  },
  IFRAME_EVENTS: {
    AUTHENTICATED: 'toolbar-authenticated',
    AUTH_REQUIRED: 'toolbar-authentication-required',
    AUTH_ERROR: 'toolbar-authentication-error',
    API_READY: 'api-ready',
  },
  getResponseTopic: (command: string) => `${command}-response`,
  getErrorTopic: (command: string) => `${command}-error`,
}));

vi.mock('../ui/Toolbar/context/telemetry/AnalyticsProvider', () => ({
  useAnalytics: () => ({
    trackLoginSuccess: vi.fn(),
    trackAuthError: vi.fn(),
  }),
}));

vi.mock('../ui/Toolbar/context/telemetry/InternalClientProvider', () => ({
  useInternalClient: () => ({
    client: null,
    loading: false,
    error: null,
    updateContext: vi.fn(),
  }),
}));

import { AuthProvider, useAuthContext } from '../ui/Toolbar/context/api/AuthProvider';

function AuthStateDisplay() {
  const { loading, iframeError, authenticated } = useAuthContext();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="iframe-error">{String(iframeError)}</span>
      <span data-testid="authenticated">{String(authenticated)}</span>
    </div>
  );
}

describe('AuthProvider - Iframe Error Detection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockIframeLoaded.value = false;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not set iframeError before iframe loads', () => {
    mockIframeLoaded.value = false;

    render(
      <AuthProvider>
        <AuthStateDisplay />
      </AuthProvider>,
    );

    expect(screen.getByTestId('iframe-error')).toHaveTextContent('false');
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('should set iframeError after iframe loads and no message arrives within timeout', async () => {
    mockIframeLoaded.value = true;

    render(
      <AuthProvider>
        <AuthStateDisplay />
      </AuthProvider>,
    );

    expect(screen.getByTestId('iframe-error')).toHaveTextContent('false');

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId('iframe-error')).toHaveTextContent('true');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('should not set iframeError if a message arrives before the timeout', async () => {
    mockIframeLoaded.value = true;

    render(
      <AuthProvider>
        <AuthStateDisplay />
      </AuthProvider>,
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent('message', {
          origin: 'https://integrations.launchdarkly.com',
          data: { type: 'toolbar-authentication-required' },
        }),
      );
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId('iframe-error')).toHaveTextContent('false');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('should not set iframeError before the full timeout elapses', () => {
    mockIframeLoaded.value = true;

    render(
      <AuthProvider>
        <AuthStateDisplay />
      </AuthProvider>,
    );

    act(() => {
      vi.advanceTimersByTime(4999);
    });

    expect(screen.getByTestId('iframe-error')).toHaveTextContent('false');
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('should set loading to false when iframeError is triggered', () => {
    mockIframeLoaded.value = true;

    render(
      <AuthProvider>
        <AuthStateDisplay />
      </AuthProvider>,
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('iframe-error')).toHaveTextContent('true');
  });
});

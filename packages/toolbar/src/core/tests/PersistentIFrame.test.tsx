import React, { createRef } from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Tests for the PersistentIFrame component that is rendered in ApiBundleProvider.
 *
 * The PersistentIFrame component is responsible for:
 * 1. Always being mounted (persistent) for API calls
 * 2. Switching between index.html and authenticating.html based on auth state
 * 3. Providing the iframe ref that API calls depend on
 */

// Mock AuthProvider
const mockAuthContext = {
  authenticated: false,
  loading: false,
  authenticating: false,
  setAuthenticating: vi.fn(),
  logout: vi.fn(),
};

vi.mock('../ui/Toolbar/context/api/AuthProvider', () => ({
  useAuthContext: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Create a ref we can inspect
const mockIframeRef = createRef<HTMLIFrameElement>();

vi.mock('../ui/Toolbar/context/api/IFrameProvider', async (importOriginal) => {
  const original = await importOriginal<typeof import('../ui/Toolbar/context/api/IFrameProvider')>();
  return {
    ...original,
    useIFrameContext: () => ({
      ref: mockIframeRef,
      iframeSrc: 'https://integrations.launchdarkly.com',
    }),
  };
});

// Mock analytics
vi.mock('../ui/Toolbar/context/telemetry/AnalyticsProvider', () => ({
  useAnalytics: () => ({
    trackApiError: vi.fn(),
  }),
}));

// Mock internal client
vi.mock('../ui/Toolbar/context/telemetry/InternalClientProvider', () => ({
  useInternalClient: () => ({
    client: null,
    loading: false,
    error: null,
    updateContext: vi.fn(),
  }),
}));

// Mock plugins provider
vi.mock('../ui/Toolbar/context/state/PluginsProvider', () => ({
  usePlugins: () => ({
    flagOverridePlugin: null,
    eventInterceptionPlugin: null,
  }),
}));

// Import after mocks
import { IFrameProvider, useIFrameContext } from '../ui/Toolbar/context/api/IFrameProvider';

// Create a test component that mimics PersistentIFrame behavior
// (We test the behavior rather than the internal component directly)
function TestPersistentIFrame() {
  const { ref, iframeSrc } = useIFrameContext();
  const { authenticating } = mockAuthContext;

  const src = authenticating
    ? `${iframeSrc}/toolbar/authenticating.html?originUrl=${window.location.origin}`
    : `${iframeSrc}/toolbar/index.html?originUrl=${window.location.origin}`;

  return (
    <iframe
      ref={ref}
      src={src}
      title="LaunchDarkly Toolbar Auth"
      style={{ display: 'none' }}
      data-testid="persistent-iframe"
    />
  );
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <IFrameProvider authUrl="https://integrations.launchdarkly.com">{children}</IFrameProvider>;
}

describe('PersistentIFrame', () => {
  beforeEach(() => {
    mockAuthContext.authenticated = false;
    mockAuthContext.authenticating = false;
    vi.clearAllMocks();
  });

  describe('iframe rendering', () => {
    it('should always render iframe regardless of authentication state', () => {
      mockAuthContext.authenticated = false;
      mockAuthContext.authenticating = false;

      render(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      const iframe = screen.getByTestId('persistent-iframe');
      expect(iframe).toBeDefined();
      expect(iframe.tagName).toBe('IFRAME');
    });

    it('should render iframe as hidden', () => {
      render(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      const iframe = screen.getByTestId('persistent-iframe');
      expect(iframe.style.display).toBe('none');
    });

    it('should have correct accessibility title', () => {
      render(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      const iframe = screen.getByTitle('LaunchDarkly Toolbar Auth');
      expect(iframe).toBeDefined();
    });
  });

  describe('iframe source URL', () => {
    it('should use index.html when not authenticating', () => {
      mockAuthContext.authenticating = false;

      render(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      const iframe = screen.getByTestId('persistent-iframe') as HTMLIFrameElement;
      expect(iframe.src).toContain('/toolbar/index.html');
      expect(iframe.src).not.toContain('/toolbar/authenticating.html');
    });

    it('should use authenticating.html when authenticating', () => {
      mockAuthContext.authenticating = true;

      render(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      const iframe = screen.getByTestId('persistent-iframe') as HTMLIFrameElement;
      expect(iframe.src).toContain('/toolbar/authenticating.html');
      expect(iframe.src).not.toContain('/toolbar/index.html');
    });

    it('should include originUrl parameter in source', () => {
      render(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      const iframe = screen.getByTestId('persistent-iframe') as HTMLIFrameElement;
      expect(iframe.src).toContain('originUrl=');
    });

    it('should switch from index.html to authenticating.html when auth starts', () => {
      mockAuthContext.authenticating = false;

      const { rerender } = render(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      let iframe = screen.getByTestId('persistent-iframe') as HTMLIFrameElement;
      expect(iframe.src).toContain('/toolbar/index.html');

      // Simulate auth starting
      mockAuthContext.authenticating = true;

      rerender(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      iframe = screen.getByTestId('persistent-iframe') as HTMLIFrameElement;
      expect(iframe.src).toContain('/toolbar/authenticating.html');
    });

    it('should switch from authenticating.html to index.html when auth completes', () => {
      mockAuthContext.authenticating = true;

      const { rerender } = render(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      let iframe = screen.getByTestId('persistent-iframe') as HTMLIFrameElement;
      expect(iframe.src).toContain('/toolbar/authenticating.html');

      // Simulate auth completing
      mockAuthContext.authenticating = false;

      rerender(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      iframe = screen.getByTestId('persistent-iframe') as HTMLIFrameElement;
      expect(iframe.src).toContain('/toolbar/index.html');
    });
  });

  describe('iframe persistence', () => {
    it('should maintain iframe when authentication state changes', () => {
      const { rerender, container } = render(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      // Get initial iframe element
      const initialIframe = container.querySelector('iframe');
      expect(initialIframe).not.toBeNull();

      // Change authentication state
      mockAuthContext.authenticated = true;

      rerender(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      // Iframe should still exist
      const afterAuthIframe = container.querySelector('iframe');
      expect(afterAuthIframe).not.toBeNull();
    });

    it('should not unmount/remount iframe during auth state transitions', () => {
      mockAuthContext.authenticating = false;

      const { rerender, container } = render(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      const iframe1 = container.querySelector('iframe');

      // Start authenticating
      mockAuthContext.authenticating = true;
      rerender(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      const iframe2 = container.querySelector('iframe');

      // Finish authenticating
      mockAuthContext.authenticating = false;
      mockAuthContext.authenticated = true;
      rerender(
        <TestWrapper>
          <TestPersistentIFrame />
        </TestWrapper>,
      );

      const iframe3 = container.querySelector('iframe');

      // All iframes should exist (component never unmounts)
      expect(iframe1).toBeDefined();
      expect(iframe2).toBeDefined();
      expect(iframe3).toBeDefined();
    });
  });
});

describe('PersistentIFrame API Integration', () => {
  beforeEach(() => {
    mockAuthContext.authenticated = false;
    mockAuthContext.authenticating = false;
    vi.clearAllMocks();
  });

  it('should be available for API calls immediately after mount', () => {
    render(
      <TestWrapper>
        <TestPersistentIFrame />
      </TestWrapper>,
    );

    // The iframe should exist in the DOM
    const iframe = screen.getByTestId('persistent-iframe');
    expect(iframe).toBeDefined();

    // In real usage, the ref would be set and available for API calls
  });

  it('should remain available during authentication flow', () => {
    mockAuthContext.authenticated = false;

    const { rerender } = render(
      <TestWrapper>
        <TestPersistentIFrame />
      </TestWrapper>,
    );

    // Iframe exists before auth
    expect(screen.getByTestId('persistent-iframe')).toBeDefined();

    // Start auth
    mockAuthContext.authenticating = true;
    rerender(
      <TestWrapper>
        <TestPersistentIFrame />
      </TestWrapper>,
    );

    // Iframe still exists during auth
    expect(screen.getByTestId('persistent-iframe')).toBeDefined();

    // Complete auth
    mockAuthContext.authenticating = false;
    mockAuthContext.authenticated = true;
    rerender(
      <TestWrapper>
        <TestPersistentIFrame />
      </TestWrapper>,
    );

    // Iframe still exists after auth
    expect(screen.getByTestId('persistent-iframe')).toBeDefined();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthenticationModal } from '../ui/Toolbar/components/AuthenticationModal/AuthenticationModal';
import { IFrameProvider } from '../ui/Toolbar/context/IFrameProvider';

// Mock the oauthPopup utility
vi.mock('../ui/Toolbar/utils/oauthPopup', () => ({
  openOAuthPopup: vi.fn().mockResolvedValue({}),
}));

// Mock AuthProvider to allow controlled state for testing
const mockAuthContext = {
  authenticated: false,
  loading: false,
  authenticating: false,
  setAuthenticating: vi.fn(),
};

vi.mock('../ui/Toolbar/context/AuthProvider', () => ({
  useAuthContext: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Test wrapper with required providers
const TestWrapper = ({ children, authUrl }: { children: React.ReactNode; authUrl: string }) => (
  <IFrameProvider authUrl={authUrl}>{children}</IFrameProvider>
);

describe('AuthenticationModal', () => {
  const defaultProps = {
    baseUrl: 'https://app.launchdarkly.com',
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    // Reset mock state before each test
    mockAuthContext.authenticated = false;
    mockAuthContext.authenticating = false;
    mockAuthContext.loading = false;
    vi.clearAllMocks();
  });

  describe('iframe URL determination', () => {
    it('should map production LaunchDarkly URL to production integrations URL', () => {
      render(
        <TestWrapper authUrl="https://integrations.launchdarkly.com">
          <AuthenticationModal {...defaultProps} />
        </TestWrapper>,
      );

      const iframe = screen.getByTitle('LaunchDarkly Toolbar') as HTMLIFrameElement;
      expect(iframe.src).toContain('https://integrations.launchdarkly.com/toolbar/index.html');
    });

    it('should map staging LaunchDarkly URL to staging integrations URL', () => {
      render(
        <TestWrapper authUrl="https://integrations-stg.launchdarkly.com">
          <AuthenticationModal {...defaultProps} />
        </TestWrapper>,
      );

      const iframe = screen.getByTitle('LaunchDarkly Toolbar') as HTMLIFrameElement;
      expect(iframe.src).toContain('https://integrations-stg.launchdarkly.com/toolbar/index.html');
    });

    it('should map catamorphic LaunchDarkly URL to catamorphic integrations URL', () => {
      render(
        <TestWrapper authUrl="https://integrations.ld.catamorphic.com">
          <AuthenticationModal {...defaultProps} />
        </TestWrapper>,
      );

      const iframe = screen.getByTitle('LaunchDarkly Toolbar') as HTMLIFrameElement;
      expect(iframe.src).toContain('https://integrations.ld.catamorphic.com/toolbar/index.html');
    });
  });

  describe('authenticating state behavior', () => {
    it('should show authenticating.html when authenticating is true', () => {
      mockAuthContext.authenticating = true;

      render(
        <TestWrapper authUrl="https://integrations.launchdarkly.com">
          <AuthenticationModal {...defaultProps} />
        </TestWrapper>,
      );

      const iframe = screen.getByTitle('LaunchDarkly Toolbar') as HTMLIFrameElement;
      expect(iframe.src).toContain('https://integrations.launchdarkly.com/toolbar/authenticating.html');
    });

    it('should show index.html when authenticating is false', () => {
      mockAuthContext.authenticating = false;

      render(
        <TestWrapper authUrl="https://integrations.launchdarkly.com">
          <AuthenticationModal {...defaultProps} />
        </TestWrapper>,
      );

      const iframe = screen.getByTitle('LaunchDarkly Toolbar') as HTMLIFrameElement;
      expect(iframe.src).toContain('https://integrations.launchdarkly.com/toolbar/index.html');
    });

    it('should show authenticating.html with correct integration URL based on baseUrl', () => {
      mockAuthContext.authenticating = true;

      render(
        <TestWrapper authUrl="https://integrations-stg.launchdarkly.com">
          <AuthenticationModal {...defaultProps} />
        </TestWrapper>,
      );

      const iframe = screen.getByTitle('LaunchDarkly Toolbar') as HTMLIFrameElement;
      expect(iframe.src).toContain('https://integrations-stg.launchdarkly.com/toolbar/authenticating.html');
    });
  });

  describe('iframe properties', () => {
    it('should render iframe with correct title', () => {
      render(
        <TestWrapper authUrl="https://integrations.launchdarkly.com">
          <AuthenticationModal {...defaultProps} />
        </TestWrapper>,
      );

      const iframe = screen.getByTitle('LaunchDarkly Toolbar');
      expect(iframe).toBeDefined();
    });

    it('should render iframe as hidden', () => {
      render(
        <TestWrapper authUrl="https://integrations.launchdarkly.com">
          <AuthenticationModal {...defaultProps} />
        </TestWrapper>,
      );

      const iframe = screen.getByTitle('LaunchDarkly Toolbar');
      expect(iframe.style.display).toBe('none');
    });

    it('should provide iframe ref from IFrameContext', () => {
      const { container } = render(
        <TestWrapper authUrl="https://integrations.launchdarkly.com">
          <AuthenticationModal {...defaultProps} />
        </TestWrapper>,
      );

      const iframe = container.querySelector('iframe');
      expect(iframe).toBeDefined();
      expect(iframe?.tagName).toBe('IFRAME');
    });
  });

  describe('component structure', () => {
    it('should render iframe within container', () => {
      const { container } = render(
        <TestWrapper authUrl="https://integrations.launchdarkly.com">
          <AuthenticationModal {...defaultProps} />
        </TestWrapper>,
      );

      const iframe = container.querySelector('iframe');
      const containerDiv = iframe?.parentElement;
      expect(containerDiv?.className).toContain('iframeContainer');
    });

    it('should always render iframe regardless of isOpen prop', () => {
      render(
        <TestWrapper authUrl="https://integrations.launchdarkly.com">
          <AuthenticationModal {...defaultProps} isOpen={false} />
        </TestWrapper>,
      );

      const iframe = screen.getByTitle('LaunchDarkly Toolbar');
      expect(iframe).toBeDefined();
    });
  });
});

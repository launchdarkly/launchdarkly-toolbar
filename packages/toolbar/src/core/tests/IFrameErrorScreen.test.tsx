import { render, screen } from '@testing-library/react';
import { expect, describe, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';

vi.mock('../ui/Toolbar/context/state/PluginsProvider', () => ({
  usePlugins: vi.fn(),
}));

import { usePlugins } from '../ui/Toolbar/context/state/PluginsProvider';
import { IFrameErrorScreen } from '../ui/Toolbar/components/IFrameErrorScreen/IFrameErrorScreen';

describe('IFrameErrorScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePlugins as any).mockReturnValue({
      baseUrl: 'https://app.launchdarkly.com',
    });
  });

  describe('Content and Messaging', () => {
    it('displays the error title', () => {
      render(<IFrameErrorScreen />);

      expect(screen.getByText('Unable to connect to LaunchDarkly')).toBeInTheDocument();
    });

    it('displays the error description with whitelisting guidance', () => {
      render(<IFrameErrorScreen />);

      expect(
        screen.getByText(/typically caused by trying to load the toolbar from a domain that is not whitelisted/),
      ).toBeInTheDocument();
    });

    it('renders the error screen container with correct test id', () => {
      render(<IFrameErrorScreen />);

      expect(screen.getByTestId('iframe-error-screen')).toBeInTheDocument();
    });
  });

  describe('Whitelist Link', () => {
    it('constructs the link using baseUrl from context', () => {
      (usePlugins as any).mockReturnValue({
        baseUrl: 'https://app.launchdarkly.com',
      });

      render(<IFrameErrorScreen />);

      const link = screen.getByRole('link', { name: /here to whitelist your domain/i });
      expect(link).toHaveAttribute(
        'href',
        'https://app.launchdarkly.com/settings/integrations/launchdarkly-developer-toolbar/new',
      );
    });

    it('uses a custom baseUrl when configured', () => {
      (usePlugins as any).mockReturnValue({
        baseUrl: 'https://custom-ld-instance.example.com',
      });

      render(<IFrameErrorScreen />);

      const link = screen.getByRole('link', { name: /here to whitelist your domain/i });
      expect(link).toHaveAttribute(
        'href',
        'https://custom-ld-instance.example.com/settings/integrations/launchdarkly-developer-toolbar/new',
      );
    });

    it('opens the link in a new tab with security attributes', () => {
      render(<IFrameErrorScreen />);

      const link = screen.getByRole('link', { name: /here to whitelist your domain/i });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Interaction', () => {
    it('forwards onMouseDown to the logo for drag handling', () => {
      const mockOnMouseDown = vi.fn();
      render(<IFrameErrorScreen onMouseDown={mockOnMouseDown} />);

      const errorScreen = screen.getByTestId('iframe-error-screen');
      expect(errorScreen).toBeInTheDocument();
    });
  });
});

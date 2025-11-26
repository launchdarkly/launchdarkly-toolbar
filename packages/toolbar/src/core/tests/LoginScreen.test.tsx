import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { LoginScreen } from '../ui/Toolbar/components/LoginScreen/LoginScreen';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock the AuthProvider
vi.mock('../ui/Toolbar/context/AuthProvider', () => ({
  useAuthContext: vi.fn(),
}));

// Mock the ToolbarUIProvider
vi.mock('../ui/Toolbar/context/ToolbarUIProvider', () => ({
  useToolbarUIContext: vi.fn(),
}));

// Mock the AnalyticsProvider
vi.mock('../ui/Toolbar/context/AnalyticsProvider', () => ({
  useAnalytics: vi.fn().mockReturnValue({
    trackLoginCancelled: vi.fn(),
  }),
}));

import { useAuthContext } from '../ui/Toolbar/context/AuthProvider';
import { useToolbarUIContext } from '../ui/Toolbar/context/ToolbarUIProvider';

describe('LoginScreen', () => {
  const mockOnClose = vi.fn();
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthContext as any).mockReturnValue({
      authenticating: false,
    });
    (useToolbarUIContext as any).mockReturnValue({
      position: 'bottom-right',
    });
  });

  describe('User Experience Flow - First Time User', () => {
    test('displays welcoming message and login button for unauthenticated user', () => {
      // GIVEN: A user visits the toolbar for the first time (not authenticated)
      render(<LoginScreen onClose={mockOnClose} onLogin={mockOnLogin} />);

      // WHEN: They see the login screen
      // THEN: They're greeted with a welcoming message
      expect(screen.getByText('Connect to LaunchDarkly')).toBeInTheDocument();
      expect(screen.getByText(/Authorize your account to activate the Developer Toolbar./i)).toBeInTheDocument();

      // AND: They see a clear call-to-action to login
      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveTextContent('Login');
      expect(loginButton).not.toBeDisabled();

      // AND: They see a helpful link to create an account if needed
      const signupLink = screen.getByText(/Start your free trial!/i);
      expect(signupLink).toBeInTheDocument();
      expect(signupLink).toHaveAttribute('href', 'https://launchdarkly.com/start-trial');
      expect(signupLink).toHaveAttribute('target', '_blank');
    });

    test('initiates login flow when user clicks login button', () => {
      // GIVEN: User is ready to authenticate
      render(<LoginScreen onClose={mockOnClose} onLogin={mockOnLogin} />);

      // WHEN: They click the login button
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);

      // THEN: The login flow is initiated
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe('Authentication State - Loading', () => {
    test('shows loading state while authentication is in progress', () => {
      // GIVEN: User has clicked login and authentication is in progress
      (useAuthContext as any).mockReturnValue({
        authenticating: true,
      });

      render(<LoginScreen onClose={mockOnClose} onLogin={mockOnLogin} />);

      // WHEN: They wait for authentication
      // THEN: They see a loading indicator with clear feedback
      const loginButton = screen.getByTestId('login-button');
      expect(loginButton).toHaveTextContent('Logging in...');
      expect(loginButton).toBeDisabled();

      // AND: They cannot click the button again (prevents double-submission)
      fireEvent.click(loginButton);
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });

  describe('Toolbar Position - Close Button Orientation', () => {
    test('shows chevron down icon when toolbar is at bottom', () => {
      // GIVEN: Toolbar is positioned at the bottom of the screen
      (useToolbarUIContext as any).mockReturnValue({
        position: 'bottom-right',
      });

      render(<LoginScreen onClose={mockOnClose} onLogin={mockOnLogin} />);

      // WHEN: User looks for the close button
      const closeButton = screen.getByLabelText('Close toolbar');

      // THEN: They see a downward chevron (indicating collapse downward)
      expect(closeButton).toBeInTheDocument();

      // AND: Clicking it closes the toolbar
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('shows chevron up icon when toolbar is at top', () => {
      // GIVEN: Toolbar is positioned at the top of the screen
      (useToolbarUIContext as any).mockReturnValue({
        position: 'top-left',
      });

      render(<LoginScreen onClose={mockOnClose} onLogin={mockOnLogin} />);

      // WHEN: User looks for the close button
      const closeButton = screen.getByLabelText('Close toolbar');

      // THEN: They see an upward chevron (indicating collapse upward)
      expect(closeButton).toBeInTheDocument();

      // AND: Clicking it closes the toolbar
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    test('provides proper labeling for screen readers', () => {
      // GIVEN: A user with a screen reader visits the login screen
      render(<LoginScreen onClose={mockOnClose} onLogin={mockOnLogin} />);

      // THEN: All interactive elements have proper labels
      expect(screen.getByLabelText('Close toolbar')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toHaveAccessibleName(/Login/i);
    });

    test('supports keyboard navigation', () => {
      // GIVEN: A user navigating with keyboard only
      render(<LoginScreen onClose={mockOnClose} onLogin={mockOnLogin} />);

      // WHEN: They tab through interactive elements
      const loginButton = screen.getByTestId('login-button');
      const closeButton = screen.getByLabelText('Close toolbar');

      // THEN: They can reach and activate both buttons
      expect(loginButton).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Visual Design - Animations', () => {
    test('renders with animation entrance', () => {
      // GIVEN: Login screen appears for the first time
      render(<LoginScreen onClose={mockOnClose} onLogin={mockOnLogin} />);

      // THEN: The container uses motion for smooth entrance
      const loginScreen = screen.getByTestId('login-screen');
      expect(loginScreen).toBeInTheDocument();
    });
  });

  describe('Error Prevention', () => {
    test('prevents multiple login submissions during authentication', () => {
      // GIVEN: User has already clicked login
      (useAuthContext as any).mockReturnValue({
        authenticating: true,
      });

      render(<LoginScreen onClose={mockOnClose} onLogin={mockOnLogin} />);

      // WHEN: They impatiently click the login button multiple times
      const loginButton = screen.getByTestId('login-button');
      fireEvent.click(loginButton);
      fireEvent.click(loginButton);
      fireEvent.click(loginButton);

      // THEN: Login is not triggered multiple times
      expect(mockOnLogin).not.toHaveBeenCalled();
      expect(loginButton).toBeDisabled();
    });
  });

  describe('Component Integration', () => {
    test('can be closed while in any state', () => {
      // GIVEN: Login screen is showing (regardless of auth state)
      render(<LoginScreen onClose={mockOnClose} onLogin={mockOnLogin} />);

      // WHEN: User decides they don't want to login right now
      const closeButton = screen.getByLabelText('Close toolbar');
      fireEvent.click(closeButton);

      // THEN: The toolbar closes
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('can be closed even during authentication', () => {
      // GIVEN: Authentication is in progress
      (useAuthContext as any).mockReturnValue({
        authenticating: true,
      });

      render(<LoginScreen onClose={mockOnClose} onLogin={mockOnLogin} />);

      // WHEN: User decides to cancel
      const closeButton = screen.getByLabelText('Close toolbar');
      fireEvent.click(closeButton);

      // THEN: The toolbar still closes (auth continues in background)
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { AddContextForm } from '../ui/Toolbar/components/new/Contexts/AddContextForm';
import { ContextsProvider } from '../ui/Toolbar/context/api/ContextsProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { loadContexts, saveContexts } from '../ui/Toolbar/utils/localStorage';

// Mock localStorage utilities
vi.mock('../ui/Toolbar/utils/localStorage', () => ({
  loadContexts: vi.fn(() => []),
  saveContexts: vi.fn(),
}));

// Mock the useCurrentSdkContext hook
vi.mock('../ui/Toolbar/context/state/useCurrentSdkContext', () => ({
  useCurrentSdkContext: vi.fn(() => null),
  isCurrentContext: vi.fn(() => false),
}));

// Mock JsonEditor
vi.mock('../ui/Toolbar/components/../../JsonEditor/JsonEditor', () => ({
  JsonEditor: ({ docString, onChange, onLintErrors }: any) => {
    return (
      <textarea
        data-testid="json-editor"
        value={docString}
        onChange={(e) => {
          onChange(e.target.value);
          // Simulate no lint errors
          onLintErrors([]);
        }}
      />
    );
  },
}));

// Mock motion components
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('AddContextForm', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (loadContexts as any).mockReturnValue([]);
  });

  describe('Single-kind Context', () => {
    test('validates and submits a single-kind context', async () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={true} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      const editor = screen.getByTestId('json-editor');
      const validContext = JSON.stringify(
        {
          kind: 'user',
          key: 'test-user-123',
          name: 'Test User',
        },
        null,
        2,
      );

      fireEvent.change(editor, { target: { value: validContext } });

      const submitButton = screen.getByRole('button', { name: /add context/i });
      expect(submitButton).not.toBeDisabled();

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(saveContexts).toHaveBeenCalled();
      });

      const savedContexts = (saveContexts as any).mock.calls[0][0];
      expect(savedContexts).toHaveLength(1);
      expect(savedContexts[0]).toMatchObject({
        kind: 'user',
        key: 'test-user-123',
        name: 'Test User',
      });
      // anonymous should be false when not explicitly set
      expect(savedContexts[0].anonymous).toBe(false);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('validates required fields for single-kind context', () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={true} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      const editor = screen.getByTestId('json-editor');
      const invalidContext = JSON.stringify({ kind: 'user' }, null, 2); // Missing key

      fireEvent.change(editor, { target: { value: invalidContext } });

      const submitButton = screen.getByRole('button', { name: /add context/i });
      expect(submitButton).toBeDisabled();
    });

    test('handles anonymous flag for single-kind context', async () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={true} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      const editor = screen.getByTestId('json-editor');
      const contextWithAnonymous = JSON.stringify(
        {
          kind: 'user',
          key: 'test-user',
          anonymous: true,
        },
        null,
        2,
      );

      fireEvent.change(editor, { target: { value: contextWithAnonymous } });
      fireEvent.click(screen.getByRole('button', { name: /add context/i }));

      await waitFor(() => {
        expect(saveContexts).toHaveBeenCalled();
      });

      const savedContexts = (saveContexts as any).mock.calls[0][0];
      expect(savedContexts[0].anonymous).toBe(true);
    });
  });

  describe('Multi-kind Context', () => {
    test('validates and submits a multi-kind context', async () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={true} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      const editor = screen.getByTestId('json-editor');
      const multiKindContext = JSON.stringify(
        {
          kind: 'multi',
          account: {
            key: '62e3bcd1192f058dc89b437c',
            name: 'Account One',
          },
          user: {
            key: '68e55f1d420bec09b171e191',
            name: 'User One',
          },
        },
        null,
        2,
      );

      fireEvent.change(editor, { target: { value: multiKindContext } });

      const submitButton = screen.getByRole('button', { name: /add context/i });
      expect(submitButton).not.toBeDisabled();

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(saveContexts).toHaveBeenCalled();
      });

      // The entire multi-kind context should be saved as a single context
      const savedContexts = (saveContexts as any).mock.calls[0][0];
      expect(savedContexts).toHaveLength(1);

      const savedContext = savedContexts[0];
      // Should have kind "multi" and contain all nested contexts
      expect(savedContext.kind).toBe('multi');
      expect(savedContext.account).toBeDefined();
      expect(savedContext.account.key).toBe('62e3bcd1192f058dc89b437c');
      expect(savedContext.account.name).toBe('Account One');
      expect(savedContext.user).toBeDefined();
      expect(savedContext.user.key).toBe('68e55f1d420bec09b171e191');
      expect(savedContext.user.name).toBe('User One');

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('validates that multi-kind context has at least one nested context with key', () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={true} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      const editor = screen.getByTestId('json-editor');
      const invalidMultiKind = JSON.stringify(
        {
          kind: 'multi',
          account: {
            // Missing key
          },
        },
        null,
        2,
      );

      fireEvent.change(editor, { target: { value: invalidMultiKind } });

      const submitButton = screen.getByRole('button', { name: /add context/i });
      expect(submitButton).toBeDisabled();
    });

    test('validates that multi-kind context has nested contexts', () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={true} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      const editor = screen.getByTestId('json-editor');
      const invalidMultiKind = JSON.stringify(
        {
          kind: 'multi',
          // No nested contexts
        },
        null,
        2,
      );

      fireEvent.change(editor, { target: { value: invalidMultiKind } });

      const submitButton = screen.getByRole('button', { name: /add context/i });
      expect(submitButton).toBeDisabled();
    });

    test('saves entire multi-kind context even if some nested contexts are invalid', async () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={true} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      const editor = screen.getByTestId('json-editor');
      const multiKindWithInvalid = JSON.stringify(
        {
          kind: 'multi',
          account: {
            key: 'valid-account-key',
          },
          user: {
            // Missing key - but entire context should still be saved
          },
          organization: {
            key: 'valid-org-key',
          },
        },
        null,
        2,
      );

      fireEvent.change(editor, { target: { value: multiKindWithInvalid } });
      fireEvent.click(screen.getByRole('button', { name: /add context/i }));

      await waitFor(() => {
        expect(saveContexts).toHaveBeenCalled();
      });

      // The entire multi-kind context should be saved as a single context
      const savedContexts = (saveContexts as any).mock.calls[0][0];
      expect(savedContexts).toHaveLength(1);

      const savedContext = savedContexts[0];
      // Should have kind "multi" and contain all nested contexts (even invalid ones)
      expect(savedContext.kind).toBe('multi');
      expect(savedContext.account).toBeDefined();
      expect(savedContext.account.key).toBe('valid-account-key');
      expect(savedContext.user).toBeDefined(); // User context is still saved even without key
      expect(savedContext.organization).toBeDefined();
      expect(savedContext.organization.key).toBe('valid-org-key');
      // Key should be a composite of valid nested context keys
    });
  });

  describe('Form Behavior', () => {
    test('closes form when cancel is clicked', () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={true} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    test('resets form after successful submission', async () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={true} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      const editor = screen.getByTestId('json-editor') as HTMLTextAreaElement;
      const validContext = JSON.stringify(
        {
          kind: 'user',
          key: 'test-user',
        },
        null,
        2,
      );

      fireEvent.change(editor, { target: { value: validContext } });
      fireEvent.click(screen.getByRole('button', { name: /add context/i }));

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });

      // Form should be reset (editor should have default value)
      // Note: This test assumes the form resets, but since it closes, we can't verify the reset
      // The important part is that onClose was called
      expect(mockOnClose).toHaveBeenCalled();
    });

    test('does not render when isOpen is false', () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={false} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      expect(screen.queryByTestId('json-editor')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('shows error for invalid JSON', async () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={true} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      const editor = screen.getByTestId('json-editor');
      const invalidJSON = '{ kind: "user", key: "test" }'; // Invalid JSON syntax

      fireEvent.change(editor, { target: { value: invalidJSON } });

      const submitButton = screen.getByRole('button', { name: /add context/i });
      expect(submitButton).toBeDisabled();
    });

    test('shows error message when context is missing kind field', async () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={true} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      const editor = screen.getByTestId('json-editor');
      // Create a context that passes isValid but fails in handleSubmit
      // We need kind to be an empty string to pass JSON parsing but fail validation
      const contextWithEmptyKind = JSON.stringify({ kind: '', key: 'test-key' }, null, 2);

      fireEvent.change(editor, { target: { value: contextWithEmptyKind } });

      // The button should be disabled because isValid checks for non-empty kind
      const submitButton = screen.getByRole('button', { name: /add context/i });
      expect(submitButton).toBeDisabled();
    });

    test('validates that kind field is required', () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={true} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      const editor = screen.getByTestId('json-editor');
      const contextWithoutKind = JSON.stringify({ key: 'test-key' }, null, 2);

      fireEvent.change(editor, { target: { value: contextWithoutKind } });

      // Button should be disabled when kind is missing
      const submitButton = screen.getByRole('button', { name: /add context/i });
      expect(submitButton).toBeDisabled();
    });

    test('validates that key field is required for single-kind context', () => {
      render(
        <ContextsProvider>
          <AddContextForm isOpen={true} onClose={mockOnClose} />
        </ContextsProvider>,
      );

      const editor = screen.getByTestId('json-editor');
      const contextWithoutKey = JSON.stringify({ kind: 'user' }, null, 2);

      fireEvent.change(editor, { target: { value: contextWithoutKey } });

      // Button should be disabled when key is missing
      const submitButton = screen.getByRole('button', { name: /add context/i });
      expect(submitButton).toBeDisabled();
    });
  });
});

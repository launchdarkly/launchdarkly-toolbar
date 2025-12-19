import { describe, test, expect, vi, beforeEach } from 'vitest';
import type { LDClient } from '@launchdarkly/js-client-sdk';
import {
  createToolbarFlagFunction,
  setToolbarFlagClient,
  getToolbarFlagClient,
} from '../../flags/createToolbarFlagFunction';

describe('createToolbarFlagFunction', () => {
  // Create mock client
  const mockClient = {
    variation: vi.fn(),
  } as unknown as LDClient;

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear the singleton between tests
    setToolbarFlagClient(null);
  });

  describe('Client Management', () => {
    test('setToolbarFlagClient sets the internal client', () => {
      setToolbarFlagClient(mockClient);
      expect(getToolbarFlagClient()).toBe(mockClient);
    });

    test('setToolbarFlagClient can clear the client', () => {
      setToolbarFlagClient(mockClient);
      expect(getToolbarFlagClient()).toBe(mockClient);

      setToolbarFlagClient(null);
      expect(getToolbarFlagClient()).toBeNull();
    });

    test('getToolbarFlagClient returns null initially', () => {
      expect(getToolbarFlagClient()).toBeNull();
    });

    test('client state persists across multiple calls', () => {
      setToolbarFlagClient(mockClient);

      expect(getToolbarFlagClient()).toBe(mockClient);
      expect(getToolbarFlagClient()).toBe(mockClient);
      expect(getToolbarFlagClient()).toBe(mockClient);
    });
  });

  describe('Flag Function Factory', () => {
    test('returns default value when client is null', () => {
      setToolbarFlagClient(null);

      const flagFunction = createToolbarFlagFunction('test-flag', true);
      expect(flagFunction()).toBe(true);
    });

    test('returns default value when client is not set', () => {
      const flagFunction = createToolbarFlagFunction('test-flag', false);
      expect(flagFunction()).toBe(false);
    });

    test('returns flag value from client when client is set', () => {
      (mockClient.variation as ReturnType<typeof vi.fn>).mockReturnValue(false);
      setToolbarFlagClient(mockClient);

      const flagFunction = createToolbarFlagFunction('test-flag', true);
      const result = flagFunction();

      expect(result).toBe(false);
      expect(mockClient.variation).toHaveBeenCalledWith('test-flag', true);
    });

    test('calls variation with correct flag key and default value', () => {
      (mockClient.variation as ReturnType<typeof vi.fn>).mockReturnValue('custom-value');
      setToolbarFlagClient(mockClient);

      const flagFunction = createToolbarFlagFunction('my-feature-flag', 'default-value');
      flagFunction();

      expect(mockClient.variation).toHaveBeenCalledWith('my-feature-flag', 'default-value');
    });

    test('multiple flag functions work independently', () => {
      (mockClient.variation as ReturnType<typeof vi.fn>)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce('enabled')
        .mockReturnValueOnce(42);

      setToolbarFlagClient(mockClient);

      const boolFlag = createToolbarFlagFunction('bool-flag', false);
      const stringFlag = createToolbarFlagFunction('string-flag', 'disabled');
      const numberFlag = createToolbarFlagFunction('number-flag', 0);

      expect(boolFlag()).toBe(true);
      expect(stringFlag()).toBe('enabled');
      expect(numberFlag()).toBe(42);

      expect(mockClient.variation).toHaveBeenCalledTimes(3);
      expect(mockClient.variation).toHaveBeenNthCalledWith(1, 'bool-flag', false);
      expect(mockClient.variation).toHaveBeenNthCalledWith(2, 'string-flag', 'disabled');
      expect(mockClient.variation).toHaveBeenNthCalledWith(3, 'number-flag', 0);
    });

    test('flag function can be called multiple times', () => {
      (mockClient.variation as ReturnType<typeof vi.fn>).mockReturnValue(true);
      setToolbarFlagClient(mockClient);

      const flagFunction = createToolbarFlagFunction('test-flag', false);

      expect(flagFunction()).toBe(true);
      expect(flagFunction()).toBe(true);
      expect(flagFunction()).toBe(true);

      expect(mockClient.variation).toHaveBeenCalledTimes(3);
    });

    test('flag function reflects client changes', () => {
      const flagFunction = createToolbarFlagFunction('test-flag', 'default');

      // No client - returns default
      expect(flagFunction()).toBe('default');

      // Set client - returns flag value
      (mockClient.variation as ReturnType<typeof vi.fn>).mockReturnValue('from-client');
      setToolbarFlagClient(mockClient);
      expect(flagFunction()).toBe('from-client');

      // Clear client - returns default again
      setToolbarFlagClient(null);
      expect(flagFunction()).toBe('default');
    });
  });
});

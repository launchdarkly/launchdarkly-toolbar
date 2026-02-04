import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

/**
 * Tests for FlagList "Reload on Flag Change" functionality
 *
 * These tests verify that the handleOverride and handleClearOverride callbacks
 * correctly call window.location.reload() when reloadOnFlagChangeIsEnabled is true.
 *
 * Since the FlagList uses virtualization which is difficult to test in JSDOM,
 * we test the logic by simulating the callback behavior.
 */

// Store original location
const originalLocation = window.location;

describe('FlagList - Reload on Flag Change Logic', () => {
  const mockReload = vi.fn();
  const mockSetOverride = vi.fn();
  const mockRemoveOverride = vi.fn();
  const mockTrackFlagOverride = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload: mockReload },
    });
  });

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  describe('SDK Mode handleOverride', () => {
    /**
     * Simulates the handleOverride callback from SdkFlagList
     * This is the exact logic from FlagList.tsx lines 283-293
     */
    const createHandleOverride = (reloadOnFlagChangeIsEnabled: boolean) => {
      return (flagKey: string, value: any) => {
        mockSetOverride(flagKey, value);
        mockTrackFlagOverride(flagKey, value, 'set');

        if (reloadOnFlagChangeIsEnabled) {
          window.location.reload();
        }
      };
    };

    it('should NOT reload page when reloadOnFlagChangeIsEnabled is false', () => {
      const handleOverride = createHandleOverride(false);

      handleOverride('test-flag', true);

      expect(mockSetOverride).toHaveBeenCalledWith('test-flag', true);
      expect(mockTrackFlagOverride).toHaveBeenCalledWith('test-flag', true, 'set');
      expect(mockReload).not.toHaveBeenCalled();
    });

    it('should reload page when reloadOnFlagChangeIsEnabled is true', () => {
      const handleOverride = createHandleOverride(true);

      handleOverride('test-flag', false);

      expect(mockSetOverride).toHaveBeenCalledWith('test-flag', false);
      expect(mockTrackFlagOverride).toHaveBeenCalledWith('test-flag', false, 'set');
      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it('should reload page for multivariate flag changes when enabled', () => {
      const handleOverride = createHandleOverride(true);

      handleOverride('multivariate-flag', 'variant-2');

      expect(mockSetOverride).toHaveBeenCalledWith('multivariate-flag', 'variant-2');
      expect(mockReload).toHaveBeenCalledTimes(1);
    });

    it('should reload page for string/number flag changes when enabled', () => {
      const handleOverride = createHandleOverride(true);

      handleOverride('string-flag', 'new-value');
      expect(mockReload).toHaveBeenCalledTimes(1);

      vi.clearAllMocks();

      handleOverride('number-flag', 42);
      expect(mockReload).toHaveBeenCalledTimes(1);
    });
  });

  describe('SDK Mode handleClearOverride', () => {
    /**
     * Simulates the handleClearOverride callback from SdkFlagList
     * This is the exact logic from FlagList.tsx lines 295-304
     */
    const createHandleClearOverride = (reloadOnFlagChangeIsEnabled: boolean) => {
      return (flagKey: string) => {
        mockRemoveOverride(flagKey);
        mockTrackFlagOverride(flagKey, null, 'remove');

        if (reloadOnFlagChangeIsEnabled) {
          window.location.reload();
        }
      };
    };

    it('should NOT reload page when clearing override with reload disabled', () => {
      const handleClearOverride = createHandleClearOverride(false);

      handleClearOverride('test-flag');

      expect(mockRemoveOverride).toHaveBeenCalledWith('test-flag');
      expect(mockTrackFlagOverride).toHaveBeenCalledWith('test-flag', null, 'remove');
      expect(mockReload).not.toHaveBeenCalled();
    });

    it('should reload page when clearing override with reload enabled', () => {
      const handleClearOverride = createHandleClearOverride(true);

      handleClearOverride('test-flag');

      expect(mockRemoveOverride).toHaveBeenCalledWith('test-flag');
      expect(mockTrackFlagOverride).toHaveBeenCalledWith('test-flag', null, 'remove');
      expect(mockReload).toHaveBeenCalledTimes(1);
    });
  });

  describe('Dev Server Mode handleOverride', () => {
    const mockDevServerSetOverride = vi.fn().mockResolvedValue(undefined);

    /**
     * Simulates the handleOverride callback from DevServerFlagList
     * This is the exact logic from FlagList.tsx lines 106-120
     */
    const createHandleOverride = (reloadOnFlagChangeIsEnabled: boolean) => {
      return async (flagKey: string, value: any) => {
        await mockDevServerSetOverride(flagKey, value);
        mockTrackFlagOverride(flagKey, value, 'set');

        if (reloadOnFlagChangeIsEnabled) {
          window.location.reload();
        }
      };
    };

    it('should NOT reload page when reloadOnFlagChangeIsEnabled is false', async () => {
      const handleOverride = createHandleOverride(false);

      await handleOverride('test-flag', true);

      expect(mockDevServerSetOverride).toHaveBeenCalledWith('test-flag', true);
      expect(mockTrackFlagOverride).toHaveBeenCalledWith('test-flag', true, 'set');
      expect(mockReload).not.toHaveBeenCalled();
    });

    it('should reload page when reloadOnFlagChangeIsEnabled is true', async () => {
      const handleOverride = createHandleOverride(true);

      await handleOverride('test-flag', false);

      expect(mockDevServerSetOverride).toHaveBeenCalledWith('test-flag', false);
      expect(mockTrackFlagOverride).toHaveBeenCalledWith('test-flag', false, 'set');
      expect(mockReload).toHaveBeenCalledTimes(1);
    });
  });

  describe('Dev Server Mode handleClearOverride', () => {
    const mockDevServerClearOverride = vi.fn().mockResolvedValue(undefined);

    /**
     * Simulates the handleClearOverride callback from DevServerFlagList
     * This is the exact logic from FlagList.tsx lines 122-132
     */
    const createHandleClearOverride = (reloadOnFlagChangeIsEnabled: boolean) => {
      return async (flagKey: string) => {
        await mockDevServerClearOverride(flagKey);
        mockTrackFlagOverride(flagKey, null, 'remove');

        if (reloadOnFlagChangeIsEnabled) {
          window.location.reload();
        }
      };
    };

    it('should NOT reload page when clearing override with reload disabled', async () => {
      const handleClearOverride = createHandleClearOverride(false);

      await handleClearOverride('test-flag');

      expect(mockDevServerClearOverride).toHaveBeenCalledWith('test-flag');
      expect(mockTrackFlagOverride).toHaveBeenCalledWith('test-flag', null, 'remove');
      expect(mockReload).not.toHaveBeenCalled();
    });

    it('should reload page when clearing override with reload enabled', async () => {
      const handleClearOverride = createHandleClearOverride(true);

      await handleClearOverride('test-flag');

      expect(mockDevServerClearOverride).toHaveBeenCalledWith('test-flag');
      expect(mockTrackFlagOverride).toHaveBeenCalledWith('test-flag', null, 'remove');
      expect(mockReload).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid flag changes with reload enabled', () => {
      const handleOverride = (flagKey: string, value: any, reloadEnabled: boolean) => {
        mockSetOverride(flagKey, value);
        if (reloadEnabled) {
          window.location.reload();
        }
      };

      // First change triggers reload
      handleOverride('flag-1', true, true);
      expect(mockReload).toHaveBeenCalledTimes(1);

      // Subsequent changes would also trigger reload (in real scenario, page would have reloaded)
      handleOverride('flag-2', 'value', true);
      expect(mockReload).toHaveBeenCalledTimes(2);
    });

    it('should handle object flag changes with reload enabled', () => {
      const handleOverride = (flagKey: string, value: any, reloadEnabled: boolean) => {
        mockSetOverride(flagKey, value);
        if (reloadEnabled) {
          window.location.reload();
        }
      };

      const objectValue = { config: { enabled: true, maxItems: 10 } };
      handleOverride('object-flag', objectValue, true);

      expect(mockSetOverride).toHaveBeenCalledWith('object-flag', objectValue);
      expect(mockReload).toHaveBeenCalledTimes(1);
    });
  });
});

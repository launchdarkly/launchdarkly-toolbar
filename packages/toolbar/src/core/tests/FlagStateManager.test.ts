import { describe, test, expect, vi, beforeEach } from 'vitest';
import { FlagStateManager } from '../services/FlagStateManager';
import { DevServerClient } from '../services/DevServerClient';
import { ApiFlag } from '../ui/Toolbar/types/ldApi';

// Mock DevServerClient
vi.mock('../services/DevServerClient');

describe('FlagStateManager', () => {
  let mockDevServerClient: any;
  let flagStateManager: FlagStateManager;

  beforeEach(() => {
    mockDevServerClient = {
      getProjectData: vi.fn(),
      setOverride: vi.fn(),
      clearOverride: vi.fn(),
    };

    flagStateManager = new FlagStateManager(mockDevServerClient);
  });

  describe('getEnhancedFlags', () => {
    test('uses API flag names when available', async () => {
      // GIVEN: Dev server has flags and API provides proper names
      const apiFlags: ApiFlag[] = [
        { key: 'feature-flag-1', name: 'Feature Flag One', kind: 'boolean' } as ApiFlag,
        { key: 'feature-flag-2', name: 'Feature Flag Two', kind: 'string' } as ApiFlag,
      ];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'feature-flag-1': { value: true },
          'feature-flag-2': { value: 'test' },
        },
        overrides: {},
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      // WHEN: Getting enhanced flags
      const result = await flagStateManager.getEnhancedFlags();

      // THEN: Flags use names from API
      expect(result['feature-flag-1'].name).toBe('Feature Flag One');
      expect(result['feature-flag-2'].name).toBe('Feature Flag Two');
    });

    test('formats flag keys as names when API flags are empty', async () => {
      // GIVEN: Dev server has flags but API response is empty
      const apiFlags: ApiFlag[] = [];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'my-awesome-flag': { value: true },
          'another-test-flag': { value: 'hello' },
        },
        overrides: {},
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      // WHEN: Getting enhanced flags
      const result = await flagStateManager.getEnhancedFlags();

      // THEN: Flag keys are formatted as display names
      expect(result['my-awesome-flag']).toBeDefined();
      expect(result['my-awesome-flag'].name).toBe('My Awesome Flag');
      expect(result['another-test-flag']).toBeDefined();
      expect(result['another-test-flag'].name).toBe('Another Test Flag');
    });

    test('displays all flags from dev server even when API has subset', async () => {
      // GIVEN: Dev server has more flags than API response
      const apiFlags: ApiFlag[] = [
        { key: 'flag-1', name: 'Flag One', kind: 'boolean' } as ApiFlag,
        // API only has flag-1, but dev server has flag-1, flag-2, and flag-3
      ];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'flag-1': { value: true },
          'flag-2': { value: 'test' },
          'flag-3': { value: 42 },
        },
        overrides: {},
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });
      // WHEN: Getting enhanced flags
      const result = await flagStateManager.getEnhancedFlags();

      // THEN: All flags from dev server are included
      expect(Object.keys(result)).toHaveLength(3);
      expect(result['flag-1'].name).toBe('Flag One'); // From API
      expect(result['flag-2'].name).toBe('Flag 2'); // Formatted
      expect(result['flag-3'].name).toBe('Flag 3'); // Formatted
    });

    test('correctly identifies overridden flags', async () => {
      // GIVEN: Dev server has flags with some overrides
      const apiFlags: ApiFlag[] = [
        { key: 'flag-1', name: 'Flag One', kind: 'boolean' } as ApiFlag,
        { key: 'flag-2', name: 'Flag Two', kind: 'boolean' } as ApiFlag,
      ];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'flag-1': { value: true },
          'flag-2': { value: false },
        },
        overrides: {
          'flag-1': { value: false }, // flag-1 is overridden
        },
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      // WHEN: Getting enhanced flags
      const result = await flagStateManager.getEnhancedFlags();

      // THEN: Override status is correctly identified
      expect(result['flag-1'].isOverridden).toBe(true);
      expect(result['flag-2'].isOverridden).toBe(false);
    });

    test('uses override value when flag is overridden', async () => {
      // GIVEN: Dev server has a flag with an override
      const apiFlags: ApiFlag[] = [{ key: 'test-flag', name: 'Test Flag', kind: 'boolean' } as ApiFlag];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'test-flag': { value: true }, // Original value
        },
        overrides: {
          'test-flag': { value: false }, // Override value
        },
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      // WHEN: Getting enhanced flags
      const result = await flagStateManager.getEnhancedFlags();

      // THEN: Current value reflects override, original value preserved
      expect(result['test-flag'].currentValue).toBe(false); // Override
      expect(result['test-flag'].originalValue).toBe(true); // Original
      expect(result['test-flag'].isOverridden).toBe(true);
    });

    test('correctly determines flag types from API kind', async () => {
      // GIVEN: API provides flag kinds
      const apiFlags: ApiFlag[] = [
        { key: 'bool-flag', name: 'Bool Flag', kind: 'boolean' } as ApiFlag,
        { key: 'string-flag', name: 'String Flag', kind: 'string' } as ApiFlag,
        { key: 'number-flag', name: 'Number Flag', kind: 'number' } as ApiFlag,
      ];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'bool-flag': { value: true },
          'string-flag': { value: 'test' },
          'number-flag': { value: 123 },
        },
        overrides: {},
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      // WHEN: Getting enhanced flags
      const result = await flagStateManager.getEnhancedFlags();

      // THEN: Types are correctly determined from API
      expect(result['bool-flag'].type).toBe('boolean');
      expect(result['string-flag'].type).toBe('string');
      expect(result['number-flag'].type).toBe('number');
    });

    test('infers flag type from value when API kind is not available', async () => {
      // GIVEN: Dev server has flags but no API data
      const apiFlags: ApiFlag[] = [];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'bool-flag': { value: true },
          'string-flag': { value: 'hello' },
          'number-flag': { value: 42 },
          'object-flag': { value: { key: 'value' } },
        },
        overrides: {},
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      // WHEN: Getting enhanced flags
      const result = await flagStateManager.getEnhancedFlags();

      // THEN: Types are inferred from values
      expect(result['bool-flag'].type).toBe('boolean');
      expect(result['string-flag'].type).toBe('string');
      expect(result['number-flag'].type).toBe('number');
      expect(result['object-flag'].type).toBe('object');
    });

    test('handles available variations correctly', async () => {
      // GIVEN: Dev server provides available variations
      const apiFlags: ApiFlag[] = [
        { key: 'multivariate-flag', name: 'Multivariate Flag', kind: 'multivariate' } as ApiFlag,
      ];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'multivariate-flag': { value: 'option-a' },
        },
        overrides: {},
        availableVariations: {
          'multivariate-flag': [
            { value: 'option-a', name: 'Option A' },
            { value: 'option-b', name: 'Option B' },
            { value: 'option-c', name: 'Option C' },
          ],
        },
        sourceEnvironmentKey: 'production',
      });

      // WHEN: Getting enhanced flags
      const result = await flagStateManager.getEnhancedFlags();

      // THEN: Available variations are included
      expect(result['multivariate-flag'].availableVariations).toHaveLength(3);
      expect(result['multivariate-flag'].availableVariations).toEqual([
        { value: 'option-a', name: 'Option A' },
        { value: 'option-b', name: 'Option B' },
        { value: 'option-c', name: 'Option C' },
      ]);
    });

    test('sets enabled status based on flag value', async () => {
      // GIVEN: Flags with different value states
      const apiFlags: ApiFlag[] = [];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'enabled-flag': { value: true },
          'disabled-flag': { value: null },
          'undefined-flag': { value: undefined },
        },
        overrides: {},
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      // WHEN: Getting enhanced flags
      const result = await flagStateManager.getEnhancedFlags();

      // THEN: Enabled status is correctly set
      expect(result['enabled-flag'].enabled).toBe(true);
      expect(result['disabled-flag'].enabled).toBe(false);
      expect(result['undefined-flag'].enabled).toBe(false);
    });

    test('includes source environment key in enhanced flags', async () => {
      // GIVEN: Dev server provides source environment
      const apiFlags: ApiFlag[] = [{ key: 'test-flag', name: 'Test Flag', kind: 'boolean' } as ApiFlag];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'test-flag': { value: true },
        },
        overrides: {},
        availableVariations: {},
        sourceEnvironmentKey: 'staging',
      });

      // WHEN: Getting enhanced flags
      const result = await flagStateManager.getEnhancedFlags();

      // THEN: Source environment is included
      expect(result['test-flag'].sourceEnvironment).toBe('staging');
    });
  });

  describe('subscribe and notify', () => {
    test('notifies listeners when flags change', async () => {
      // GIVEN: Subscriber listening for changes
      const listener = vi.fn();
      const apiFlags: ApiFlag[] = [{ key: 'test-flag', name: 'Test Flag', kind: 'boolean' } as ApiFlag];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'test-flag': { value: true },
        },
        overrides: {},
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      // Initialize with first fetch
      await flagStateManager.getEnhancedFlags();

      // Subscribe to changes
      flagStateManager.subscribe(listener);

      // WHEN: Override is set (which triggers notification)
      await flagStateManager.setOverride('test-flag', false);

      // THEN: Listener was called
      expect(listener).toHaveBeenCalled();
    });

    test('returns unsubscribe function that works correctly', async () => {
      // GIVEN: Subscriber with unsubscribe function
      const listener = vi.fn();
      const apiFlags: ApiFlag[] = [{ key: 'test-flag', name: 'Test Flag', kind: 'boolean' } as ApiFlag];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'test-flag': { value: true },
        },
        overrides: {},
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      await flagStateManager.getEnhancedFlags();
      const unsubscribe = flagStateManager.subscribe(listener);

      // WHEN: Unsubscribing and then triggering change
      unsubscribe();
      await flagStateManager.setOverride('test-flag', false);

      // THEN: Listener was not called after unsubscribing
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('setOverride and clearOverride', () => {
    test('setOverride calls devServerClient and notifies listeners', async () => {
      // GIVEN: Initialized flag state manager
      const apiFlags: ApiFlag[] = [{ key: 'test-flag', name: 'Test Flag', kind: 'boolean' } as ApiFlag];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'test-flag': { value: true },
        },
        overrides: {},
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      await flagStateManager.getEnhancedFlags();

      // WHEN: Setting an override
      await flagStateManager.setOverride('test-flag', false);

      // THEN: DevServerClient was called
      expect(mockDevServerClient.setOverride).toHaveBeenCalledWith('test-flag', false);
    });

    test('clearOverride calls devServerClient and notifies listeners', async () => {
      // GIVEN: Initialized flag state manager
      const apiFlags: ApiFlag[] = [{ key: 'test-flag', name: 'Test Flag', kind: 'boolean' } as ApiFlag];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'test-flag': { value: true },
        },
        overrides: {},
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      await flagStateManager.getEnhancedFlags();

      // WHEN: Clearing an override
      await flagStateManager.clearOverride('test-flag');

      // THEN: DevServerClient was called
      expect(mockDevServerClient.clearOverride).toHaveBeenCalledWith('test-flag');
    });
  });

  describe('edge cases', () => {
    test('handles empty dev server flags state', async () => {
      // GIVEN: Dev server returns empty flags state
      const apiFlags: ApiFlag[] = [];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {},
        overrides: {},
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      // WHEN: Getting enhanced flags
      const result = await flagStateManager.getEnhancedFlags();

      // THEN: Result is empty object
      expect(result).toEqual({});
    });

    test('handles flag in dev server but not in flag state', async () => {
      // GIVEN: Override exists but flag doesn't exist in flagsState
      const apiFlags: ApiFlag[] = [];
      flagStateManager.setApiFlags(apiFlags);

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'existing-flag': { value: true },
        },
        overrides: {
          'non-existent-flag': { value: false },
        },
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      // WHEN: Getting enhanced flags
      const result = await flagStateManager.getEnhancedFlags();

      // THEN: Only existing flag is included
      expect(Object.keys(result)).toHaveLength(1);
      expect(result['existing-flag']).toBeDefined();
      expect(result['non-existent-flag']).toBeUndefined();
    });

    test('handles complex object flag values', async () => {
      // GIVEN: Flag with complex object value
      const apiFlags: ApiFlag[] = [];
      flagStateManager.setApiFlags(apiFlags);

      const complexObject = {
        nested: {
          array: [1, 2, 3],
          boolean: true,
          string: 'value',
        },
      };

      mockDevServerClient.getProjectData.mockResolvedValue({
        flagsState: {
          'complex-flag': { value: complexObject },
        },
        overrides: {},
        availableVariations: {},
        sourceEnvironmentKey: 'production',
      });

      // WHEN: Getting enhanced flags
      const result = await flagStateManager.getEnhancedFlags();

      // THEN: Complex object is preserved
      expect(result['complex-flag'].currentValue).toEqual(complexObject);
      expect(result['complex-flag'].type).toBe('object');
    });
  });
});

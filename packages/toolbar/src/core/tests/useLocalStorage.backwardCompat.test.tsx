/**
 * Backward Compatibility Tests for useLocalStorage
 *
 * These tests verify that data stored by the old localStorage utility functions
 * can be read correctly by the new useLocalStorage hook. This ensures users
 * upgrading from older versions won't lose their saved preferences.
 */
import { renderHook, act } from '@testing-library/react';
import { expect, test, describe, beforeEach } from 'vitest';
import { useLocalStorage } from '../ui/Toolbar/hooks/useLocalStorage';
import { TOOLBAR_STORAGE_KEYS } from '../ui/Toolbar/utils/localStorage';

describe('useLocalStorage - Backward Compatibility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Starred Flags (JSON array format)', () => {
    test('reads data written by old saveStarredFlags format', () => {
      // Old format: JSON.stringify(Array.from(starredFlags))
      const oldFormatData = JSON.stringify(['flag-1', 'flag-2', 'flag-3']);
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS, oldFormatData);

      const { result } = renderHook(() =>
        useLocalStorage<string[]>(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS, []),
      );

      expect(result.current[0]).toEqual(['flag-1', 'flag-2', 'flag-3']);
    });

    test('writes data in same format as old saveStarredFlags', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string[]>(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS, []),
      );

      act(() => {
        result.current[1](['new-flag-1', 'new-flag-2']);
      });

      // Verify format matches old: JSON.stringify(array)
      const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS);
      expect(stored).toBe(JSON.stringify(['new-flag-1', 'new-flag-2']));
    });
  });

  describe('Environment (raw string format)', () => {
    test('reads data written by old setEnvironment format', () => {
      // Old format: localStorage.setItem(STORAGE_KEY, newEnvironment) - raw string
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.ENVIRONMENT, 'staging');

      const { result } = renderHook(() =>
        useLocalStorage(TOOLBAR_STORAGE_KEYS.ENVIRONMENT, 'production', {
          serialize: (v) => v,
          deserialize: (v) => v,
        }),
      );

      expect(result.current[0]).toBe('staging');
    });

    test('writes data in same format as old setEnvironment', () => {
      const { result } = renderHook(() =>
        useLocalStorage(TOOLBAR_STORAGE_KEYS.ENVIRONMENT, 'production', {
          serialize: (v) => v,
          deserialize: (v) => v,
        }),
      );

      act(() => {
        result.current[1]('qa');
      });

      // Verify format matches old: raw string (not JSON)
      const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.ENVIRONMENT);
      expect(stored).toBe('qa'); // Not '"qa"' (JSON)
    });
  });

  describe('Project (raw string format)', () => {
    test('reads data written by old setProjectKey format', () => {
      // Old format: localStorage.setItem(STORAGE_KEY, key) - raw string
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.PROJECT, 'my-project-key');

      const { result } = renderHook(() =>
        useLocalStorage(TOOLBAR_STORAGE_KEYS.PROJECT, '', {
          serialize: (v) => v,
          deserialize: (v) => v,
        }),
      );

      expect(result.current[0]).toBe('my-project-key');
    });

    test('writes data in same format as old setProjectKey', () => {
      const { result } = renderHook(() =>
        useLocalStorage(TOOLBAR_STORAGE_KEYS.PROJECT, '', {
          serialize: (v) => v,
          deserialize: (v) => v,
        }),
      );

      act(() => {
        result.current[1]('another-project');
      });

      // Verify format matches old: raw string (not JSON)
      const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.PROJECT);
      expect(stored).toBe('another-project'); // Not '"another-project"' (JSON)
    });
  });

  describe('Toolbar Disabled (string "true" or removed)', () => {
    test('reads "true" string written by old disable()', () => {
      // Old format: localStorage.setItem(STORAGE_KEY, 'true')
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.DISABLED, 'true');

      const { result } = renderHook(() =>
        useLocalStorage(TOOLBAR_STORAGE_KEYS.DISABLED, false, {
          syncTabs: true,
          serialize: String,
          deserialize: (v) => v === 'true',
        }),
      );

      expect(result.current[0]).toBe(true);
    });

    test('reads missing item as enabled (old enable() removed the item)', () => {
      // Old format: localStorage.removeItem(STORAGE_KEY) for enable
      // Item doesn't exist = enabled (default false for isDisabled)

      const { result } = renderHook(() =>
        useLocalStorage(TOOLBAR_STORAGE_KEYS.DISABLED, false, {
          syncTabs: true,
          serialize: String,
          deserialize: (v) => v === 'true',
        }),
      );

      expect(result.current[0]).toBe(false);
    });

    test('remove() matches old enable() behavior (removes item)', () => {
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.DISABLED, 'true');

      const { result } = renderHook(() =>
        useLocalStorage(TOOLBAR_STORAGE_KEYS.DISABLED, false, {
          syncTabs: true,
          serialize: String,
          deserialize: (v) => v === 'true',
        }),
      );

      act(() => {
        result.current[2](); // remove()
      });

      // Verify item is removed (matches old enable() behavior)
      expect(localStorage.getItem(TOOLBAR_STORAGE_KEYS.DISABLED)).toBeNull();
      expect(result.current[0]).toBe(false);
    });

    test('disable writes "true" string (matches old format)', () => {
      const { result } = renderHook(() =>
        useLocalStorage(TOOLBAR_STORAGE_KEYS.DISABLED, false, {
          syncTabs: true,
          serialize: String,
          deserialize: (v) => v === 'true',
        }),
      );

      act(() => {
        result.current[1](true);
      });

      // Verify format matches old: string 'true'
      expect(localStorage.getItem(TOOLBAR_STORAGE_KEYS.DISABLED)).toBe('true');
    });
  });
});

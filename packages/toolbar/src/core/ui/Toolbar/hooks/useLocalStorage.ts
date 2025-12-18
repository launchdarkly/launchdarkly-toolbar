import { useState, useEffect, useCallback, useRef } from 'react';

interface UseLocalStorageOptions<T> {
  /** Sync across browser tabs (default: false) */
  syncTabs?: boolean;
  /** Custom serializer (default: JSON.stringify) */
  serialize?: (value: T) => string;
  /** Custom deserializer (default: JSON.parse) */
  deserialize?: (value: string) => T;
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const { syncTabs = false, serialize = JSON.stringify, deserialize = JSON.parse } = options;

  // Store serializers in refs to avoid re-running effects when inline functions are passed
  const serializeRef = useRef(serialize);
  const deserializeRef = useRef(deserialize);
  serializeRef.current = serialize;
  deserializeRef.current = deserialize;

  // Track if user has explicitly set a value (vs using default)
  const hasBeenSetRef = useRef(false);
  // Track if we should skip the next persist
  const skipPersistRef = useRef(false);

  // Initialize from localStorage or default
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        // Value came from storage - mark as "set" but skip first persist
        hasBeenSetRef.current = true;
        skipPersistRef.current = true;
        return deserializeRef.current(stored);
      }
      // Using default value - don't persist until explicitly set
      return defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // Wrap setValue to mark that value has been explicitly set
  const setValueWrapper = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      hasBeenSetRef.current = true;
      skipPersistRef.current = false;
      setValue(newValue);
    },
    [setValue],
  );

  // Persist to localStorage on change (only if explicitly set)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!hasBeenSetRef.current) return; // Don't persist default value
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }
    try {
      localStorage.setItem(key, serializeRef.current(value));
    } catch (error) {
      console.warn(`Failed to save ${key} to localStorage`, error);
    }
  }, [key, value]);

  // Cross-tab sync (optional)
  useEffect(() => {
    if (!syncTabs || typeof window === 'undefined') return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          hasBeenSetRef.current = true;
          skipPersistRef.current = true;
          setValue(deserializeRef.current(e.newValue));
        } catch {
          /* ignore invalid data */
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, syncTabs]);

  // Remove from storage
  const remove = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      hasBeenSetRef.current = false;
      skipPersistRef.current = true;
      localStorage.removeItem(key);
      setValue(defaultValue);
    } catch {
      /* ignore */
    }
  }, [key, defaultValue]);

  return [value, setValueWrapper, remove];
}

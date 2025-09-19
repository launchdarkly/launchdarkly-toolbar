import { useState, useEffect } from 'react';
import { TOOLBAR_STORAGE_KEYS } from '../utils/localStorage';

const STORAGE_KEY = TOOLBAR_STORAGE_KEYS.DISABLED;

/**
 * Hook that manages toolbar visibility based on localStorage
 * Sets up window.ldToolbar API for easy developer control
 */
export function useToolbarVisibility() {
  const [isDisabled, setIsDisabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  // Set up window API for developer convenience
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const api = {
      disable: () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setIsDisabled(true);
        console.log('✅ LaunchDarkly toolbar disabled.');
      },
      enable: () => {
        localStorage.removeItem(STORAGE_KEY);
        setIsDisabled(false);
        console.log('✅ LaunchDarkly toolbar enabled.');
      },
      status: () => {
        const disabled = localStorage.getItem(STORAGE_KEY) === 'true';
        console.log(`LaunchDarkly toolbar is currently: ${disabled ? '❌ DISABLED' : '✅ ENABLED'}`);
        return !disabled;
      },
      toggle: () => {
        const currentlyDisabled = localStorage.getItem(STORAGE_KEY) === 'true';
        if (currentlyDisabled) {
          api.enable();
        } else {
          api.disable();
        }
      },
    };

    window.ldToolbar = api;

    console.log(
      '🔧 LaunchDarkly toolbar controls available:\n' +
        '   window.ldToolbar.enable() - Enable toolbar\n' +
        '   window.ldToolbar.disable() - Disable toolbar\n' +
        '   window.ldToolbar.toggle() - Toggle toolbar\n' +
        '   window.ldToolbar.status() - Check current status',
    );

    // Cleanup function
    return () => {
      delete window.ldToolbar;
    };
  }, []);

  // Listen for localStorage changes from other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setIsDisabled(event.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return !isDisabled;
}

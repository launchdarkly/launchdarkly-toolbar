import { useEffect } from 'react';
import { TOOLBAR_STORAGE_KEYS } from '../utils/localStorage';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = TOOLBAR_STORAGE_KEYS.DISABLED;

/**
 * Hook that manages toolbar visibility based on localStorage
 * Sets up window.ldToolbar API for easy developer control
 */
export function useToolbarVisibility() {
  const [isDisabled, setIsDisabled, removeDisabled] = useLocalStorage(STORAGE_KEY, false, {
    syncTabs: true,
    serialize: String,
    deserialize: (v) => v === 'true',
  });

  // Set up window API for developer convenience
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const api = {
      disable: () => {
        setIsDisabled(true);
        console.log('✅ LaunchDarkly toolbar disabled.');
      },
      enable: () => {
        removeDisabled();
        console.log('✅ LaunchDarkly toolbar enabled.');
      },
      status: () => {
        console.log(`LaunchDarkly toolbar is currently: ${isDisabled ? '❌ DISABLED' : '✅ ENABLED'}`);
        return !isDisabled;
      },
      toggle: () => {
        if (isDisabled) {
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
  }, [isDisabled, setIsDisabled, removeDisabled]);

  return !isDisabled;
}

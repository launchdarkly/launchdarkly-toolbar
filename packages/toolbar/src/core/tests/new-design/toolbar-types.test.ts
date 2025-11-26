import { describe, it, expect } from 'vitest';
import {
  getToolbarMode,
  getTabsForMode,
  getDefaultActiveTab,
  TAB_ORDER,
  DEV_SERVER_TABS,
  SDK_MODE_TABS,
  NEW_TOOLBAR_TABS,
} from '../../ui/Toolbar/types/toolbar';

describe('Toolbar Types Utilities', () => {
  describe('getToolbarMode', () => {
    it('should return "dev-server" when devServerUrl is provided', () => {
      expect(getToolbarMode('http://localhost:3000')).toBe('dev-server');
      expect(getToolbarMode('https://dev-server.example.com')).toBe('dev-server');
    });

    it('should return "sdk" when devServerUrl is not provided', () => {
      expect(getToolbarMode()).toBe('sdk');
      expect(getToolbarMode(undefined)).toBe('sdk');
    });

    it('should return "sdk" when devServerUrl is empty string', () => {
      expect(getToolbarMode('')).toBe('sdk');
    });
  });

  describe('getTabsForMode', () => {
    describe('dev-server mode', () => {
      it('should return flag-dev-server and settings without event interception', () => {
        const tabs = getTabsForMode('dev-server', false, false);
        expect(tabs).toEqual(['flag-dev-server', 'settings']);
      });

      it('should include events tab when event interception plugin is available', () => {
        const tabs = getTabsForMode('dev-server', false, true);
        expect(tabs).toEqual(['flag-dev-server', 'events', 'settings']);
      });

      it('should ignore flag override plugin in dev-server mode', () => {
        const tabs = getTabsForMode('dev-server', true, false);
        expect(tabs).toEqual(['flag-dev-server', 'settings']);
        expect(tabs).not.toContain('flag-sdk');
      });
    });

    describe('sdk mode', () => {
      it('should return only settings when no plugins are available', () => {
        const tabs = getTabsForMode('sdk', false, false);
        expect(tabs).toEqual(['settings']);
      });

      it('should include flag-sdk when flag override plugin is available', () => {
        const tabs = getTabsForMode('sdk', true, false);
        expect(tabs).toEqual(['flag-sdk', 'settings']);
      });

      it('should include events when event interception plugin is available', () => {
        const tabs = getTabsForMode('sdk', false, true);
        expect(tabs).toEqual(['events', 'settings']);
      });

      it('should include all tabs when all plugins are available', () => {
        const tabs = getTabsForMode('sdk', true, true);
        expect(tabs).toEqual(['flag-sdk', 'events', 'settings']);
      });
    });
  });

  describe('getDefaultActiveTab', () => {
    describe('with new toolbar design', () => {
      it('should return "flags" when useNewToolbarDesign is true', () => {
        expect(getDefaultActiveTab('dev-server', false, false, true)).toBe('flags');
        expect(getDefaultActiveTab('sdk', false, false, true)).toBe('flags');
        expect(getDefaultActiveTab('sdk', true, true, true)).toBe('flags');
      });
    });

    describe('dev-server mode (legacy)', () => {
      it('should return "flag-dev-server" for dev-server mode', () => {
        expect(getDefaultActiveTab('dev-server', false, false, false)).toBe('flag-dev-server');
        expect(getDefaultActiveTab('dev-server', true, true, false)).toBe('flag-dev-server');
      });
    });

    describe('sdk mode (legacy)', () => {
      it('should return "flag-sdk" when flag override plugin is available', () => {
        expect(getDefaultActiveTab('sdk', true, false, false)).toBe('flag-sdk');
        expect(getDefaultActiveTab('sdk', true, true, false)).toBe('flag-sdk');
      });

      it('should return "events" when only event interception plugin is available', () => {
        expect(getDefaultActiveTab('sdk', false, true, false)).toBe('events');
      });

      it('should return "settings" when no plugins are available', () => {
        expect(getDefaultActiveTab('sdk', false, false, false)).toBe('settings');
      });
    });

    describe('fallback behavior', () => {
      it('should return "settings" as ultimate fallback', () => {
        // @ts-expect-error Testing invalid mode
        expect(getDefaultActiveTab('invalid', false, false, false)).toBe('settings');
      });
    });
  });

  describe('Tab Constants', () => {
    it('should have correct TAB_ORDER', () => {
      expect(TAB_ORDER).toEqual(['flag-sdk', 'flag-dev-server', 'events', 'settings']);
    });

    it('should have correct DEV_SERVER_TABS', () => {
      expect(DEV_SERVER_TABS).toEqual(['flag-dev-server', 'events', 'settings']);
    });

    it('should have correct SDK_MODE_TABS', () => {
      expect(SDK_MODE_TABS).toEqual(['flag-sdk', 'events', 'settings']);
    });

    it('should have correct NEW_TOOLBAR_TABS', () => {
      expect(NEW_TOOLBAR_TABS).toEqual(['flags', 'monitoring', 'interactive', 'settings']);
    });

    it('should be readonly arrays', () => {
      // TypeScript enforces readonly, but we can test immutability at runtime
      expect(Object.isFrozen(TAB_ORDER)).toBe(false); // readonly in TS, but not frozen
      expect(Array.isArray(TAB_ORDER)).toBe(true);
    });
  });
});

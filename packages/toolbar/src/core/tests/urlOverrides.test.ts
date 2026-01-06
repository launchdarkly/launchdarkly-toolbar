import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  serializeToolbarState,
  parseToolbarState,
  hasToolbarState,
  clearToolbarStateFromUrl,
  loadSharedStateFromUrl,
  SHARED_STATE_VERSION,
  MAX_STATE_SIZE_WARNING,
  MAX_STATE_SIZE_LIMIT,
  type SharedToolbarState,
} from '../utils/urlOverrides';

describe('Toolbar State Sharing', () => {
  let originalLocation: any;
  let originalLocalStorage: any;

  beforeEach(() => {
    // Mock window.location
    originalLocation = window.location;
    delete (window as any).location;
    window.location = {
      href: 'https://example.com',
      origin: 'https://example.com',
      pathname: '/',
      search: '',
    } as any;

    // Mock localStorage
    originalLocalStorage = window.localStorage;
    const storage: Record<string, string> = {};
    window.localStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        Object.keys(storage).forEach((key) => delete storage[key]);
      },
      get length() {
        return Object.keys(storage).length;
      },
      key: (index: number) => Object.keys(storage)[index] || null,
    } as Storage;

    // Mock history.replaceState
    window.history.replaceState = vi.fn();
  });

  afterEach(() => {
    window.location = originalLocation;
    window.localStorage = originalLocalStorage;
    vi.restoreAllMocks();
  });

  describe('serializeToolbarState', () => {
    test('serializes complete state correctly', () => {
      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: { flag1: true, flag2: 'control' },
        contexts: [{ id: 'user1', kind: 'user' }],
        activeContext: { id: 'user2', kind: 'user' },
        settings: { position: 'bottom-right', reloadOnFlagChange: true },
        starredFlags: ['flag1', 'flag2'],
      };

      const result = serializeToolbarState(state);

      expect(result.url).toContain('ldToolbarState=');
      expect(result.size).toBeGreaterThan(0);
      expect(typeof result.exceedsWarning).toBe('boolean');
      expect(typeof result.exceedsLimit).toBe('boolean');
    });

    test('serialized state can be parsed back', () => {
      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: { flag1: true, flag2: 42, flag3: { nested: 'value' } },
        contexts: [{ id: 'user1', kind: 'user' }],
        activeContext: { id: 'user2', kind: 'user' },
        settings: { position: 'bottom-right' },
        starredFlags: ['flag1'],
      };

      const serialized = serializeToolbarState(state);
      const parsed = parseToolbarState(serialized.url);

      expect(parsed.found).toBe(true);
      expect(parsed.state).toEqual(state);
      expect(parsed.error).toBeNull();
    });

    test('detects when size exceeds warning threshold', () => {
      // Create a large state
      const largeOverrides: Record<string, any> = {};
      for (let i = 0; i < 100; i++) {
        largeOverrides[`flag${i}`] = `value${i}`;
      }

      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: largeOverrides,
        contexts: [],
        activeContext: null,
        settings: {},
        starredFlags: [],
      };

      const result = serializeToolbarState(state);

      if (result.size > MAX_STATE_SIZE_WARNING) {
        expect(result.exceedsWarning).toBe(true);
      }
    });

    test('detects when size exceeds limit', () => {
      // Create a very large state
      const veryLargeOverrides: Record<string, any> = {};
      for (let i = 0; i < 500; i++) {
        veryLargeOverrides[`flag${i}`] = { data: 'x'.repeat(50) };
      }

      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: veryLargeOverrides,
        contexts: [],
        activeContext: null,
        settings: {},
        starredFlags: [],
      };

      const result = serializeToolbarState(state);

      if (result.size > MAX_STATE_SIZE_LIMIT) {
        expect(result.exceedsLimit).toBe(true);
      }
    });

    test('preserves existing query parameters', () => {
      window.location.search = '?existing=value&another=param';

      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: {},
        contexts: [],
        activeContext: null,
        settings: {},
        starredFlags: [],
      };

      const result = serializeToolbarState(state);

      expect(result.url).toContain('existing=value');
      expect(result.url).toContain('another=param');
      expect(result.url).toContain('ldToolbarState=');
    });

    test('uses custom base URL when provided', () => {
      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: {},
        contexts: [],
        activeContext: null,
        settings: {},
        starredFlags: [],
      };

      const result = serializeToolbarState(state, 'https://custom.com/path');

      expect(result.url).toContain('https://custom.com/path');
    });

    test('uses custom param name when provided', () => {
      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: {},
        contexts: [],
        activeContext: null,
        settings: {},
        starredFlags: [],
      };

      const result = serializeToolbarState(state, undefined, 'customParam');

      expect(result.url).toContain('customParam=');
      expect(result.url).not.toContain('ldToolbarState=');
    });

    test('handles empty state', () => {
      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: {},
        contexts: [],
        activeContext: null,
        settings: {},
        starredFlags: [],
      };

      const result = serializeToolbarState(state);

      expect(result.url).toContain('ldToolbarState=');
      const parsed = parseToolbarState(result.url);
      expect(parsed.state).toEqual(state);
    });
  });

  describe('parseToolbarState', () => {
    test('returns not found when parameter is missing', () => {
      const result = parseToolbarState('https://example.com');

      expect(result.found).toBe(false);
      expect(result.state).toBeNull();
      expect(result.error).toBeNull();
    });

    test('parses valid state correctly', () => {
      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: { flag1: true },
        contexts: [{ id: 'user1', kind: 'user' }],
        activeContext: null,
        settings: { position: 'top-left' },
        starredFlags: ['flag1'],
      };

      const serialized = serializeToolbarState(state);
      const parsed = parseToolbarState(serialized.url);

      expect(parsed.found).toBe(true);
      expect(parsed.state).toEqual(state);
      expect(parsed.error).toBeNull();
    });

    test('handles invalid base64', () => {
      const result = parseToolbarState('https://example.com?ldToolbarState=invalid!!!base64');

      expect(result.found).toBe(true);
      expect(result.state).toBeNull();
      expect(result.error).toContain('Failed to decode state');
    });

    test('handles invalid JSON', () => {
      // Create invalid base64-encoded content (not valid JSON)
      const invalidJson = btoa('not valid json');
      const result = parseToolbarState(`https://example.com?ldToolbarState=${invalidJson}`);

      expect(result.found).toBe(true);
      expect(result.state).toBeNull();
      expect(result.error).toContain('Failed to decode state');
    });

    test('validates state structure - missing version', () => {
      const invalidState = {
        overrides: {},
        contexts: [],
        activeContext: null,
        settings: {},
        starredFlags: [],
      };
      const encoded = btoa(JSON.stringify(invalidState));
      const result = parseToolbarState(`https://example.com?ldToolbarState=${encoded}`);

      expect(result.found).toBe(true);
      expect(result.state).toBeNull();
      expect(result.error).toContain('version');
    });

    test('validates state structure - invalid overrides type', () => {
      const invalidState = {
        version: SHARED_STATE_VERSION,
        overrides: 'not an object',
        contexts: [],
        activeContext: null,
        settings: {},
        starredFlags: [],
      };
      const encoded = btoa(JSON.stringify(invalidState));
      const result = parseToolbarState(`https://example.com?ldToolbarState=${encoded}`);

      expect(result.found).toBe(true);
      expect(result.state).toBeNull();
      expect(result.error).toContain('overrides');
    });

    test('validates state structure - invalid contexts type', () => {
      const invalidState = {
        version: SHARED_STATE_VERSION,
        overrides: {},
        contexts: 'not an array',
        activeContext: null,
        settings: {},
        starredFlags: [],
      };
      const encoded = btoa(JSON.stringify(invalidState));
      const result = parseToolbarState(`https://example.com?ldToolbarState=${encoded}`);

      expect(result.found).toBe(true);
      expect(result.state).toBeNull();
      expect(result.error).toContain('contexts');
    });

    test('allows missing optional fields for backwards compatibility', () => {
      const minimalState = {
        version: SHARED_STATE_VERSION,
      };
      const encoded = btoa(JSON.stringify(minimalState));
      const result = parseToolbarState(`https://example.com?ldToolbarState=${encoded}`);

      expect(result.found).toBe(true);
      expect(result.state).toBeTruthy();
      expect(result.error).toBeNull();
    });

    test('uses custom param name when provided', () => {
      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: {},
        contexts: [],
        activeContext: null,
        settings: {},
        starredFlags: [],
      };

      const serialized = serializeToolbarState(state, undefined, 'customParam');
      const parsed = parseToolbarState(serialized.url, 'customParam');

      expect(parsed.found).toBe(true);
      expect(parsed.state).toEqual(state);
    });
  });

  describe('hasToolbarState', () => {
    test('returns true when parameter exists', () => {
      const result = hasToolbarState('https://example.com?ldToolbarState=abc123');

      expect(result).toBe(true);
    });

    test('returns false when parameter does not exist', () => {
      const result = hasToolbarState('https://example.com?other=value');

      expect(result).toBe(false);
    });

    test('returns false for URL with no parameters', () => {
      const result = hasToolbarState('https://example.com');

      expect(result).toBe(false);
    });

    test('uses current window.location.href when no URL provided', () => {
      window.location.href = 'https://example.com?ldToolbarState=test';

      const result = hasToolbarState();

      expect(result).toBe(true);
    });

    test('uses custom param name when provided', () => {
      const result = hasToolbarState('https://example.com?customParam=test', 'customParam');

      expect(result).toBe(true);
    });
  });

  describe('clearToolbarStateFromUrl', () => {
    test('removes parameter from URL', () => {
      window.location.href = 'https://example.com?ldToolbarState=test&other=value';

      clearToolbarStateFromUrl();

      expect(window.history.replaceState).toHaveBeenCalled();
      const call = (window.history.replaceState as any).mock.calls[0];
      expect(call[2]).not.toContain('ldToolbarState');
      expect(call[2]).toContain('other=value');
    });

    test('does nothing if parameter does not exist', () => {
      window.location.href = 'https://example.com?other=value';

      clearToolbarStateFromUrl();

      expect(window.history.replaceState).not.toHaveBeenCalled();
    });

    test('uses custom param name when provided', () => {
      window.location.href = 'https://example.com?customParam=test';

      clearToolbarStateFromUrl('customParam');

      expect(window.history.replaceState).toHaveBeenCalled();
      const call = (window.history.replaceState as any).mock.calls[0];
      expect(call[2]).not.toContain('customParam');
    });
  });

  describe('loadSharedStateFromUrl', () => {
    test('loads and applies complete state to localStorage', () => {
      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: { flag1: true, flag2: 'control' },
        contexts: [{ id: 'user1', kind: 'user' }],
        activeContext: { id: 'user2', kind: 'user' },
        settings: { position: 'bottom-right' },
        starredFlags: ['flag1', 'flag2'],
      };

      const serialized = serializeToolbarState(state);
      window.location.href = serialized.url;

      const result = loadSharedStateFromUrl();

      expect(result.loaded).toBe(true);
      expect(result.error).toBeNull();

      // Verify overrides were saved
      expect(window.localStorage.getItem('ld-flag-override:flag1')).toBe('true');
      expect(window.localStorage.getItem('ld-flag-override:flag2')).toBe('"control"');

      // Verify contexts were saved
      expect(window.localStorage.getItem('ld-toolbar-contexts')).toBe(JSON.stringify(state.contexts));

      // Verify active context was saved
      expect(window.localStorage.getItem('ld-toolbar-active-context')).toBe(JSON.stringify(state.activeContext));

      // Verify settings were saved
      expect(window.localStorage.getItem('ld-toolbar-settings')).toBe(JSON.stringify(state.settings));

      // Verify starred flags were saved
      expect(window.localStorage.getItem('ld-toolbar-starred-flags')).toBe(JSON.stringify(state.starredFlags));

      // Verify URL was cleared
      expect(window.history.replaceState).toHaveBeenCalled();
    });

    test('returns not loaded when no parameter exists', () => {
      window.location.href = 'https://example.com';

      const result = loadSharedStateFromUrl();

      expect(result.loaded).toBe(false);
      expect(result.error).toBeNull();
    });

    test('returns error when state is invalid', () => {
      window.location.href = 'https://example.com?ldToolbarState=invalid';

      const result = loadSharedStateFromUrl();

      expect(result.loaded).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('uses custom flag override namespace', () => {
      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: { flag1: true },
        contexts: [],
        activeContext: null,
        settings: {},
        starredFlags: [],
      };

      const serialized = serializeToolbarState(state);
      window.location.href = serialized.url;

      loadSharedStateFromUrl(undefined, 'custom-namespace');

      expect(window.localStorage.getItem('custom-namespace:flag1')).toBe('true');
    });

    test('handles missing optional state fields gracefully', () => {
      const minimalState = {
        version: SHARED_STATE_VERSION,
        overrides: { flag1: true },
      };

      const encoded = btoa(JSON.stringify(minimalState));
      window.location.href = `https://example.com?ldToolbarState=${encoded}`;

      const result = loadSharedStateFromUrl();

      expect(result.loaded).toBe(true);
      expect(window.localStorage.getItem('ld-flag-override:flag1')).toBe('true');
    });

    test('clears URL parameter after loading', () => {
      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: {},
        contexts: [],
        activeContext: null,
        settings: {},
        starredFlags: [],
      };

      const serialized = serializeToolbarState(state);
      window.location.href = serialized.url;

      loadSharedStateFromUrl();

      expect(window.history.replaceState).toHaveBeenCalled();
    });

    test('applies overrides directly to plugin when provided', () => {
      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: { flag1: true, flag2: 'control', flag3: 42 },
        contexts: [],
        activeContext: null,
        settings: {},
        starredFlags: [],
      };

      const serialized = serializeToolbarState(state);
      window.location.href = serialized.url;

      // Mock plugin
      const mockPlugin = {
        setOverride: vi.fn(),
      };

      const result = loadSharedStateFromUrl(undefined, undefined, mockPlugin);

      expect(result.loaded).toBe(true);
      expect(mockPlugin.setOverride).toHaveBeenCalledTimes(3);
      expect(mockPlugin.setOverride).toHaveBeenCalledWith('flag1', true);
      expect(mockPlugin.setOverride).toHaveBeenCalledWith('flag2', 'control');
      expect(mockPlugin.setOverride).toHaveBeenCalledWith('flag3', 42);
    });

    test('does not crash if plugin is provided but lacks setOverride method', () => {
      const state: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: { flag1: true },
        contexts: [],
        activeContext: null,
        settings: {},
        starredFlags: [],
      };

      const serialized = serializeToolbarState(state);
      window.location.href = serialized.url;

      const mockPlugin = {}; // Missing setOverride method

      const result = loadSharedStateFromUrl(undefined, undefined, mockPlugin);

      expect(result.loaded).toBe(true);
      // Should still save to localStorage even if plugin doesn't support setOverride
      expect(window.localStorage.getItem('ld-flag-override:flag1')).toBe('true');
    });
  });

  describe('round-trip tests', () => {
    test('complete state survives serialization and parsing', () => {
      const originalState: SharedToolbarState = {
        version: SHARED_STATE_VERSION,
        overrides: {
          boolFlag: true,
          numberFlag: 42,
          stringFlag: 'control',
          objectFlag: { nested: { value: 'test' } },
          arrayFlag: [1, 2, 3],
          nullFlag: null,
        },
        contexts: [
          { id: 'user1', kind: 'user', name: 'Alice' },
          { id: 'org1', kind: 'organization', key: 'acme' },
        ],
        activeContext: { id: 'user2', kind: 'user' },
        settings: {
          position: 'bottom-right',
          reloadOnFlagChange: true,
          autoCollapse: false,
          preferredIde: 'cursor',
        },
        starredFlags: ['flag1', 'flag2', 'flag3'],
      };

      const serialized = serializeToolbarState(originalState);
      const parsed = parseToolbarState(serialized.url);

      expect(parsed.found).toBe(true);
      expect(parsed.state).toEqual(originalState);
      expect(parsed.error).toBeNull();
    });
  });
});

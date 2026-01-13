import { expect, test, describe } from 'vitest';
import type { LDContext, LDMultiKindContext, LDSingleKindContext } from 'launchdarkly-js-client-sdk';
import {
  areContextsEqual,
  getContextKind,
  getContextKey,
  getContextDisplayName,
  isContextAnonymous,
  getStableContextId,
} from '../ui/Toolbar/utils/context';

describe('context utilities', () => {
  describe('getStableContextId', () => {
    test('generates deterministic ID based on kind+key', () => {
      const context: LDContext = { kind: 'user', key: 'user-123', name: 'Test User' };
      const id1 = getStableContextId(context);
      const id2 = getStableContextId(context);

      expect(id1).toBe(id2);
      expect(id1).toBe('user:user-123');
    });

    test('generates same ID for contexts with same kind+key but different attributes', () => {
      const context1: LDContext = { kind: 'user', key: 'user-123' };
      const context2: LDContext = { kind: 'user', key: 'user-123', name: 'Test User', email: 'test@example.com' };

      expect(getStableContextId(context1)).toBe(getStableContextId(context2));
      expect(getStableContextId(context1)).toBe('user:user-123');
    });

    test('generates different IDs for different keys', () => {
      const context1: LDContext = { kind: 'user', key: 'user-123' };
      const context2: LDContext = { kind: 'user', key: 'user-456' };

      expect(getStableContextId(context1)).not.toBe(getStableContextId(context2));
      expect(getStableContextId(context1)).toBe('user:user-123');
      expect(getStableContextId(context2)).toBe('user:user-456');
    });

    test('generates different IDs for different kinds', () => {
      const userContext: LDContext = { kind: 'user', key: 'key-123' };
      const orgContext: LDContext = { kind: 'organization', key: 'key-123' };

      expect(getStableContextId(userContext)).not.toBe(getStableContextId(orgContext));
      expect(getStableContextId(userContext)).toBe('user:key-123');
      expect(getStableContextId(orgContext)).toBe('organization:key-123');
    });

    test('handles multi-kind contexts with sorted keys', () => {
      const multiContext: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-123' },
        organization: { key: 'org-456' },
      };

      const id = getStableContextId(multiContext);
      expect(id).toBe('multi:organization:org-456:user:user-123');
    });

    test('generates same ID for multi-kind contexts regardless of property order or extra attributes', () => {
      const context1: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-123', name: 'Test' },
        organization: { key: 'org-456' },
      };

      const context2: LDMultiKindContext = {
        kind: 'multi',
        organization: { key: 'org-456', email: 'org@example.com' },
        user: { key: 'user-123' },
      };

      expect(getStableContextId(context1)).toBe(getStableContextId(context2));
    });

    test('returns empty string for null context', () => {
      expect(getStableContextId(null)).toBe('');
    });

    test('returns empty string for undefined context', () => {
      expect(getStableContextId(undefined)).toBe('');
    });
  });

  describe('areContextsEqual', () => {
    test('returns true for identical contexts', () => {
      const context: LDContext = { kind: 'user', key: 'user-123' };
      expect(areContextsEqual(context, context)).toBe(true);
    });

    test('returns true for equivalent contexts', () => {
      const context1: LDContext = { kind: 'user', key: 'user-123', name: 'Test' };
      const context2: LDContext = { kind: 'user', key: 'user-123', name: 'Test' };
      expect(areContextsEqual(context1, context2)).toBe(true);
    });

    test('returns false for different contexts', () => {
      const context1: LDContext = { kind: 'user', key: 'user-123' };
      const context2: LDContext = { kind: 'user', key: 'user-456' };
      expect(areContextsEqual(context1, context2)).toBe(false);
    });

    test('returns true when both contexts are null', () => {
      expect(areContextsEqual(null, null)).toBe(true);
    });

    test('returns true when both contexts are undefined', () => {
      expect(areContextsEqual(undefined, undefined)).toBe(true);
    });

    test('returns false when one context is null and the other is not', () => {
      const context: LDContext = { kind: 'user', key: 'user-123' };
      expect(areContextsEqual(context, null)).toBe(false);
      expect(areContextsEqual(null, context)).toBe(false);
    });

    test('returns true for equivalent multi-kind contexts', () => {
      const context1: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-123' },
        organization: { key: 'org-456' },
      };
      const context2: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-123' },
        organization: { key: 'org-456' },
      };
      expect(areContextsEqual(context1, context2)).toBe(true);
    });
  });

  describe('getContextKind', () => {
    test('returns kind for single-kind context', () => {
      const context: LDSingleKindContext = { kind: 'user', key: 'user-123' };
      expect(getContextKind(context)).toBe('user');
    });

    test('returns "multi" for multi-kind context', () => {
      const context: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-123' },
        organization: { key: 'org-456' },
      };
      expect(getContextKind(context)).toBe('multi');
    });

    test('returns "user" for legacy context without kind', () => {
      // Legacy contexts without kind are treated as user contexts
      const context = { key: 'user-123' } as LDContext;
      expect(getContextKind(context)).toBe('user');
    });

    test('returns empty string for null context', () => {
      expect(getContextKind(null)).toBe('');
    });

    test('returns empty string for undefined context', () => {
      expect(getContextKind(undefined)).toBe('');
    });

    test('handles various single-kind types', () => {
      expect(getContextKind({ kind: 'organization', key: 'org-1' })).toBe('organization');
      expect(getContextKind({ kind: 'device', key: 'device-1' })).toBe('device');
      expect(getContextKind({ kind: 'account', key: 'account-1' })).toBe('account');
    });
  });

  describe('getContextKey', () => {
    test('returns key for single-kind context', () => {
      const context: LDSingleKindContext = { kind: 'user', key: 'user-123' };
      expect(getContextKey(context)).toBe('user-123');
    });

    test('returns first nested context key for multi-kind context', () => {
      const context: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-123' },
        organization: { key: 'org-456' },
      };
      // Object keys iteration order, first key should be 'user'
      const key = getContextKey(context);
      expect(key).toBe('user-123');
    });

    test('returns empty string for multi-kind context without nested contexts', () => {
      const context = { kind: 'multi' } as LDMultiKindContext;
      expect(getContextKey(context)).toBe('');
    });

    test('returns empty string for null context', () => {
      expect(getContextKey(null)).toBe('');
    });

    test('returns empty string for undefined context', () => {
      expect(getContextKey(undefined)).toBe('');
    });

    test('returns key from legacy context without kind', () => {
      const context = { key: 'legacy-user-123' } as LDContext;
      expect(getContextKey(context)).toBe('legacy-user-123');
    });
  });

  describe('getContextDisplayName', () => {
    test('returns name when present', () => {
      const context: LDSingleKindContext = { kind: 'user', key: 'user-123', name: 'Test User' };
      expect(getContextDisplayName(context)).toBe('Test User');
    });

    test('falls back to key when name is not present', () => {
      const context: LDSingleKindContext = { kind: 'user', key: 'user-123' };
      expect(getContextDisplayName(context)).toBe('user-123');
    });

    test('returns nested context name for multi-kind context', () => {
      const context: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-123', name: 'Test User' },
        organization: { key: 'org-456', name: 'Test Org' },
      };
      expect(getContextDisplayName(context)).toBe('Test User');
    });

    test('returns nested context key when name is not present in multi-kind', () => {
      const context: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-123' },
        organization: { key: 'org-456' },
      };
      expect(getContextDisplayName(context)).toBe('user-123');
    });

    test('returns "multi-kind" for multi-kind context without nested contexts', () => {
      const context = { kind: 'multi' } as LDMultiKindContext;
      expect(getContextDisplayName(context)).toBe('multi-kind');
    });

    test('returns empty string for null context', () => {
      expect(getContextDisplayName(null)).toBe('');
    });

    test('returns empty string for undefined context', () => {
      expect(getContextDisplayName(undefined)).toBe('');
    });
  });

  describe('isContextAnonymous', () => {
    test('returns true for anonymous single-kind context', () => {
      const context: LDSingleKindContext = { kind: 'user', key: 'user-123', anonymous: true };
      expect(isContextAnonymous(context)).toBe(true);
    });

    test('returns false for non-anonymous single-kind context', () => {
      const context: LDSingleKindContext = { kind: 'user', key: 'user-123' };
      expect(isContextAnonymous(context)).toBe(false);
    });

    test('returns false for context with anonymous set to false', () => {
      const context: LDSingleKindContext = { kind: 'user', key: 'user-123', anonymous: false };
      expect(isContextAnonymous(context)).toBe(false);
    });

    test('returns true for multi-kind context with any anonymous nested context', () => {
      const context: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-123', anonymous: true },
        organization: { key: 'org-456' },
      };
      expect(isContextAnonymous(context)).toBe(true);
    });

    test('returns false for multi-kind context with no anonymous nested contexts', () => {
      const context: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-123' },
        organization: { key: 'org-456' },
      };
      expect(isContextAnonymous(context)).toBe(false);
    });

    test('returns false for null context', () => {
      expect(isContextAnonymous(null)).toBe(false);
    });

    test('returns false for undefined context', () => {
      expect(isContextAnonymous(undefined)).toBe(false);
    });
  });
});

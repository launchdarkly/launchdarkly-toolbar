import { expect, test, describe } from 'vitest';
import type { LDContext, LDMultiKindContext, LDSingleKindContext } from 'launchdarkly-js-client-sdk';
import {
  generateContextId,
  areContextsEqual,
  getContextKind,
  getContextKey,
  getContextDisplayName,
  isContextAnonymous,
} from '../ui/Toolbar/utils/context';

describe('context utilities', () => {
  describe('generateContextId', () => {
    test('generates deterministic ID for the same context', () => {
      const context: LDContext = { kind: 'user', key: 'user-123', name: 'Test User' };
      const id1 = generateContextId(context);
      const id2 = generateContextId(context);

      expect(id1).toBe(id2);
      expect(id1).toMatch(/^ctx_/);
    });

    test('generates different IDs for different contexts', () => {
      const context1: LDContext = { kind: 'user', key: 'user-123' };
      const context2: LDContext = { kind: 'user', key: 'user-456' };

      const id1 = generateContextId(context1);
      const id2 = generateContextId(context2);

      expect(id1).not.toBe(id2);
    });

    test('generates different IDs for contexts with different kinds', () => {
      const userContext: LDContext = { kind: 'user', key: 'key-123' };
      const orgContext: LDContext = { kind: 'organization', key: 'key-123' };

      const userId = generateContextId(userContext);
      const orgId = generateContextId(orgContext);

      expect(userId).not.toBe(orgId);
    });

    test('generates fallback ID when context is null', () => {
      const id = generateContextId(null);
      expect(id).toMatch(/^ctx_/);
    });

    test('generates fallback ID when context is undefined', () => {
      const id = generateContextId(undefined);
      expect(id).toMatch(/^ctx_/);
    });

    test('generates consistent ID for multi-kind contexts', () => {
      const multiContext: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-123', name: 'Test User' },
        organization: { key: 'org-456', name: 'Test Org' },
      };

      const id1 = generateContextId(multiContext);
      const id2 = generateContextId(multiContext);

      expect(id1).toBe(id2);
    });

    test('generates different IDs for multi-kind contexts with different nested contexts', () => {
      const context1: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-abc-123', name: 'User One' },
        organization: { key: 'org-xyz-456', name: 'Org One' },
      };

      const context2: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-def-789', name: 'User Two' },
        organization: { key: 'org-uvw-012', name: 'Org Two' },
      };

      expect(generateContextId(context1)).not.toBe(generateContextId(context2));
    });

    test('is not affected by property order in the context object', () => {
      // JSON.stringify with sorted keys should make these equivalent
      const context1 = { kind: 'user', key: 'user-123', name: 'Test' } as LDContext;
      const context2 = { name: 'Test', key: 'user-123', kind: 'user' } as LDContext;

      expect(generateContextId(context1)).toBe(generateContextId(context2));
    });

    test('is not affected by array element order for primitive arrays', () => {
      // Arrays of primitives should be sorted for consistent hashing
      const context1 = {
        kind: 'user',
        key: 'user-123',
        featurePreviews: ['new-experience', 'simple-flag-creation', 'simplified-toggle-ux'],
      } as LDContext;

      const context2 = {
        kind: 'user',
        key: 'user-123',
        featurePreviews: ['simplified-toggle-ux', 'new-experience', 'simple-flag-creation'],
      } as LDContext;

      expect(generateContextId(context1)).toBe(generateContextId(context2));
    });

    test('handles complex multi-kind contexts with nested arrays in different orders', () => {
      const context1: LDMultiKindContext = {
        kind: 'multi',
        member: {
          key: 'member-123',
          name: 'Test User',
          featurePreviews: ['new-experience', 'simple-flag-creation', 'simplified-toggle-ux'],
        },
        account: {
          key: 'account-456',
          name: 'Test Account',
        },
      };

      const context2: LDMultiKindContext = {
        kind: 'multi',
        account: {
          key: 'account-456',
          name: 'Test Account',
        },
        member: {
          key: 'member-123',
          name: 'Test User',
          featurePreviews: ['simplified-toggle-ux', 'new-experience', 'simple-flag-creation'],
        },
      };

      expect(generateContextId(context1)).toBe(generateContextId(context2));
    });

    test('handles arrays of numbers in different orders', () => {
      const context1 = {
        kind: 'user',
        key: 'user-123',
        scores: [100, 200, 50],
      } as LDContext;

      const context2 = {
        kind: 'user',
        key: 'user-123',
        scores: [50, 100, 200],
      } as LDContext;

      expect(generateContextId(context1)).toBe(generateContextId(context2));
    });

    test('handles mixed primitive arrays', () => {
      const context1 = {
        kind: 'user',
        key: 'user-123',
        tags: ['beta', 123, true],
      } as LDContext;

      const context2 = {
        kind: 'user',
        key: 'user-123',
        tags: [true, 'beta', 123],
      } as LDContext;

      expect(generateContextId(context1)).toBe(generateContextId(context2));
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

  describe('deprecated user kind exclusion', () => {
    test('excludes user kind from multi-kind context hash generation', () => {
      // Two multi-kind contexts that differ only in the user kind should hash the same
      const context1: LDMultiKindContext = {
        kind: 'multi',
        account: { key: 'account-123', name: 'Test Account' },
        member: { key: 'member-456', name: 'Test Member' },
        user: { key: 'user-789', name: 'User One', dogfoodCanary: false },
      };

      const context2: LDMultiKindContext = {
        kind: 'multi',
        account: { key: 'account-123', name: 'Test Account' },
        member: { key: 'member-456', name: 'Test Member' },
        user: { key: 'user-789', name: 'User Two', dogfoodCanary: true },
      };

      // These should have the same ID since user kind is excluded
      expect(generateContextId(context1)).toBe(generateContextId(context2));
    });

    test('multi-kind context without user kind hashes correctly', () => {
      const context1: LDMultiKindContext = {
        kind: 'multi',
        account: { key: 'account-123', name: 'Test Account' },
        member: { key: 'member-456', name: 'Test Member' },
      };

      const context2: LDMultiKindContext = {
        kind: 'multi',
        account: { key: 'account-123', name: 'Test Account' },
        member: { key: 'member-456', name: 'Test Member' },
      };

      expect(generateContextId(context1)).toBe(generateContextId(context2));
    });

    test('multi-kind contexts with different non-user kinds have different hashes', () => {
      const context1: LDMultiKindContext = {
        kind: 'multi',
        account: { key: 'account-123', name: 'Test Account' },
        member: { key: 'member-456', name: 'Test Member' },
        user: { key: 'user-789' },
      };

      const context2: LDMultiKindContext = {
        kind: 'multi',
        account: { key: 'account-different', name: 'Different Account' },
        member: { key: 'member-456', name: 'Test Member' },
        user: { key: 'user-789' },
      };

      // These should have different IDs since account is different
      expect(generateContextId(context1)).not.toBe(generateContextId(context2));
    });

    test('single-kind user context is not affected', () => {
      // Single-kind user contexts should still be hashed normally
      const context1: LDContext = { kind: 'user', key: 'user-123', name: 'User One' };
      const context2: LDContext = { kind: 'user', key: 'user-123', name: 'User Two' };

      // These should have different IDs since they're single-kind
      expect(generateContextId(context1)).not.toBe(generateContextId(context2));
    });
  });

  describe('caching behavior', () => {
    test('returns cached result for same object reference', () => {
      const context: LDContext = { kind: 'user', key: 'user-123', name: 'Test User' };

      // Call multiple times with same reference
      const id1 = generateContextId(context);
      const id2 = generateContextId(context);
      const id3 = generateContextId(context);

      // All should return the same ID
      expect(id1).toBe(id2);
      expect(id2).toBe(id3);
    });

    test('returns cached result for equivalent contexts with different references', () => {
      // Create two separate objects with identical content
      const context1: LDContext = { kind: 'user', key: 'cache-test-user', name: 'Cache Test' };
      const context2: LDContext = { kind: 'user', key: 'cache-test-user', name: 'Cache Test' };

      // Different object references
      expect(context1).not.toBe(context2);

      // But should return same ID (from string cache)
      const id1 = generateContextId(context1);
      const id2 = generateContextId(context2);
      expect(id1).toBe(id2);
    });
  });

  describe('hash-based comparison integration', () => {
    test('contexts with same content but different object references are equal', () => {
      const context1: LDContext = { kind: 'user', key: 'user-123', name: 'Test User' };
      const context2: LDContext = { kind: 'user', key: 'user-123', name: 'Test User' };

      // Different object references
      expect(context1).not.toBe(context2);

      // But hash-based comparison shows they're equal
      expect(generateContextId(context1)).toBe(generateContextId(context2));
      expect(areContextsEqual(context1, context2)).toBe(true);
    });

    test('contexts with additional attributes generate different IDs', () => {
      const baseContext: LDContext = { kind: 'user', key: 'user-123' };
      const extendedContext: LDContext = { kind: 'user', key: 'user-123', name: 'Test User' };

      expect(generateContextId(baseContext)).not.toBe(generateContextId(extendedContext));
      expect(areContextsEqual(baseContext, extendedContext)).toBe(false);
    });

    test('multi-kind context can be identified and compared correctly', () => {
      const multiContext: LDMultiKindContext = {
        kind: 'multi',
        user: { key: 'user-123', name: 'Test User' },
        organization: { key: 'org-456', name: 'Test Org' },
      };

      expect(getContextKind(multiContext)).toBe('multi');
      expect(getContextKey(multiContext)).toBe('user-123');
      expect(getContextDisplayName(multiContext)).toBe('Test User');

      // Can be compared with itself
      expect(areContextsEqual(multiContext, multiContext)).toBe(true);

      // Different from single-kind context with same key
      const singleContext: LDContext = { kind: 'user', key: 'user-123', name: 'Test User' };
      expect(areContextsEqual(multiContext, singleContext)).toBe(false);
    });
  });
});

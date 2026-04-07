import { describe, it, expect } from 'vitest';
import {
  countLifecycleEligibleFlags,
  filterIndicesByLifecycle,
  passesFlagLifecycleFilter,
} from '../ui/Toolbar/components/new/FeatureFlags/flagLifecycleFilter';

describe('passesFlagLifecycleFilter', () => {
  const live = { archived: false, deprecated: false };
  const archivedOnly = { archived: true, deprecated: false };
  const deprecatedOnly = { archived: false, deprecated: true };
  const both = { archived: true, deprecated: true };

  it('excludes archived and deprecated when both includes are false (default)', () => {
    expect(passesFlagLifecycleFilter(live, false, false)).toBe(true);
    expect(passesFlagLifecycleFilter(archivedOnly, false, false)).toBe(false);
    expect(passesFlagLifecycleFilter(deprecatedOnly, false, false)).toBe(false);
    expect(passesFlagLifecycleFilter(both, false, false)).toBe(false);
  });

  it('includes archived when includeArchived is true', () => {
    expect(passesFlagLifecycleFilter(archivedOnly, false, true)).toBe(true);
    expect(passesFlagLifecycleFilter(deprecatedOnly, false, true)).toBe(false);
  });

  it('includes deprecated when includeDeprecated is true', () => {
    expect(passesFlagLifecycleFilter(deprecatedOnly, true, false)).toBe(true);
    expect(passesFlagLifecycleFilter(archivedOnly, true, false)).toBe(false);
  });

  it('includes both when both toggles are true', () => {
    expect(passesFlagLifecycleFilter(both, true, true)).toBe(true);
  });

  it('does not hide flags when archived/deprecated are loose non-booleans (only true excludes)', () => {
    expect(
      passesFlagLifecycleFilter({ archived: 'false' as unknown as boolean, deprecated: false }, false, false),
    ).toBe(true);
    expect(passesFlagLifecycleFilter({ archived: false, deprecated: 1 as unknown as boolean }, false, false)).toBe(
      true,
    );
  });
});

describe('countLifecycleEligibleFlags', () => {
  const flags = [
    { archived: false, deprecated: false },
    { archived: true, deprecated: false },
    { archived: false, deprecated: true },
  ];

  it('counts only live flags when both includes are false', () => {
    expect(countLifecycleEligibleFlags(flags, false, false)).toBe(1);
  });

  it('counts live + archived when includeArchived is true', () => {
    expect(countLifecycleEligibleFlags(flags, false, true)).toBe(2);
  });

  it('counts live + deprecated when includeDeprecated is true', () => {
    expect(countLifecycleEligibleFlags(flags, true, false)).toBe(2);
  });

  it('counts all when both toggles are true', () => {
    expect(countLifecycleEligibleFlags(flags, true, true)).toBe(3);
  });

  it('returns 0 for an empty array', () => {
    expect(countLifecycleEligibleFlags([], false, false)).toBe(0);
  });
});

describe('filterIndicesByLifecycle', () => {
  const flags = [
    { archived: false, deprecated: false },
    { archived: true, deprecated: false },
    { archived: false, deprecated: true },
  ];

  it('drops indices for archived/deprecated when includes are false', () => {
    expect(filterIndicesByLifecycle([0, 1, 2], flags, false, false)).toEqual([0]);
  });

  it('keeps archived index when includeArchived is true', () => {
    expect(filterIndicesByLifecycle([0, 1, 2], flags, false, true)).toEqual([0, 1]);
  });

  it('keeps deprecated index when includeDeprecated is true', () => {
    expect(filterIndicesByLifecycle([0, 1, 2], flags, true, false)).toEqual([0, 2]);
  });

  it('preserves all indices when both toggles are true', () => {
    expect(filterIndicesByLifecycle([0, 1, 2], flags, true, true)).toEqual([0, 1, 2]);
  });

  it('returns empty array when given empty indices', () => {
    expect(filterIndicesByLifecycle([], flags, false, false)).toEqual([]);
  });

  it('skips out-of-bounds indices', () => {
    expect(filterIndicesByLifecycle([0, 5, 99], flags, false, false)).toEqual([0]);
  });

  it('filters a subset of indices', () => {
    expect(filterIndicesByLifecycle([0, 2], flags, false, false)).toEqual([0]);
    expect(filterIndicesByLifecycle([1, 2], flags, true, true)).toEqual([1, 2]);
  });
});

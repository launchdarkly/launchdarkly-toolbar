import { describe, it, expect } from 'vitest';
import { passesFlagLifecycleFilter } from '../ui/Toolbar/components/new/FeatureFlags/flagLifecycleFilter';

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

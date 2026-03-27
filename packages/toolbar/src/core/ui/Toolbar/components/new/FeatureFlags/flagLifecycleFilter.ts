import type { NormalizedFlag } from './types';

/**
 * Returns whether a flag should appear given lifecycle preferences.
 * Default (both false): show only live flags (not archived, not deprecated).
 */
export function passesFlagLifecycleFilter(
  flag: Pick<NormalizedFlag, 'archived' | 'deprecated'>,
  includeDeprecated: boolean,
  includeArchived: boolean,
): boolean {
  // Only treat explicit boolean `true` as lifecycle-hidden. Loose truthy values (e.g. some API
  // payloads or corrupted local state) must not hide flags; SDK-only rows default to false.
  if (!includeArchived && flag.archived === true) {
    return false;
  }
  if (!includeDeprecated && flag.deprecated === true) {
    return false;
  }
  return true;
}

/** Counts flags that pass the current lifecycle filter (denominator for "X of Y flags"). */
export function countLifecycleEligibleFlags(
  flags: readonly Pick<NormalizedFlag, 'archived' | 'deprecated'>[],
  includeDeprecated: boolean,
  includeArchived: boolean,
): number {
  return flags.filter((f) => passesFlagLifecycleFilter(f, includeDeprecated, includeArchived)).length;
}

/** Keeps only indices whose flags pass the lifecycle filter. */
export function filterIndicesByLifecycle(
  indices: readonly number[],
  flagsByIndex: readonly Pick<NormalizedFlag, 'archived' | 'deprecated'>[],
  includeDeprecated: boolean,
  includeArchived: boolean,
): number[] {
  const out: number[] = [];
  for (const index of indices) {
    const flag = flagsByIndex[index];
    if (!flag) continue;
    if (!passesFlagLifecycleFilter(flag, includeDeprecated, includeArchived)) {
      continue;
    }
    out.push(index);
  }
  return out;
}

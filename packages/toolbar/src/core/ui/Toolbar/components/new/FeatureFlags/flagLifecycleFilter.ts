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

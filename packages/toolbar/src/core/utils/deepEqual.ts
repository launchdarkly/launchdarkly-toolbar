/**
 * Performs deep equality comparison for complex values including objects and arrays.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns true if values are deeply equal, false otherwise
 */
export function deepEqual(a: any, b: any): boolean {
  // Handle identical references or primitive equality
  if (a === b) return true;

  // Handle null/undefined cases
  if (a == null || b == null) return false;

  // Types must match
  if (typeof a !== typeof b) return false;

  // Handle objects (including arrays)
  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    // Must have same number of keys
    if (keysA.length !== keysB.length) return false;

    // Recursively check each key-value pair
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  // For primitives, use strict equality
  return a === b;
}

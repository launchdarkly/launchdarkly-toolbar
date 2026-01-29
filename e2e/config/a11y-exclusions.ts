/**
 * Accessibility Exclusions Configuration
 *
 * This file documents known accessibility issues that are temporarily excluded
 * from automated testing. Each exclusion should include:
 * - selector: CSS selector or rule ID to exclude
 * - reason: Why this is excluded
 * - ticket: Tracking ticket for resolution (if temporary)
 * - permanent: Whether this is a permanent exclusion (e.g., third-party components)
 */

export interface A11yExclusion {
  selector?: string;
  ruleId?: string;
  reason: string;
  ticket?: string;
  permanent?: boolean;
}

/**
 * Third-party component exclusions
 * These are permanently excluded as we don't control their implementation
 */
export const THIRD_PARTY_EXCLUSIONS: A11yExclusion[] = [
  {
    selector: '.cm-editor',
    reason: 'CodeMirror editor is a third-party component with its own accessibility handling',
    permanent: true,
  },
];

/**
 * Temporary exclusions for known issues being tracked
 * These should be resolved and removed when the underlying issues are fixed
 */
export const TEMPORARY_EXCLUSIONS: A11yExclusion[] = [];

/**
 * Get all excluded selectors for use with axe-core exclude()
 */
export function getExcludedSelectors(): string[] {
  return [
    ...THIRD_PARTY_EXCLUSIONS.filter((e) => e.selector).map((e) => e.selector!),
    ...TEMPORARY_EXCLUSIONS.filter((e) => e.selector).map((e) => e.selector!),
  ];
}

/**
 * Get all excluded rule IDs for use with axe-core disableRules()
 */
export function getDisabledRules(): string[] {
  return [
    ...THIRD_PARTY_EXCLUSIONS.filter((e) => e.ruleId).map((e) => e.ruleId!),
    ...TEMPORARY_EXCLUSIONS.filter((e) => e.ruleId).map((e) => e.ruleId!),
  ];
}

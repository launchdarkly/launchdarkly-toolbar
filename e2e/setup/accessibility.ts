import { test as base, expect } from '@playwright/test';
import type { TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { getDisabledRules, getExcludedSelectors } from '../config/a11y-exclusions';
import { mockFeatureFlags } from '../mocks/mockFeatureFlags';

/**
 * WCAG 2.1 AA compliance tags for axe-core
 */
const WCAG_21_AA_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const EXCLUDED_SELECTORS = getExcludedSelectors();
const DISABLED_RULES = getDisabledRules();

/**
 * The toolbar DOM ID used to locate the shadow host
 */
const TOOLBAR_HOST_ID = 'ld-toolbar';

/**
 * Extended test fixture that provides axe-core accessibility testing capabilities.
 *
 * Note: The LaunchDarkly Toolbar renders inside a Shadow DOM, so we need to
 * use a special approach to scan it with axe-core. We scan the shadow root
 * content by targeting the shadow host element using nested include arrays.
 */
export const test = base.extend<{
  makeAxeBuilder: () => AxeBuilder;
  makeToolbarAxeBuilder: () => Promise<AxeBuilder>;
}>({
  page: async ({ page }, use) => {
    await mockFeatureFlags(page);
    await use(page);
  },
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        .withTags(WCAG_21_AA_TAGS)
        .exclude(EXCLUDED_SELECTORS)
        .disableRules(DISABLED_RULES);

    await use(makeAxeBuilder);
  },
  /**
   * Creates an AxeBuilder configured to scan the toolbar's shadow DOM content.
   * The toolbar is rendered inside a shadow root attached to #ld-toolbar.
   *
   * Note: The toolbar host element has 0x0 dimensions by design (the actual
   * visible content is inside the shadow DOM), so we use state: 'attached'
   * instead of waiting for visibility.
   */
  makeToolbarAxeBuilder: async ({ page }, use) => {
    const makeToolbarAxeBuilder = async () => {
      // Wait for the toolbar shadow host to exist (it's 0x0 so we check 'attached' not 'visible')
      await page.waitForSelector(`#${TOOLBAR_HOST_ID}`, { state: 'attached', timeout: 10000 });

      // axe-core automatically scans shadow DOM content when given the shadow host.
      // We include the shadow host element, and axe will scan its shadow root.
      return new AxeBuilder({ page })
        .withTags(WCAG_21_AA_TAGS)
        .include(`#${TOOLBAR_HOST_ID}`)
        .exclude(EXCLUDED_SELECTORS)
        .disableRules(DISABLED_RULES);
    };

    await use(makeToolbarAxeBuilder);
  },
});

export { expect };

/**
 * Formats axe-core violations into a readable string for test output
 */
export function formatViolations(
  violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'],
): string {
  if (violations.length === 0) {
    return 'No violations found';
  }

  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => {
          const target = node.target.join(', ');
          const failureSummary = node.failureSummary || 'No fix suggestion available';
          return `    - Target: ${target}\n      Fix: ${failureSummary}`;
        })
        .join('\n');

      return `
[${violation.impact?.toUpperCase() || 'UNKNOWN'}] ${violation.id}: ${violation.help}
  Description: ${violation.description}
  Help URL: ${violation.helpUrl}
  Affected nodes:
${nodes}`;
    })
    .join('\n');
}

/**
 * Runs an accessibility scan and attaches results to the test report.
 * Throws an assertion error if violations are found.
 */
export async function expectNoViolations(
  axeBuilder: AxeBuilder,
  testInfo: TestInfo,
): Promise<void> {
  const results = await axeBuilder.analyze();

  // Attach scan results to test report for debugging
  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(
      {
        violations: results.violations,
        passes: results.passes.length,
        incomplete: results.incomplete.length,
        inapplicable: results.inapplicable.length,
      },
      null,
      2,
    ),
    contentType: 'application/json',
  });

  // Assert no violations
  expect(
    results.violations,
    `Accessibility violations found:\n${formatViolations(results.violations)}`,
  ).toHaveLength(0);
}

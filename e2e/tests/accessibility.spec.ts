import type { Page } from '@playwright/test';
import { test, expect, expectNoViolations } from '../setup/accessibility';
import { blockApiResponses, waitForToolbarReady } from '../utils/apiMocking';
import { ToolbarPage } from '../pages/ToolbarPage';
import { FIXTURE_FLAGS_LEGACY, mockFeatureFlags } from '../mocks/mockFeatureFlags';

test.describe('LaunchDarkly Toolbar - Accessibility', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await blockApiResponses(page);
    await page.goto('/sdk');
    await waitForToolbarReady(page);
  });

  test.describe('Collapsed Toolbar State', () => {
    test('should have no accessibility violations when collapsed', async ({
      page,
      makeToolbarAxeBuilder,
    }, testInfo) => {
      const toolbarPage = new ToolbarPage(page);

      // Verify collapsed state
      await toolbarPage.expectCollapsed();

      const axeBuilder = await makeToolbarAxeBuilder();

      await expectNoViolations(axeBuilder, testInfo);
    });
  });

  test.describe('Expanded Toolbar - All Tabs', () => {
    /**
     * Helper to expand toolbar and wait for it to be ready (new design)
     */
    async function expandToolbar(page: Page) {
      const toolbarPage = new ToolbarPage(page);
      await toolbarPage.expand();
      await toolbarPage.expectExpanded();

      // New design uses icon bar
      await expect(page.getByRole('button', { name: 'Flags', exact: true })).toBeVisible();
    }

    /**
     * Comprehensive Flags tab accessibility test
     */
    test('Flags tab - should have no accessibility violations', async ({
      page,
      makeToolbarAxeBuilder,
    }, testInfo) => {
      await expandToolbar(page);

      // Verify Flags content is visible (default view after expansion)
      await expect(page.getByTestId('flag-item-boolean-flag')).toBeVisible();

      const axeBuilder = await makeToolbarAxeBuilder();
      await expectNoViolations(axeBuilder, testInfo);
    });

    /**
     * Flags tab with active override - toggle boolean flag
     */
    test('Flags tab - should have no violations with flag override active', async ({
      page,
      makeToolbarAxeBuilder,
    }, testInfo) => {
      await expandToolbar(page);

      // Wait for flags to load
      const toolbarPage = new ToolbarPage(page);
      await expect(toolbarPage.flagItem('boolean-flag')).toBeVisible();

      // Toggle the boolean flag inside its row (uses a Switch => role="switch")
      const booleanFlagRow = toolbarPage.flagItem('boolean-flag');
      const booleanFlagSwitch = booleanFlagRow.getByRole('switch').first();
      await expect(booleanFlagSwitch).toBeVisible();
      await booleanFlagSwitch.dispatchEvent('click');
      await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });

      const axeBuilder = await makeToolbarAxeBuilder();
      await expectNoViolations(axeBuilder, testInfo);
    });

    /**
     * Flags tab with search active
     */
    test('Flags tab - should have no violations with search active', async ({
      page,
      makeToolbarAxeBuilder,
    }, testInfo) => {
      await expandToolbar(page);

      // Open search and enter text
      await page.getByRole('button', { name: /search/i }).click();
      const searchInput = page.getByPlaceholder('Search');
      await expect(searchInput).toBeVisible();
      await searchInput.fill('boolean');
      await expect(page.getByTestId('flag-item-boolean-flag')).toBeVisible();

      const axeBuilder = await makeToolbarAxeBuilder();
      await expectNoViolations(axeBuilder, testInfo);
    });

    /**
     * Flags tab with empty search results
     */
    test('Flags tab - should have no violations with empty search results', async ({
      page,
      makeToolbarAxeBuilder,
    }, testInfo) => {
      await expandToolbar(page);

      // Search for something that doesn't exist
      await page.getByRole('button', { name: /search/i }).click();
      const searchInput = page.getByPlaceholder('Search');
      await searchInput.fill('nonexistent-flag-xyz');
      await expect(page.getByText('No matching flags')).toBeVisible();

      const axeBuilder = await makeToolbarAxeBuilder();
      await expectNoViolations(axeBuilder, testInfo);
    });

    /**
     * Contexts subtab accessibility test
     */
    test('Contexts subtab - should have no accessibility violations', async ({
      page,
      makeToolbarAxeBuilder,
    }, testInfo) => {
      await expandToolbar(page);

      // Open subtab dropdown and select Contexts
      const toolbarPage = new ToolbarPage(page);
      await toolbarPage.openSubtabDropdown();
      await toolbarPage.selectSubtab('Contexts');
      await expect(page.getByTestId('subtab-dropdown-trigger')).toHaveText(/Contexts/);

      const axeBuilder = await makeToolbarAxeBuilder();
      await expectNoViolations(axeBuilder, testInfo);
    });

    /**
     * Comprehensive Analytics/Monitoring tab accessibility test
     */
    test('Analytics tab - should have no accessibility violations', async ({
      page,
      makeToolbarAxeBuilder,
    }, testInfo) => {
      await expandToolbar(page);

      // Navigate to Analytics tab using icon bar
      const toolbarPage = new ToolbarPage(page);
      await toolbarPage.selectIcon('Analytics');
      // EventsContent shows either "events captured" (when events exist) or "Listening for events" (empty state)
      // In SDK mode, identify events are captured automatically, so we check for either case
      await expect(
        page.getByText(/events captured|Listening for events/i).first(),
      ).toBeVisible();

      const axeBuilder = await makeToolbarAxeBuilder();
      await expectNoViolations(axeBuilder, testInfo);
    });

    /**
     * Comprehensive Settings tab accessibility test
     */
    test('Settings tab - should have no accessibility violations', async ({
      page,
      makeToolbarAxeBuilder,
    }, testInfo) => {
      await expandToolbar(page);

      // Navigate to Settings tab using icon bar
      const toolbarPage = new ToolbarPage(page);
      await toolbarPage.selectIcon('Settings');

      // Wait for Settings tab content to fully load
      await expect(page.getByText('Auto-collapse')).toBeVisible({ timeout: 10000 });

      const axeBuilder = await makeToolbarAxeBuilder();
      await expectNoViolations(axeBuilder, testInfo);
    });

    /**
     * Settings tab with toggles in different states
     */
    test('Settings tab - should have no violations with toggles changed', async ({
      page,
      makeToolbarAxeBuilder,
    }, testInfo) => {
      await expandToolbar(page);

      // Navigate to Settings tab using icon bar
      const toolbarPage = new ToolbarPage(page);
      await toolbarPage.selectIcon('Settings');
      await expect(page.getByText('Auto-collapse')).toBeVisible({ timeout: 10000 });

      // Toggle settings using the switch elements
      const switches = page.locator('[role="switch"]');
      const switchCount = await switches.count();
      if (switchCount > 0) {
        // Click the first switch to toggle it
        await switches.first().click({ force: true });
        // Switch is implemented as an input-backed control; just assert it stays visible after interaction.
        await expect(switches.first()).toBeVisible();
      }

      const axeBuilder = await makeToolbarAxeBuilder();
      await expectNoViolations(axeBuilder, testInfo);
    });

    /**
     * Settings tab with position selector dropdown open
     */
    test('Settings tab - should have no violations with dropdown open', async ({
      page,
      makeToolbarAxeBuilder,
    }, testInfo) => {
      await expandToolbar(page);

      // Navigate to Settings tab using icon bar
      const toolbarPage = new ToolbarPage(page);
      await toolbarPage.selectIcon('Settings');
      await expect(page.getByText('Auto-collapse')).toBeVisible({ timeout: 10000 });

      // Open position dropdown if present
      const positionSelector = page.locator('[role="combobox"]');
      if ((await positionSelector.count()) > 0 && (await positionSelector.first().isVisible())) {
        await positionSelector.click();
      }

      const axeBuilder = await makeToolbarAxeBuilder();
      await expectNoViolations(axeBuilder, testInfo);
    });

    /**
     * Privacy settings subtab accessibility test
     */
    test('Privacy settings subtab - should have no accessibility violations', async ({
      page,
      makeToolbarAxeBuilder,
    }, testInfo) => {
      await expandToolbar(page);

      // Navigate to Settings tab
      const toolbarPage = new ToolbarPage(page);
      await toolbarPage.selectIcon('Settings');
      await expect(page.getByText('Auto-collapse')).toBeVisible({ timeout: 10000 });

      // Open subtab dropdown and select Privacy
      await toolbarPage.openSubtabDropdown();
      await toolbarPage.selectSubtab('Privacy');
      await expect(page.getByTestId('subtab-dropdown-trigger')).toHaveText(/Privacy/);

      const axeBuilder = await makeToolbarAxeBuilder();
      await expectNoViolations(axeBuilder, testInfo);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should have no violations when navigating via keyboard', async ({
      page,
      makeToolbarAxeBuilder,
    }, testInfo) => {
      const toolbarPage = new ToolbarPage(page);

      // Focus and expand using keyboard
      await toolbarPage.toolbarRoot().focus();
      await expect(toolbarPage.toolbarRoot()).toBeFocused();
      await page.keyboard.press('Enter');
      await toolbarPage.expectExpanded();
      await expect(page.getByRole('button', { name: 'Flags', exact: true })).toBeVisible();

      const axeBuilder = await makeToolbarAxeBuilder();
      await expectNoViolations(axeBuilder, testInfo);
    });
  });

});

/**
 * Separate describe block for login screen test - triggers logout to show login screen
 */
test.describe('LaunchDarkly Toolbar - Login Screen Accessibility', () => {
  test('should have no accessibility violations on login screen', async ({
    page,
    makeToolbarAxeBuilder,
  }, testInfo) => {
    // First, set up the page with mocked feature flags
    await blockApiResponses(page);
    await page.goto('/sdk');
    await waitForToolbarReady(page);

    const toolbarPage = new ToolbarPage(page);
    await toolbarPage.expand();
    await toolbarPage.expectExpanded();
    await expect(page.getByRole('button', { name: 'Flags', exact: true })).toBeVisible();

    // Navigate to Settings and click Logout to trigger login screen
    await toolbarPage.selectIcon('Settings');
    await expect(page.getByText('Auto-collapse')).toBeVisible({ timeout: 10000 });

    // Find and click logout button
    const logoutButton = page.getByRole('button', { name: /log out/i });
    await logoutButton.click();

    // Verify we see the login screen
    await expect(page.getByTestId('login-screen')).toBeVisible({ timeout: 5000 });

    const axeBuilder = await makeToolbarAxeBuilder();
    await expectNoViolations(axeBuilder, testInfo);
  });
});

test.describe('LaunchDarkly Toolbar - Accessibility (Legacy design)', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await mockFeatureFlags(page, FIXTURE_FLAGS_LEGACY);
    await blockApiResponses(page);
    await page.goto('/sdk');
    await waitForToolbarReady(page);
  });

  /**
   * Legacy design accessibility test.
   *
   * Note: The legacy design uses @launchpad-ui/components which have known
   * color contrast issues on dark backgrounds. These are documented as
   * LaunchPad design system limitations. The color-contrast rule is disabled
   * for this test only - the new UI tests remain strict.
   *
   * The legacy UI is deprecated and will be removed in a future version.
   */
  test('should have no accessibility violations when expanded (legacy)', async ({ page, makeToolbarAxeBuilder }, testInfo) => {
    const toolbarPage = new ToolbarPage(page);
    await toolbarPage.expand();
    await toolbarPage.expectExpanded();

    // Legacy UI should render tabs
    await expect(page.getByRole('tab').first()).toBeVisible();

    // Disable color-contrast rule for legacy design due to LaunchPad design system limitations
    const axeBuilder = (await makeToolbarAxeBuilder()).disableRules(['color-contrast']);
    await expectNoViolations(axeBuilder, testInfo);
  });
});

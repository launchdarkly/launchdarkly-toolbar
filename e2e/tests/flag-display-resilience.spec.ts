import { expect, type Page } from '@playwright/test';
import { test } from '../setup/global';
import { blockApiResponses, delayApiResponses, waitForToolbarReady } from '../utils/apiMocking';

/**
 * E2E tests for flag display resilience
 *
 * These tests verify that flags display correctly from the LD client or dev server
 * even when API data is delayed or unavailable.
 *
 * Key behaviors tested:
 * 1. Flags display immediately when toolbar opens
 * 2. Flag names are shown (either from API or formatted from keys)
 * 3. All flag operations work regardless of API status
 * 4. Search and filtering work with displayed flag names
 *
 * Note: These tests rely on flags from the LD SDK client, not the API iframe.
 * The iframe API only provides flag name enhancements.
 */

test.describe('LaunchDarkly Toolbar - Flag Display Resilience', () => {
  test.describe('SDK Mode - Flag Display and Interaction', () => {
    test('should display all flags immediately when toolbar opens', async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-sdk-tab-content"]', { state: 'visible' });

      // Wait for flags to load from LD client
      await page.waitForTimeout(1500);

      // Flags should be visible with formatted names (from keys or API)
      await expect(page.getByText('Boolean Flag')).toBeVisible({ timeout: 2000 });
      await expect(page.getByText('String Flag')).toBeVisible();
      await expect(page.getByText('Number Flag')).toBeVisible();
      await expect(page.getByText('JSON Object Flag')).toBeVisible();
    });

    test('should allow flag overrides to work immediately', async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-sdk-tab-content"]', { state: 'visible' });

      // Wait for flags to load
      await page.waitForTimeout(1500);

      // Verify flag controls are interactive
      const booleanSwitch = page.getByTestId('flag-switch-boolean-flag');
      await expect(booleanSwitch).toBeVisible({ timeout: 2000 });
      await expect(booleanSwitch).toBeEnabled();

      // Test override functionality
      await expect(booleanSwitch).not.toBeChecked();
      await booleanSwitch.click();
      await expect(booleanSwitch).toBeChecked();

      // Verify override indicator appears
      await expect(page.getByTestId('flag-row-boolean-flag').getByTestId('override-indicator')).toBeVisible();
    });

    test('should support search functionality with displayed flag names', async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-sdk-tab-content"]', { state: 'visible' });

      // Wait for flags to be visible
      await page.waitForTimeout(1500);
      await expect(page.getByText('Boolean Flag')).toBeVisible({ timeout: 2000 });

      // Click the search button to show the search input
      await page.getByRole('button', { name: 'Search' }).click();

      // Test search with flag name
      const searchInput = page.getByPlaceholder('Search');
      await searchInput.fill('boolean');

      // Should find the flag
      await expect(page.getByText('Boolean Flag')).toBeVisible();
      await expect(page.getByText('String Flag')).not.toBeVisible();

      // Clear and search by partial name
      await searchInput.clear();
      await searchInput.fill('flag');

      // All flags should be visible (they all contain "flag")
      await expect(page.getByText('Boolean Flag')).toBeVisible();
      await expect(page.getByText('String Flag')).toBeVisible();
      await expect(page.getByText('Number Flag')).toBeVisible();
    });

    test('should display correct flag types and values', async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-sdk-tab-content"]', { state: 'visible' });

      // Wait for flags to load
      await page.waitForTimeout(1500);

      // Verify different flag types display correctly
      await expect(page.getByTestId('flag-switch-boolean-flag')).toBeVisible({ timeout: 2000 });

      // String flag with value display
      const stringValue = page.getByTestId('flag-value-string-flag');
      await expect(stringValue).toBeVisible();
      await expect(stringValue).toHaveText('default-string-value');

      // Number flag with value display
      const numberValue = page.getByTestId('flag-value-number-flag');
      await expect(numberValue).toBeVisible();
      await expect(numberValue).toHaveText('42');
    });

    test('should display flags even if API completely fails', async ({ page }: { page: Page }) => {
      // Block API responses to simulate complete failure (but allow authentication)
      await blockApiResponses(page);

      await page.goto('/sdk');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-sdk-tab-content"]', { state: 'visible' });

      // Wait for flags to load from LD client
      await page.waitForTimeout(1500);

      // Flags should still display with formatted names from keys
      await expect(page.getByText('Boolean Flag')).toBeVisible({ timeout: 2000 });
      await expect(page.getByText('String Flag')).toBeVisible();
      await expect(page.getByText('Number Flag')).toBeVisible();
    });

    test('should handle API delay gracefully', async ({ page }: { page: Page }) => {
      // Delay API responses by 3 seconds (but allow authentication)
      await delayApiResponses(page, 3000);

      await page.goto('/sdk');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-sdk-tab-content"]', { state: 'visible' });

      // Flags should display with formatted names before API responds
      await expect(page.getByText('Boolean Flag')).toBeVisible({ timeout: 2000 });

      // Wait for API delay to complete
      await page.waitForTimeout(3500);

      // Flag should remain visible after API delay
      await expect(page.getByText('Boolean Flag')).toBeVisible();
    });
  });

  test.describe('Dev Server Mode - Flag Display and Interaction', () => {
    const TEST_PROJECT_KEY = 'test-project';

    test.beforeEach(async ({ page }: { page: Page }) => {
      await page.route(`**/dev/projects`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([TEST_PROJECT_KEY]),
        });
      });

      await page.route(`**/dev/projects/test-project?**`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            _lastSyncedFromSource: Date.now(),
            availableVariations: {
              'my-feature-flag': [
                { _id: 'option-1', value: true },
                { _id: 'option-2', value: false },
              ],
              'another-cool-feature': [
                { _id: 'option-1', value: true },
                { _id: 'option-2', value: false },
              ],
            },
            context: {
              kind: 'user',
              key: 'dev-environment',
            },
            flagsState: {
              'my-feature-flag': { value: true, version: 1 },
              'another-cool-feature': { value: false, version: 1 },
              'string-feature': { value: 'enabled', version: 1 },
            },
            overrides: {},
            sourceEnvironmentKey: 'test',
          }),
        });
      });
    });

    test('should display all dev server flags immediately', async ({ page }: { page: Page }) => {
      await page.goto('/dev-server');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-dev-server-tab-content"]', { state: 'visible' });

      // Wait for flags to load
      await page.waitForTimeout(1500);

      // Flags should be visible with formatted names
      await expect(page.getByText('My Feature Flag')).toBeVisible({ timeout: 2000 });
      await expect(page.getByText('Another Cool Feature')).toBeVisible();
      await expect(page.getByText('String Feature')).toBeVisible();
    });

    test('should display flag controls immediately in dev server mode', async ({ page }: { page: Page }) => {
      await page.goto('/dev-server');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-dev-server-tab-content"]', { state: 'visible' });

      // Wait for flags
      await page.waitForTimeout(1500);
      await expect(page.getByText('My Feature Flag')).toBeVisible({ timeout: 2000 });

      // Verify flag controls are available and interactive
      const flagSwitch = page.getByRole('switch').first();
      await expect(flagSwitch).toBeVisible();
      await expect(flagSwitch).toBeEnabled();

      // Verify multiple flag switches are present (one per boolean flag)
      const allSwitches = page.getByRole('switch');
      await expect(await allSwitches.count()).toBeGreaterThan(0);
    });

    test('should support filtering with formatted flag names', async ({ page }: { page: Page }) => {
      await page.goto('/dev-server');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-dev-server-tab-content"]', { state: 'visible' });

      // Wait for flags
      await page.waitForTimeout(1500);
      await expect(page.getByText('My Feature Flag')).toBeVisible({ timeout: 2000 });

      // Click the search button to show the search input
      await page.getByRole('button', { name: 'Search' }).click();

      // Test search with formatted name
      const searchInput = page.getByPlaceholder('Search');
      await searchInput.fill('cool');

      // Should find flag with "cool" in name
      await expect(page.getByText('Another Cool Feature')).toBeVisible();
      await expect(page.getByText('My Feature Flag')).not.toBeVisible();
    });
  });

  test.describe('Cross-Mode - Flag Name Formatting', () => {
    test('should format flag keys consistently across modes', async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await waitForToolbarReady(page);

      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-sdk-tab-content"]', { state: 'visible' });

      // Wait for flags to load
      await page.waitForTimeout(1500);

      // Verify formatted names (kebab-case -> Title Case)
      await expect(page.getByText('Boolean Flag')).toBeVisible({ timeout: 2000 });
      await expect(page.getByText('String Flag')).toBeVisible();
    });
  });

  test.describe('Performance - Fast Flag Display', () => {
    test('flags should appear within 3 seconds of opening toolbar', async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await waitForToolbarReady(page);

      const startTime = Date.now();

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-sdk-tab-content"]', { state: 'visible' });

      // Flags should be visible
      await expect(page.getByText('Boolean Flag')).toBeVisible({ timeout: 3000 });

      const endTime = Date.now();
      const displayTime = endTime - startTime;

      // Verify flags displayed quickly
      expect(displayTime).toBeLessThan(3000);
    });
  });
});

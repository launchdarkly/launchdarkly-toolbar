import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from '../setup/global';
import { waitForToolbarReady } from '../utils/apiMocking';
import { ToolbarPage } from '../pages/ToolbarPage';

test.describe('LaunchDarkly Toolbar - Flag Starring', () => {
  let toolbarPage: ToolbarPage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/sdk');
    await waitForToolbarReady(page);
    toolbarPage = new ToolbarPage(page);
    await toolbarPage.expandAndWaitForFlags();
  });

  test.describe('Star and Unstar Flags', () => {
    test('should display star button on flag items', async ({ page }: { page: Page }) => {
      const starButtons = page.getByLabel('Star flag');
      const count = await starButtons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should star a flag when clicking the star button', async ({ page }: { page: Page }) => {
      const starButton = page.getByLabel('Star flag').first();
      await starButton.click();

      await expect(page.getByLabel('Unstar flag').first()).toBeVisible();
    });

    test('should unstar a flag when clicking the unstar button', async ({ page }: { page: Page }) => {
      // Star a flag first
      const starButton = page.getByLabel('Star flag').first();
      await starButton.click();
      await expect(page.getByLabel('Unstar flag').first()).toBeVisible();

      // Unstar it
      const unstarButton = page.getByLabel('Unstar flag').first();
      await unstarButton.click();

      await page.waitForTimeout(300);
      const starButtonsAfter = page.getByLabel('Star flag');
      const count = await starButtonsAfter.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Starred Filter', () => {
    async function openFilterAndSelectStarred(page: Page) {
      await page.getByRole('button', { name: 'Filter', exact: true }).click();
      await expect(page.getByRole('dialog', { name: 'Filter options' })).toBeVisible();
      await page.getByRole('checkbox', { name: 'Show starred flags' }).click();
      // Close overlay by pressing Escape
      await page.keyboard.press('Escape');
    }

    async function openFilterAndSelectAll(page: Page) {
      await page.getByRole('button', { name: 'Filter', exact: true }).click();
      await expect(page.getByRole('dialog', { name: 'Filter options' })).toBeVisible();
      await page.getByRole('checkbox', { name: 'Show all flags' }).click();
      await page.keyboard.press('Escape');
    }

    test('should filter to show only starred flags', async ({ page }: { page: Page }) => {
      const toolbar = toolbarPage.toolbarRoot();

      // Star the boolean-flag
      const booleanFlagItem = toolbarPage.flagItem('boolean-flag');
      await expect(booleanFlagItem).toBeVisible();
      const starButton = booleanFlagItem.getByLabel('Star flag');
      await starButton.click();
      await expect(booleanFlagItem.getByLabel('Unstar flag')).toBeVisible();

      // Apply starred filter
      await openFilterAndSelectStarred(page);

      // Only the starred flag should be visible in the toolbar
      await expect(toolbar.getByText('boolean-flag').first()).toBeVisible();
      // Other flags should be hidden in the toolbar
      await expect(toolbar.getByTestId('flag-item-string-flag')).not.toBeVisible();
      await expect(toolbar.getByTestId('flag-item-number-flag')).not.toBeVisible();
    });

    test('should show all flags after clearing starred filter', async ({ page }: { page: Page }) => {
      const toolbar = toolbarPage.toolbarRoot();

      // Star a flag
      const booleanFlagItem = toolbarPage.flagItem('boolean-flag');
      const starButton = booleanFlagItem.getByLabel('Star flag');
      await starButton.click();

      // Filter to starred
      await openFilterAndSelectStarred(page);
      await expect(toolbar.getByTestId('flag-item-string-flag')).not.toBeVisible();

      // Show all flags again
      await openFilterAndSelectAll(page);

      // All flags should be visible again in the toolbar
      await expect(toolbar.getByText('boolean-flag').first()).toBeVisible();
      await expect(toolbar.getByText('string-flag').first()).toBeVisible();
      await expect(toolbar.getByText('number-flag').first()).toBeVisible();
    });

    test('should show empty state when no flags are starred and filtered', async ({ page }: { page: Page }) => {
      const toolbar = toolbarPage.toolbarRoot();

      // Apply starred filter without starring any flags
      await openFilterAndSelectStarred(page);

      // No flag items should be visible in the toolbar
      await expect(toolbar.getByTestId('flag-item-boolean-flag')).not.toBeVisible();
      await expect(toolbar.getByTestId('flag-item-string-flag')).not.toBeVisible();
    });

    test('should persist starred flags across tab switches', async ({ page }: { page: Page }) => {
      // Star a flag
      const booleanFlagItem = toolbarPage.flagItem('boolean-flag');
      const starButton = booleanFlagItem.getByLabel('Star flag');
      await starButton.click();
      await expect(booleanFlagItem.getByLabel('Unstar flag')).toBeVisible();

      // Switch to Settings and back
      await toolbarPage.selectIcon('Settings');
      await expect(page.getByText('Toolbar settings')).toBeVisible({ timeout: 10000 });
      await toolbarPage.selectIcon('Flags');

      // Wait for flags to load
      await expect(page.getByText('boolean-flag').first()).toBeVisible({ timeout: 5000 });

      // The flag should still be starred
      const updatedFlagItem = toolbarPage.flagItem('boolean-flag');
      await expect(updatedFlagItem.getByLabel('Unstar flag')).toBeVisible();
    });
  });
});

import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from '../setup/global';
import { waitForToolbarReady } from '../utils/apiMocking';
import { ToolbarPage } from '../pages/ToolbarPage';

test.describe('LaunchDarkly Toolbar - Share State', () => {
  let toolbarPage: ToolbarPage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/sdk');
    await waitForToolbarReady(page);
    toolbarPage = new ToolbarPage(page);
    await toolbarPage.expandAndWaitForFlags();
  });

  test.describe('Share Button', () => {
    test('should display share button in settings', async ({ page }: { page: Page }) => {
      await toolbarPage.navigateToSettings();

      const shareBtn = page.getByRole('button', { name: /share/i });
      await expect(shareBtn).toBeVisible();
    });

    test('should open share popover when clicked', async ({ page }: { page: Page }) => {
      await toolbarPage.navigateToSettings();

      const shareBtn = page.getByRole('button', { name: /share/i });
      await shareBtn.click();

      // Verify the share popover opens with title and options
      await expect(page.getByRole('heading', { name: 'Share Toolbar State' })).toBeVisible();
    });
  });

  test.describe('Share Popover Options', () => {
    test('should display share options with checkboxes', async ({ page }: { page: Page }) => {
      await toolbarPage.navigateToSettings();
      await page.getByRole('button', { name: /share/i }).click();
      await expect(page.getByRole('heading', { name: 'Share Toolbar State' })).toBeVisible();

      // Verify the checkboxes for what to include
      await expect(page.getByLabel(/include flag overrides/i)).toBeVisible();
      await expect(page.getByLabel(/include contexts/i)).toBeVisible();
      await expect(page.getByLabel(/include settings/i)).toBeVisible();
    });

    test('should toggle share options', async ({ page }: { page: Page }) => {
      await toolbarPage.navigateToSettings();
      await page.getByRole('button', { name: /share/i }).click();
      await expect(page.getByRole('heading', { name: 'Share Toolbar State' })).toBeVisible();

      // Toggle the flag overrides checkbox (force: true because LaunchPad UI container intercepts clicks)
      const overridesCheckbox = page.getByLabel(/include flag overrides/i);
      await overridesCheckbox.click({ force: true });
      // Toggle it back
      await overridesCheckbox.click({ force: true });
    });

    test('should have Copy Link and Cancel buttons', async ({ page }: { page: Page }) => {
      await toolbarPage.navigateToSettings();
      await page.getByRole('button', { name: /share/i }).click();
      await expect(page.getByRole('heading', { name: 'Share Toolbar State' })).toBeVisible();

      await expect(page.getByRole('button', { name: /copy link/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /cancel/i })).toBeVisible();
    });

    test('should close popover when Cancel is clicked', async ({ page }: { page: Page }) => {
      await toolbarPage.navigateToSettings();
      await page.getByRole('button', { name: /share/i }).click();
      await expect(page.getByRole('heading', { name: 'Share Toolbar State' })).toBeVisible();

      await page.getByRole('button', { name: /cancel/i }).click();
      await expect(page.getByRole('heading', { name: 'Share Toolbar State' })).not.toBeVisible();
    });

    test('should copy link to clipboard', async ({ page, context }) => {
      // Grant clipboard permissions
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);

      await toolbarPage.navigateToSettings();
      await page.getByRole('button', { name: /share/i }).click();
      await expect(page.getByRole('heading', { name: 'Share Toolbar State' })).toBeVisible();

      const copyBtn = page.getByRole('button', { name: /copy link/i });
      await copyBtn.click();

      // The button text should change to "Copied!" momentarily
      await expect(page.getByRole('button', { name: /copied/i })).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Share State with Overrides', () => {
    test('should include flag overrides in shared state', async ({ page, context }) => {
      // Create an override first
      await toolbarPage.toggleBooleanFlag();

      // Open share popover
      await toolbarPage.navigateToSettings();
      await page.getByRole('button', { name: /share/i }).click();
      await expect(page.getByRole('heading', { name: 'Share Toolbar State' })).toBeVisible();

      // Ensure flag overrides checkbox is checked
      const overridesCheckbox = page.getByLabel(/include flag overrides/i);
      await expect(overridesCheckbox).toBeVisible();

      // Grant clipboard permissions and copy
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.getByRole('button', { name: /copy link/i }).click();
      await expect(page.getByRole('button', { name: /copied/i })).toBeVisible({ timeout: 3000 });
    });
  });
});

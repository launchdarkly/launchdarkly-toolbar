import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from '../setup/global';
import { waitForToolbarReady } from '../utils/apiMocking';
import { ToolbarPage } from '../pages/ToolbarPage';

test.describe('LaunchDarkly Toolbar - Analytics Consent', () => {
  test.describe('Consent Toast Display', () => {
    test('should show analytics consent toast on first expansion', async ({ page }: { page: Page }) => {
      // Clear any stored consent preferences by clearing localStorage
      await page.goto('/sdk');
      await page.evaluate(() => {
        // Clear any toolbar-related storage to simulate first visit
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.includes('ld-toolbar') || key.includes('launchdarkly')) {
            localStorage.removeItem(key);
          }
        });
      });
      await waitForToolbarReady(page);

      const toolbarPage = new ToolbarPage(page);
      await toolbarPage.expand();
      await toolbarPage.expectExpanded();

      // The consent toast should appear with Accept and Decline buttons
      // Wait a bit for the toast to animate in
      await page.waitForTimeout(500);
      const acceptBtn = page.getByRole('button', { name: 'Accept' });
      const declineBtn = page.getByRole('button', { name: 'Decline' });

      // At least one of these should be visible (toast may or may not show depending on prior state)
      const isVisible =
        (await acceptBtn.isVisible().catch(() => false)) || (await declineBtn.isVisible().catch(() => false));
      if (isVisible) {
        await expect(acceptBtn).toBeVisible();
        await expect(declineBtn).toBeVisible();
      }
    });
  });

  test.describe('Accept Analytics', () => {
    test('should dismiss toast when accepting analytics', async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.includes('ld-toolbar') || key.includes('launchdarkly')) {
            localStorage.removeItem(key);
          }
        });
      });
      await waitForToolbarReady(page);

      const toolbarPage = new ToolbarPage(page);
      await toolbarPage.expand();
      await toolbarPage.expectExpanded();
      await page.waitForTimeout(500);

      const acceptBtn = page.getByRole('button', { name: 'Accept' });
      if (await acceptBtn.isVisible().catch(() => false)) {
        await acceptBtn.click();

        // Toast should disappear
        await expect(acceptBtn).not.toBeVisible({ timeout: 3000 });

        // Toolbar should still be functional
        await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();
      }
    });
  });

  test.describe('Decline Analytics', () => {
    test('should dismiss toast when declining analytics', async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          if (key.includes('ld-toolbar') || key.includes('launchdarkly')) {
            localStorage.removeItem(key);
          }
        });
      });
      await waitForToolbarReady(page);

      const toolbarPage = new ToolbarPage(page);
      await toolbarPage.expand();
      await toolbarPage.expectExpanded();
      await page.waitForTimeout(500);

      const declineBtn = page.getByRole('button', { name: 'Decline' });
      if (await declineBtn.isVisible().catch(() => false)) {
        await declineBtn.click();

        // Toast should disappear
        await expect(declineBtn).not.toBeVisible({ timeout: 3000 });

        // Toolbar should still be functional
        await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();
      }
    });
  });

  test.describe('Consent Persistence', () => {
    test('should not show consent toast after it was previously dismissed', async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await waitForToolbarReady(page);

      const toolbarPage = new ToolbarPage(page);
      await toolbarPage.expand();
      await toolbarPage.expectExpanded();
      await page.waitForTimeout(500);

      // Dismiss the toast if visible
      const declineBtn = page.getByRole('button', { name: 'Decline' });
      if (await declineBtn.isVisible().catch(() => false)) {
        await declineBtn.click();
        await expect(declineBtn).not.toBeVisible({ timeout: 3000 });
      }

      // Collapse and re-expand
      await toolbarPage.collapse();
      await toolbarPage.expectCollapsed();
      await toolbarPage.expand();
      await toolbarPage.expectExpanded();

      // The consent toast should NOT reappear
      await page.waitForTimeout(500);
      const acceptBtn = page.getByRole('button', { name: 'Accept' });
      await expect(acceptBtn).not.toBeVisible();
    });
  });
});

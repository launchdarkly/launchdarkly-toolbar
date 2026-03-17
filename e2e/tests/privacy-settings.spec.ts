import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from '../setup/global';
import { waitForToolbarReady } from '../utils/apiMocking';
import { ToolbarPage } from '../pages/ToolbarPage';

test.describe('LaunchDarkly Toolbar - Privacy Settings', () => {
  let toolbarPage: ToolbarPage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/sdk');
    await waitForToolbarReady(page);
    toolbarPage = new ToolbarPage(page);
    await toolbarPage.expand();
    await toolbarPage.expectExpanded();
    await toolbarPage.dismissAnalyticsPopup();
  });

  test.describe('Privacy Subtab Navigation', () => {
    test('should navigate to Privacy subtab from Settings', async ({ page }: { page: Page }) => {
      await toolbarPage.navigateToPrivacy();
      await expect(page.getByTestId('subtab-dropdown-trigger')).toHaveText(/Privacy/);
    });
  });

  test.describe('Analytics Toggles', () => {
    test('should display General analytics toggle', async ({ page }: { page: Page }) => {
      await toolbarPage.navigateToPrivacy();

      const generalAnalyticsSwitch = page.getByRole('switch', { name: /general analytics/i });
      await expect(generalAnalyticsSwitch).toBeVisible();
    });

    test('should display Enhanced analytics toggle when General analytics is on', async ({ page }: { page: Page }) => {
      await toolbarPage.navigateToPrivacy();

      // First ensure General analytics is enabled
      const generalAnalyticsSwitch = page.getByRole('switch', { name: /general analytics/i });
      await expect(generalAnalyticsSwitch).toBeVisible();

      const isChecked = await generalAnalyticsSwitch.isChecked();
      if (!isChecked) {
        await generalAnalyticsSwitch.click({ force: true });
      }

      // Now Enhanced analytics should be visible
      const enhancedAnalyticsSwitch = page.getByRole('switch', { name: /enhanced analytics/i });
      await expect(enhancedAnalyticsSwitch).toBeVisible();
    });

    test('should toggle General analytics on and off', async ({ page }: { page: Page }) => {
      await toolbarPage.navigateToPrivacy();

      const generalAnalyticsSwitch = page.getByRole('switch', { name: /general analytics/i });
      await expect(generalAnalyticsSwitch).toBeVisible();

      await generalAnalyticsSwitch.click({ force: true });
      await generalAnalyticsSwitch.click({ force: true });

      await expect(generalAnalyticsSwitch).toBeVisible();
    });

    test('should toggle Enhanced analytics on and off', async ({ page }: { page: Page }) => {
      await toolbarPage.navigateToPrivacy();

      // Ensure General analytics is enabled first
      const generalAnalyticsSwitch = page.getByRole('switch', { name: /general analytics/i });
      const isChecked = await generalAnalyticsSwitch.isChecked();
      if (!isChecked) {
        await generalAnalyticsSwitch.click({ force: true });
      }

      const enhancedAnalyticsSwitch = page.getByRole('switch', { name: /enhanced analytics/i });
      await expect(enhancedAnalyticsSwitch).toBeVisible();

      await enhancedAnalyticsSwitch.click({ force: true });
      await enhancedAnalyticsSwitch.click({ force: true });
      await expect(enhancedAnalyticsSwitch).toBeVisible();
    });
  });

  test.describe('Session Replay Toggle', () => {
    test('should display Session replay toggle when General analytics is on', async ({ page }: { page: Page }) => {
      await toolbarPage.navigateToPrivacy();

      // Ensure General analytics is enabled
      const generalAnalyticsSwitch = page.getByRole('switch', { name: /general analytics/i });
      const isChecked = await generalAnalyticsSwitch.isChecked();
      if (!isChecked) {
        await generalAnalyticsSwitch.click({ force: true });
      }

      const sessionReplaySwitch = page.getByRole('switch', { name: /session replay/i });
      await expect(sessionReplaySwitch).toBeVisible();
    });
  });

  test.describe('Privacy Settings Persistence', () => {
    test('should maintain privacy settings after tab switch', async ({ page }: { page: Page }) => {
      await toolbarPage.navigateToPrivacy();

      const generalAnalyticsSwitch = page.getByRole('switch', { name: /general analytics/i });
      await expect(generalAnalyticsSwitch).toBeVisible();
      const initialState = await generalAnalyticsSwitch.isChecked();
      await generalAnalyticsSwitch.click({ force: true });

      // Switch to a different tab and back
      await toolbarPage.selectIcon('Flags');
      await toolbarPage.navigateToPrivacy();

      const currentState = await generalAnalyticsSwitch.isChecked();
      expect(currentState).not.toBe(initialState);
    });
  });
});

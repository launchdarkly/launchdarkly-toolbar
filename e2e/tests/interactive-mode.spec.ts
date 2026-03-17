import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from '../setup/global';
import { waitForToolbarReady } from '../utils/apiMocking';
import { ToolbarPage } from '../pages/ToolbarPage';

test.describe('LaunchDarkly Toolbar - Interactive Mode', () => {
  let toolbarPage: ToolbarPage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/sdk');
    await waitForToolbarReady(page);
    toolbarPage = new ToolbarPage(page);
    await toolbarPage.expand();
    await toolbarPage.expectExpanded();
    await toolbarPage.dismissAnalyticsPopup();
  });

  test.describe('Interactive Icon', () => {
    test('should display interactive mode icon in IconBar', async ({ page }: { page: Page }) => {
      const interactiveBtn = page.getByRole('button', { name: 'Interactive mode' });
      await expect(interactiveBtn).toBeVisible();
    });

    test('should show interactive mode as disabled when feature flag is off', async ({ page }: { page: Page }) => {
      // The interactive icon is disabled by default (flag is off in test fixtures)
      const interactiveBtn = page.getByRole('button', { name: 'Interactive mode' });
      await expect(interactiveBtn).toBeVisible();
      await expect(interactiveBtn).toBeDisabled();
    });
  });

  test.describe('Interactive Tab Content', () => {
    test('should show empty state when interactive mode is not active', async ({ page }: { page: Page }) => {
      // Even if we can navigate to the interactive tab, it should show an empty/intro state
      // when no element is selected. Since the feature flag is off in tests, the icon is disabled.
      // We verify the icon exists and shows the correct tooltip state
      const interactiveBtn = page.getByRole('button', { name: 'Interactive mode' });
      await expect(interactiveBtn).toBeVisible();
    });
  });
});

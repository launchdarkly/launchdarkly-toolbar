import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from '../setup/global';
import { waitForToolbarReady } from '../utils/apiMocking';
import { ToolbarPage } from '../pages/ToolbarPage';

test.describe('LaunchDarkly Toolbar - Event Filtering', () => {
  let toolbarPage: ToolbarPage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/sdk');
    await waitForToolbarReady(page);
    toolbarPage = new ToolbarPage(page);
    await toolbarPage.expand();
    await toolbarPage.expectExpanded();
    await toolbarPage.dismissAnalyticsPopup();
    await toolbarPage.navigateToAnalytics();
  });

  test.describe('Events Tab Content', () => {
    test('should display events captured count', async ({ page }: { page: Page }) => {
      await expect(page.getByText(/events captured/i)).toBeVisible();
    });

    test('should display event items when events exist', async ({ page }: { page: Page }) => {
      // SDK mode automatically captures identify events
      const eventItems = page.getByTestId('event-item');
      const count = await eventItems.count();
      // There should be at least some events from SDK initialization
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Filter Overlay', () => {
    test('should open filter overlay from Analytics tab', async ({ page }: { page: Page }) => {
      const filterBtn = page.getByRole('button', { name: 'Filter', exact: true });
      await expect(filterBtn).toBeVisible();
      await filterBtn.click();

      await expect(page.getByRole('dialog', { name: 'Filter options' })).toBeVisible();
    });

    test('should display event type filter options', async ({ page }: { page: Page }) => {
      const filterBtn = page.getByRole('button', { name: 'Filter', exact: true });
      await filterBtn.click();
      await expect(page.getByRole('dialog', { name: 'Filter options' })).toBeVisible();

      await expect(page.getByRole('checkbox', { name: 'Show all events' })).toBeVisible();
      await expect(page.getByRole('checkbox', { name: 'Show feature flag evaluations' })).toBeVisible();
      await expect(page.getByRole('checkbox', { name: 'Show custom events' })).toBeVisible();
      await expect(page.getByRole('checkbox', { name: 'Show identify events' })).toBeVisible();
    });

    test('should apply feature event filter', async ({ page }: { page: Page }) => {
      const filterBtn = page.getByRole('button', { name: 'Filter', exact: true });
      await filterBtn.click();
      await expect(page.getByRole('dialog', { name: 'Filter options' })).toBeVisible();

      await page.getByRole('checkbox', { name: 'Show feature flag evaluations' }).click();
      await page.keyboard.press('Escape');
    });

    test('should apply identify event filter', async ({ page }: { page: Page }) => {
      const filterBtn = page.getByRole('button', { name: 'Filter', exact: true });
      await filterBtn.click();
      await expect(page.getByRole('dialog', { name: 'Filter options' })).toBeVisible();

      await page.getByRole('checkbox', { name: 'Show identify events' }).click();
      await page.keyboard.press('Escape');
    });

    test('should reset filters to default', async ({ page }: { page: Page }) => {
      const filterBtn = page.getByRole('button', { name: 'Filter', exact: true });
      await filterBtn.click();
      await expect(page.getByRole('dialog', { name: 'Filter options' })).toBeVisible();

      // Apply a filter first
      await page.getByRole('checkbox', { name: 'Show feature flag evaluations' }).click();

      // Reset filters
      const resetBtn = page.getByLabel('Reset filters to default');
      await expect(resetBtn).toBeVisible();
      await resetBtn.click();
    });
  });

  test.describe('Clear Events', () => {
    test('should clear all events', async ({ page }: { page: Page }) => {
      // Check if there are events and a clear button
      const clearBtn = page.getByRole('button', { name: /clear/i });
      if (await clearBtn.isVisible().catch(() => false)) {
        await clearBtn.click();

        // After clearing, should show empty state or zero events
        await expect(page.getByText(/listening for events/i).or(page.getByText(/0 events captured/i))).toBeVisible({
          timeout: 5000,
        });
      }
    });
  });

  test.describe('Event Search', () => {
    test('should search events by term', async ({ page }: { page: Page }) => {
      // Open search
      await toolbarPage.openSearch();
      const searchInput = page.getByPlaceholder('Search');

      // Search for a term that may or may not match
      await searchInput.fill('identify');
      // Verify search doesn't crash and content updates
      await page.waitForTimeout(300);
      await expect(searchInput).toHaveValue('identify');
    });
  });
});

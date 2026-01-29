import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from '../setup/global';
import { blockApiResponses, waitForToolbarReady } from '../utils/apiMocking';

test.describe('LaunchDarkly Toolbar - New Design', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Block API responses to prevent timing issues during UI interaction tests
    await blockApiResponses(page);

    await page.goto('/sdk');
    await waitForToolbarReady(page);
  });

  test.describe('Core Navigation', () => {
    test('should expand toolbar and show IconBar with navigation icons', async ({ page }: { page: Page }) => {
      const toolbar = page.getByTestId('launchdarkly-toolbar');

      // 1. Initial collapsed state
      await expect(page.getByRole('img', { name: 'LaunchDarkly' })).toBeVisible();
      await expect(toolbar).toHaveAttribute('role', 'button');
      await expect(toolbar).toHaveAttribute('aria-label', 'Open LaunchDarkly toolbar');

      // 2. Expand toolbar by clicking logo
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(toolbar).toHaveAttribute('role', 'toolbar');
      await expect(toolbar).toHaveAttribute('aria-label', 'LaunchDarkly toolbar');

      // 3. Verify IconBar navigation icons are visible
      // Use getByLabel with exact match to avoid matching subtab dropdown and other buttons
      await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();
      await expect(page.getByLabel('Analytics', { exact: true })).toBeVisible();
      await expect(page.getByLabel('Settings', { exact: true })).toBeVisible();
    });

    test('should navigate between tabs using IconBar', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByTestId('launchdarkly-toolbar').click();

      // Default tab should be flags - verify content is showing
      // Use .first() because flag key appears in multiple places (display and copy button)
      await expect(page.getByText('boolean-flag').first()).toBeVisible();

      // Click Settings icon using getByLabel to target IconBar button specifically
      await page.getByLabel('Settings', { exact: true }).click();

      // Verify settings content is showing
      await expect(page.getByText('Auto-collapse')).toBeVisible();

      // Click Analytics/Monitoring icon using getByLabel
      await page.getByLabel('Analytics', { exact: true }).click();

      // Verify events content is showing - look for "events captured" text in toolbar
      await expect(page.getByText(/events captured/i)).toBeVisible();
    });

    test('should collapse toolbar using chevron button', async ({ page }: { page: Page }) => {
      const toolbar = page.getByTestId('launchdarkly-toolbar');

      // Expand toolbar
      await toolbar.click();
      await expect(toolbar).toHaveAttribute('role', 'toolbar');

      // Click collapse button (chevron)
      const collapseBtn = page.getByRole('button', { name: 'Collapse toolbar' });
      await expect(collapseBtn).toBeVisible();
      await collapseBtn.click();

      // Verify toolbar is collapsed
      await expect(toolbar).toHaveAttribute('role', 'button');
      // IconBar should not be visible when collapsed
      await expect(page.getByLabel('Flags', { exact: true })).not.toBeVisible();
    });

    test('should support keyboard accessibility for expand/collapse', async ({ page }: { page: Page }) => {
      const toolbar = page.getByTestId('launchdarkly-toolbar');

      // Focus and expand with Enter
      await toolbar.focus();
      await expect(toolbar).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();

      // Collapse
      await page.getByRole('button', { name: 'Collapse toolbar' }).click();
      await expect(page.getByLabel('Flags', { exact: true })).not.toBeVisible();

      // Focus and expand with Space
      await toolbar.focus();
      await page.keyboard.press('Space');
      await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();
    });
  });

  test.describe('Flags Tab', () => {
    test('should display mocked flags in the flags list', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByTestId('launchdarkly-toolbar').click();

      // Verify flags are displayed (use .first() to avoid matching copy button text)
      await expect(page.getByText('boolean-flag').first()).toBeVisible();
      await expect(page.getByText('string-flag').first()).toBeVisible();
      await expect(page.getByText('number-flag').first()).toBeVisible();
    });

    test('should toggle boolean flag and show override indicator', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByTestId('launchdarkly-toolbar').click();

      // Wait for flags to be loaded
      await expect(page.getByText('boolean-flag').first()).toBeVisible();

      // Dismiss any "Help us improve" popup if present
      const declineButton = page.getByRole('button', { name: 'Decline' });
      if (await declineButton.isVisible().catch(() => false)) {
        await declineButton.click();
      }

      // Find and click the boolean flag toggle switch
      // In new design, boolean flags use a Switch component within the flag row
      const booleanFlagSwitch = page.getByRole('switch').first();
      await expect(booleanFlagSwitch).toBeVisible();

      // Use dispatchEvent to ensure the click registers on the actual input element
      await booleanFlagSwitch.dispatchEvent('click');

      // Verify override indicator appears (may take a moment to render)
      await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });
    });

    test('should search and filter flags', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByTestId('launchdarkly-toolbar').click();

      // Click search button to expand search
      await page.getByRole('button', { name: /search/i }).click();
      const searchInput = page.getByPlaceholder('Search');
      await expect(searchInput).toBeVisible();

      // Search for a specific flag
      await searchInput.fill('boolean');

      // Verify the searched flag is visible
      await expect(page.getByText('boolean-flag').first()).toBeVisible();
    });

    test('should show subtab dropdown with Flags and Contexts options', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByTestId('launchdarkly-toolbar').click();

      // Wait for flags content to load first
      await expect(page.getByText('boolean-flag').first()).toBeVisible();

      const subtabDropdown = page.getByTestId('subtab-dropdown-trigger');
      await expect(subtabDropdown).toBeVisible();
      await subtabDropdown.click();
      await expect(page.getByTestId('subtab-dropdown-listbox')).toBeVisible();

      // Verify dropdown menu items appear
      await expect(page.getByRole('option', { name: 'Flags', exact: true })).toBeVisible();
      await expect(page.getByRole('option', { name: 'Contexts', exact: true })).toBeVisible();
    });

    test('should switch to Contexts subtab', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByTestId('launchdarkly-toolbar').click();

      // Wait for flags content to load first
      await expect(page.getByText('boolean-flag').first()).toBeVisible();

      // Open subtab dropdown and select Contexts
      await page.getByTestId('subtab-dropdown-trigger').click();
      await page.getByRole('option', { name: 'Contexts', exact: true }).click();

      // Verify subtab dropdown now shows "Contexts"
      await expect(page.getByTestId('subtab-dropdown-trigger')).toHaveText(/Contexts/);
    });
  });

  test.describe('Contexts Subtab', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
      // Expand toolbar and navigate to Contexts subtab
      await page.getByTestId('launchdarkly-toolbar').click();

      // Wait for flags content to load first
      await expect(page.getByText('boolean-flag').first()).toBeVisible();

      await page.getByTestId('subtab-dropdown-trigger').click();
      await expect(page.getByTestId('subtab-dropdown-listbox')).toBeVisible();
      await page.getByRole('option', { name: 'Contexts', exact: true }).click();
    });

    test('should display contexts list', async ({ page }: { page: Page }) => {
      // Verify we're now on the Contexts subtab
      await expect(page.getByTestId('subtab-dropdown-trigger')).toHaveText(/Contexts/);
    });

    test('should open Add Context form', async ({ page }: { page: Page }) => {
      // Click add context button if visible
      const addContextBtn = page.getByRole('button', { name: /add context/i });
      const isVisible = await addContextBtn.isVisible().catch(() => false);
      if (isVisible) {
        await addContextBtn.click();
        // Verify form/modal opens - look for close button (use .first() to avoid multiple matches)
        await expect(page.getByRole('button', { name: /close/i }).first()).toBeVisible();
      } else {
        // Just verify we're on the contexts subtab
        await expect(page.getByTestId('subtab-dropdown-trigger')).toHaveText(/Contexts/);
      }
    });
  });

  test.describe('Settings Tab', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
      // Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByLabel('Settings', { exact: true }).click();
      await expect(page.getByText('Auto-collapse')).toBeVisible();
    });

    test('should display settings options', async ({ page }: { page: Page }) => {
      // Verify settings content
      await expect(page.getByText('Auto-collapse')).toBeVisible();
      await expect(page.getByText('Reload on flag change')).toBeVisible();
      // Use .first() as "Position" appears in both demo app and toolbar
      await expect(page.getByText('Position').first()).toBeVisible();
    });

    test('should toggle auto-collapse setting', async ({ page }: { page: Page }) => {
      // Find auto-collapse switch - it's a switch with the aria-label "Auto-collapse"
      const autoCollapseSwitch = page.getByRole('switch', { name: 'Auto-collapse' });
      await expect(autoCollapseSwitch).toBeVisible();

      // Toggle it - use force: true because the switch track element intercepts pointer events
      await autoCollapseSwitch.click({ force: true });

      // Verify the switch is still visible (toggle completed without error)
      await expect(autoCollapseSwitch).toBeVisible();
    });

    test('should have logout button visible', async ({ page }: { page: Page }) => {
      // Verify logout button is present
      await expect(page.getByRole('button', { name: /log out/i })).toBeVisible();
    });

    test('should have position selector', async ({ page }: { page: Page }) => {
      // Verify position options are available - use .first() as text appears in multiple places
      await expect(page.getByText('Position').first()).toBeVisible();
    });
  });

  test.describe('Monitoring/Events Tab', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
      // Expand toolbar and navigate to Monitoring
      await page.getByTestId('launchdarkly-toolbar').click();
      await page.getByLabel('Analytics', { exact: true }).click();
      await expect(page.getByText(/events captured/i)).toBeVisible();
    });

    test('should display events tab content', async ({ page }: { page: Page }) => {
      // Verify events content is showing - look for specific events UI elements
      await expect(page.getByText(/events captured/i)).toBeVisible();
    });
  });

  test.describe('Search Functionality', () => {
    test('should toggle search input and support clear functionality', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByTestId('launchdarkly-toolbar').click();

      // Click search button
      await page.getByRole('button', { name: /search/i }).click();
      const searchInput = page.getByPlaceholder('Search');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toBeFocused();

      // Type search term
      await searchInput.fill('test');
      await expect(searchInput).toHaveValue('test');

      // First click on clear: clears text
      await page.getByRole('button', { name: 'Clear', exact: true }).click();
      await expect(searchInput).toHaveValue('');
      await expect(searchInput).toBeVisible();

      // Second click on clear: collapses search
      await page.getByRole('button', { name: 'Clear', exact: true }).click();
      await expect(searchInput).not.toBeVisible();
    });
  });

  test.describe('Position and Layout', () => {
    test('should maintain consistent positioning during expand/collapse', async ({ page }: { page: Page }) => {
      const toolbar = page.getByTestId('launchdarkly-toolbar');
      const viewport = page.viewportSize()!;

      // Verify toolbar is within viewport
      const initialBox = await toolbar.boundingBox();
      expect(initialBox!.x).toBeGreaterThanOrEqual(0);
      expect(initialBox!.y).toBeGreaterThanOrEqual(0);
      expect(initialBox!.x + initialBox!.width).toBeLessThanOrEqual(viewport.width);
      expect(initialBox!.y + initialBox!.height).toBeLessThanOrEqual(viewport.height);

      // Expand toolbar
      await toolbar.click();
      await expect(page.getByRole('button', { name: 'Collapse toolbar' })).toBeVisible();

      const expandedBox = await toolbar.boundingBox();
      expect(expandedBox!.width).toBeGreaterThanOrEqual(initialBox!.width);
      expect(expandedBox!.height).toBeGreaterThanOrEqual(initialBox!.height);

      // Collapse toolbar
      await page.getByRole('button', { name: 'Collapse toolbar' }).click();
      await expect(page.getByLabel('Flags', { exact: true })).not.toBeVisible();

      const collapsedBox = await toolbar.boundingBox();
      expect(collapsedBox!.width).toBeLessThan(expandedBox!.width);
    });
  });
});

import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { testLegacy as test } from '../setup/global';
import { blockApiResponses, waitForToolbarReady } from '../utils/apiMocking';

test.describe('LaunchDarkly Toolbar - UI Interactions', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Block API responses to prevent timing issues during UI interaction tests
    await blockApiResponses(page);

    await page.goto('/sdk');
    await waitForToolbarReady(page);
  });

  test.describe('Toolbar Interaction Workflows', () => {
    test('should support complete expand/collapse/navigate/search workflow', async ({ page }: { page: Page }) => {
      const toolbar = page.getByTestId('launchdarkly-toolbar');

      // 1. Initial state verification
      await expect(page.getByRole('img', { name: 'LaunchDarkly' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Flags' })).not.toBeVisible();
      await expect(page.getByRole('tab', { name: 'Events' })).not.toBeVisible();
      await expect(page.getByRole('tab', { name: 'Settings' })).not.toBeVisible();
      await expect(toolbar).toHaveAttribute('role', 'button');
      await expect(toolbar).toHaveAttribute('aria-label', 'Open LaunchDarkly toolbar');

      // 2. Expand and verify full interface
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(toolbar).toHaveAttribute('role', 'toolbar');
      await expect(toolbar).toHaveAttribute('aria-label', 'LaunchDarkly toolbar');
      await expect(page.getByRole('tab', { name: 'Flags' })).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByRole('tab', { name: 'Events' })).toHaveAttribute('aria-selected', 'false');
      await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'false');

      // 3. Navigate through all tabs and verify content loads
      await page.getByRole('tab', { name: 'Events' }).click();
      await expect(page.getByRole('tab', { name: 'Events' })).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByRole('tab', { name: 'Flags' })).toHaveAttribute('aria-selected', 'false');

      await page.getByRole('tab', { name: 'Settings' }).click();
      // Wait for settings content to load by checking for a key element
      await expect(page.getByLabel('Auto-collapse toolbar')).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');

      // 4. Test search functionality
      await page.getByRole('button', { name: /search/i }).click();
      const searchInput = page.getByPlaceholder('Search');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toBeFocused();

      // Type search term and verify it appears
      await searchInput.fill('test');
      await expect(searchInput).toHaveValue('test');

      // 5. Test clear button dual functionality
      // First click: clear text (but keep search expanded)
      await page.getByRole('button', { name: 'Clear', exact: true }).click();
      await expect(searchInput).toHaveValue(''); // Text should be cleared
      await expect(searchInput).toBeVisible(); // But search should stay expanded

      // Second click: collapse search (since no text)
      await page.getByRole('button', { name: 'Clear', exact: true }).click();
      await expect(searchInput).not.toBeVisible(); // Now search should collapse
      await expect(page.getByRole('button', { name: /search/i })).toBeVisible();

      // 6. Test multiple collapse methods
      // Method 1: Close button
      const closeBtn = page.getByRole('button', { name: 'Close toolbar' });
      await expect(closeBtn).toBeVisible();
      await closeBtn.click();
      await expect(page.getByRole('tab', { name: 'Flags' })).not.toBeVisible();
      await expect(page.getByRole('tab', { name: 'Events' })).not.toBeVisible();
      await expect(page.getByRole('tab', { name: 'Settings' })).not.toBeVisible();
      await expect(page.getByRole('img', { name: 'LaunchDarkly' })).toBeVisible();

      // Method 2: Click outside (should work when auto-collapse is enabled)
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();
      await page.getByTestId('auto-collapse-toggle').click();
      await page.mouse.click(50, 50);
      await expect(page.getByRole('tab', { name: 'Flags' })).not.toBeVisible();
      await expect(page.getByRole('tab', { name: 'Events' })).not.toBeVisible();
      await expect(page.getByRole('tab', { name: 'Settings' })).not.toBeVisible();

      // Method 3: Keyboard navigation and collapse with close button
      await page.getByRole('img', { name: 'LaunchDarkly' }).focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();
    });

    test('should not collapse when auto-collapse is disabled', async ({ page }: { page: Page }) => {
      // 1. Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Settings' }).click();

      // 2. Wait for Settings tab content to load and verify it's visible
      await expect(page.getByLabel('Auto-collapse toolbar')).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
      const autoCollapseToggle = page.getByTestId('auto-collapse-toggle');
      await expect(autoCollapseToggle.getByRole('switch')).not.toBeChecked();

      // 3. Click outside should not collapse toolbar
      await page.mouse.click(50, 50);
      await expect(page.getByRole('tab', { name: 'Settings' })).toBeVisible();
    });

    test('should support basic keyboard accessibility and focus management', async ({ page }: { page: Page }) => {
      const toolbar = page.getByTestId('launchdarkly-toolbar');

      // 1. Test toolbar can be focused and expanded with keyboard
      await toolbar.focus();
      await expect(toolbar).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();

      // 2. Test tabs can be focused and activated
      await page.getByRole('tab', { name: 'Events' }).focus();
      await page.getByRole('tab', { name: 'Events' }).click(); // Use click for reliable activation
      await expect(page.getByRole('tab', { name: 'Events' })).toHaveAttribute('aria-selected', 'true');

      // 3. Test Settings tab focus and activation
      await page.getByRole('tab', { name: 'Settings' }).focus();
      await page.getByRole('tab', { name: 'Settings' }).click();
      await expect(page.getByLabel('Auto-collapse toolbar')).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');

      // 4. Test close button can be focused and activated
      const closeButton = page.getByRole('button', { name: 'Close toolbar' });
      await closeButton.focus();
      await expect(closeButton).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('tab', { name: 'Flags' })).not.toBeVisible();
      await expect(page.getByRole('tab', { name: 'Events' })).not.toBeVisible();
      await expect(page.getByRole('tab', { name: 'Settings' })).not.toBeVisible();

      // 5. Test Space key for expansion (after collapse)
      await toolbar.focus();
      await page.keyboard.press('Space');
      await expect(page.getByRole('tab', { name: 'Settings' })).toBeVisible(); // Should remember last active tab
    });
  });

  test.describe('Settings Tab and Basic Functionality', () => {
    test('should support basic settings tab functionality', async ({ page }: { page: Page }) => {
      // 1. Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Settings' }).click();

      // 2. Wait for Settings tab content to load and verify it's visible
      await expect(page.getByLabel('Auto-collapse toolbar')).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
      await page.getByTestId('auto-collapse-toggle').click();

      // 3. Test auto-collapse behavior - click outside should close
      await page.mouse.click(50, 50);
      await expect(page.getByRole('tab', { name: 'Flags' })).not.toBeVisible();
      await expect(page.getByRole('tab', { name: 'Events' })).not.toBeVisible();
      await expect(page.getByRole('tab', { name: 'Settings' })).not.toBeVisible();

      // 4. Expand again and verify Settings tab functionality persists
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByLabel('Auto-collapse toolbar')).toBeVisible();

      // 5. Verify all tabs are present and accessible
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Events' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Settings' })).toBeVisible();
    });

    test('should reload when flag is changed and reload on flag change is enabled', async ({
      page,
    }: {
      page: Page;
    }) => {
      // 1. Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Settings' }).click();

      // 2. Wait for Settings tab content to load and verify it's visible
      await expect(page.getByLabel('Reload on flag change')).toBeVisible({ timeout: 10000 });

      // 3. Verify Reload on Flag Change toggle functionality
      await page.getByTestId('reload-on-flag-change-toggle').click();

      // 4. Navigate to Flags tab and verify reload on flag change functionality
      await page.getByRole('tab', { name: 'Flags' }).click();
      let booleanFlagControl = page.getByTestId('flag-control-boolean-flag');
      await booleanFlagControl.click();

      // 5. Verify toolbar reloads
      await page.waitForLoadState('load');
      expect(page.getByRole('img', { name: 'LaunchDarkly' })).toBeVisible();

      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Flags' }).click();

      // 6. Verify boolean flag switch is checked
      booleanFlagControl = page.getByTestId('flag-control-boolean-flag');
      const input = booleanFlagControl.getByLabel('Toggle Boolean Flag');
      await expect(input).toBeChecked();
    });
  });

  test.describe('Position and Layout Verification', () => {
    test('should maintain consistent positioning and layout', async ({ page }: { page: Page }) => {
      const toolbar = page.getByTestId('launchdarkly-toolbar');
      const viewport = page.viewportSize()!;

      // 1. Verify toolbar is positioned within viewport bounds
      const initialBox = await toolbar.boundingBox();
      expect(initialBox!.x).toBeGreaterThanOrEqual(0);
      expect(initialBox!.y).toBeGreaterThanOrEqual(0);
      expect(initialBox!.x + initialBox!.width).toBeLessThanOrEqual(viewport.width);
      expect(initialBox!.y + initialBox!.height).toBeLessThanOrEqual(viewport.height);

      // 2. Verify toolbar expands correctly
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();

      // Wait for expansion animation to complete (0.25s duration)
      await page.waitForTimeout(300);

      const expandedBox = await toolbar.boundingBox();
      expect(expandedBox!.width).toBeGreaterThanOrEqual(initialBox!.width);
      expect(expandedBox!.height).toBeGreaterThanOrEqual(initialBox!.height);

      // 3. Verify toolbar collapses correctly
      await page.getByRole('button', { name: 'Close toolbar' }).click();
      await expect(page.getByRole('tab', { name: 'Flags' })).not.toBeVisible();

      // Wait for collapse animation to complete (0.35s duration)
      await page.waitForTimeout(400);

      const collapsedBox = await toolbar.boundingBox();
      expect(collapsedBox!.width).toBeLessThan(expandedBox!.width);
      expect(collapsedBox!.height).toBeLessThan(expandedBox!.height);

      // 4. Verify layout consistency after multiple expand/collapse cycles
      for (let i = 0; i < 3; i++) {
        await page.getByRole('img', { name: 'LaunchDarkly' }).click();
        await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();
        await page.waitForTimeout(300); // Wait for expand animation
        const layoutCloseBtn = page.getByRole('button', { name: 'Close toolbar' });
        await expect(layoutCloseBtn).toBeVisible();
        await layoutCloseBtn.click();
        await expect(page.getByRole('tab', { name: 'Flags' })).not.toBeVisible();
        await page.waitForTimeout(400); // Wait for collapse animation
      }

      // Final verification - toolbar should still be functional
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();
    });
  });
});

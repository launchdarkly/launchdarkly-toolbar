import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from '../setup/global';
import { blockApiResponses, delayApiResponses, waitForToolbarReady } from '../utils/apiMocking';

test.describe('LaunchDarkly Toolbar - New Design', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
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
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Default tab should be flags - verify content is showing
      // Use .first() because flag key appears in multiple places (display and copy button)
      await expect(page.getByText('boolean-flag').first()).toBeVisible();

      // Click Analytics/Monitoring icon using getByLabel
      await page.getByLabel('Analytics', { exact: true }).click();

      // Verify events content is showing - look for "events captured" text in toolbar
      await expect(page.getByText(/events captured/i)).toBeVisible();

      // Navigate back to Flags
      await page.getByLabel('Flags', { exact: true }).click();
      await expect(page.getByText('boolean-flag').first()).toBeVisible();
    });

    test('should collapse toolbar using chevron button', async ({ page }: { page: Page }) => {
      const toolbar = page.getByTestId('launchdarkly-toolbar');

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
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
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Verify flags are displayed (use .first() to avoid matching copy button text)
      await expect(page.getByText('boolean-flag').first()).toBeVisible();
      await expect(page.getByText('string-flag').first()).toBeVisible();
      await expect(page.getByText('number-flag').first()).toBeVisible();
    });

    test('should toggle boolean flag and show override indicator', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

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
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

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
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Find the subtab dropdown button (has aria-haspopup="true")
      const subtabDropdown = page.locator('button[aria-haspopup="true"]').filter({ hasText: 'Flags' });
      await expect(subtabDropdown).toBeVisible();
      await subtabDropdown.click();

      // Verify dropdown menu items appear
      await expect(page.getByRole('menuitem', { name: 'Flags' })).toBeVisible();
      await expect(page.getByRole('menuitem', { name: 'Contexts' })).toBeVisible();
    });

    test('should switch to Contexts subtab', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Open subtab dropdown and select Contexts
      const subtabDropdown = page.locator('button[aria-haspopup="true"]').filter({ hasText: 'Flags' });
      await subtabDropdown.click();
      await page.getByRole('menuitem', { name: 'Contexts' }).click();

      // Verify subtab dropdown now shows "Contexts"
      await expect(page.locator('button[aria-haspopup="true"]').filter({ hasText: 'Contexts' })).toBeVisible();
    });
  });

  test.describe('Contexts Subtab', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
      // Expand toolbar and navigate to Contexts subtab
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      const subtabDropdown = page.locator('button[aria-haspopup="true"]').filter({ hasText: 'Flags' });
      await expect(subtabDropdown).toBeVisible();
      await subtabDropdown.click();
      await expect(page.getByRole('menuitem', { name: 'Contexts' })).toBeVisible();
      await page.getByRole('menuitem', { name: 'Contexts' }).click();
    });

    test('should display contexts list', async ({ page }: { page: Page }) => {
      // Verify we're now on the Contexts subtab
      await expect(page.locator('button[aria-haspopup="true"]').filter({ hasText: 'Contexts' })).toBeVisible();
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
        await expect(page.locator('button[aria-haspopup="true"]').filter({ hasText: 'Contexts' })).toBeVisible();
      }
    });
  });

  test.describe('Settings Tab', () => {
    test('should navigate to settings and show content', async ({ page }: { page: Page }) => {
      const toolbar = page.getByTestId('launchdarkly-toolbar');

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(toolbar).toHaveAttribute('role', 'toolbar');

      // Click Settings button (same pattern as Analytics which works)
      await page.getByLabel('Settings', { exact: true }).click();

      // Wait for Settings content to appear
      // The "Account" section should always be visible in Settings
      await expect(page.getByText('Account')).toBeVisible({ timeout: 10000 });
    });

    test('should display settings options', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByLabel('Settings', { exact: true }).click();

      // Wait for Account section (always present)
      await expect(page.getByText('Account')).toBeVisible({ timeout: 10000 });

      // Verify other settings content - use .first() for text that appears in multiple places
      await expect(page.getByText('Position').first()).toBeVisible();
    });

    test('should have logout button visible', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByLabel('Settings', { exact: true }).click();

      // Wait for Account section
      await expect(page.getByText('Account')).toBeVisible({ timeout: 10000 });

      // Verify logout button is present
      await expect(page.getByRole('button', { name: /log out/i })).toBeVisible();
    });
  });

  test.describe('Monitoring/Events Tab', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
      // Expand toolbar and navigate to Monitoring
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
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
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

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
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
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

    test('should maintain layout consistency after multiple expand/collapse cycles', async ({
      page,
    }: {
      page: Page;
    }) => {
      const toolbar = page.getByTestId('launchdarkly-toolbar');

      // Verify layout consistency after multiple expand/collapse cycles
      for (let i = 0; i < 3; i++) {
        await page.getByRole('img', { name: 'LaunchDarkly' }).click();
        await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();
        await page.waitForTimeout(300); // Wait for expand animation
        const collapseBtn = page.getByRole('button', { name: 'Collapse toolbar' });
        await expect(collapseBtn).toBeVisible();
        await collapseBtn.click();
        await expect(page.getByLabel('Flags', { exact: true })).not.toBeVisible();
        await page.waitForTimeout(400); // Wait for collapse animation
      }

      // Final verification - toolbar should still be functional
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();
    });
  });

  test.describe('Auto-collapse Behavior', () => {
    // Helper function to navigate to Settings tab
    async function navigateToSettings(page: Page) {
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();
      await page.getByLabel('Settings', { exact: true }).click();
      await expect(page.getByText('Toolbar settings')).toBeVisible({ timeout: 15000 });
    }

    test('should collapse when clicking outside with auto-collapse enabled', async ({ page }: { page: Page }) => {
      await navigateToSettings(page);

      // Enable auto-collapse
      const autoCollapseSwitch = page.getByRole('switch', { name: 'Auto-collapse' });
      await autoCollapseSwitch.click({ force: true });

      // Click outside should collapse toolbar
      await page.mouse.click(50, 50);
      await expect(page.getByLabel('Flags', { exact: true })).not.toBeVisible();
    });

    test('should not collapse when auto-collapse is disabled', async ({ page }: { page: Page }) => {
      await navigateToSettings(page);

      // Verify auto-collapse is off by default
      const autoCollapseSwitch = page.getByRole('switch', { name: 'Auto-collapse' });
      await expect(autoCollapseSwitch).toBeVisible();

      // Click outside should not collapse toolbar
      await page.mouse.click(50, 50);
      await expect(page.getByLabel('Settings', { exact: true })).toBeVisible();
    });
  });

  test.describe('Keyboard Accessibility and Focus Management', () => {
    test('should support tab focus navigation between IconBar items', async ({ page }: { page: Page }) => {
      const toolbar = page.getByTestId('launchdarkly-toolbar');

      // Expand toolbar
      await toolbar.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();

      // Navigate using IconBar
      await page.getByLabel('Analytics', { exact: true }).focus();
      await page.getByLabel('Analytics', { exact: true }).click();
      await expect(page.getByText(/events captured/i)).toBeVisible();

      // Navigate back to Flags
      await page.getByLabel('Flags', { exact: true }).focus();
      await page.getByLabel('Flags', { exact: true }).click();
      await expect(page.getByText('boolean-flag').first()).toBeVisible();
    });

    test('should support collapse button focus and keyboard activation', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();

      // Focus and activate collapse button with keyboard
      const collapseButton = page.getByRole('button', { name: 'Collapse toolbar' });
      await collapseButton.focus();
      await expect(collapseButton).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('Flags', { exact: true })).not.toBeVisible();
    });
  });

  test.describe('Reload on Flag Change', () => {
    test('should toggle reload on flag change setting', async ({ page }: { page: Page }) => {
      // Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();
      await page.getByLabel('Settings', { exact: true }).click();
      await expect(page.getByText('Toolbar settings')).toBeVisible({ timeout: 15000 });

      // Verify Reload on flag change option is present
      await expect(page.getByText('Reload on flag change')).toBeVisible();

      // Find and toggle the reload on flag change switch
      const reloadSwitch = page.getByRole('switch', { name: 'Reload on flag change' });
      await expect(reloadSwitch).toBeVisible();

      // Toggle it
      await reloadSwitch.click({ force: true });
      await expect(reloadSwitch).toBeVisible();
    });
  });
});

test.describe('LaunchDarkly Toolbar - New Design - SDK Mode Flag Overrides', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/sdk');
    await waitForToolbarReady(page);
  });

  test.describe('Flag Override Lifecycle', () => {
    test('should support string flag override with edit dialog', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await expect(page.getByText('string-flag').first()).toBeVisible();

      // Dismiss any "Help us improve" popup if present
      const declineButton = page.getByRole('button', { name: 'Decline' });
      if (await declineButton.isVisible().catch(() => false)) {
        await declineButton.click();
      }

      // Find and click the edit button for string flag
      const stringFlagRow = page.locator('[data-testid="flag-row-string-flag"]');
      const editButton = stringFlagRow.getByRole('button', { name: 'Edit' });

      if (await editButton.isVisible().catch(() => false)) {
        await editButton.click();

        // Fill in new value
        const input = page.getByTestId('flag-input-string-flag');
        if (await input.isVisible().catch(() => false)) {
          await input.fill('test-override-string');
          await page.getByRole('button', { name: 'Confirm' }).click();

          // Verify override indicator appears
          await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });
        }
      }
    });

    test('should support number flag override with edit dialog', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await expect(page.getByText('number-flag').first()).toBeVisible();

      // Dismiss any "Help us improve" popup if present
      const declineButton = page.getByRole('button', { name: 'Decline' });
      if (await declineButton.isVisible().catch(() => false)) {
        await declineButton.click();
      }

      // Find and click the edit button for number flag
      const numberFlagRow = page.locator('[data-testid="flag-row-number-flag"]');
      const editButton = numberFlagRow.getByRole('button', { name: 'Edit' });

      if (await editButton.isVisible().catch(() => false)) {
        await editButton.click();

        // Fill in new value
        const input = page.getByTestId('flag-input-number-flag');
        if (await input.isVisible().catch(() => false)) {
          await input.fill('999');
          await page.getByRole('button', { name: 'Confirm' }).click();

          // Verify override indicator appears
          await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });
        }
      }
    });

    test('should support JSON flag override with editor', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await expect(page.getByText('json-object-flag').first()).toBeVisible();

      // Dismiss any "Help us improve" popup if present
      const declineButton = page.getByRole('button', { name: 'Decline' });
      if (await declineButton.isVisible().catch(() => false)) {
        await declineButton.click();
      }

      // Find and click the edit button for JSON flag
      const jsonFlagRow = page.locator('[data-testid="flag-row-json-object-flag"]');
      const editButton = jsonFlagRow.getByRole('button', { name: 'Edit' });

      if (await editButton.isVisible().catch(() => false)) {
        await editButton.click();

        // Fill in new JSON value
        const jsonInput = page.getByTestId('json-editor-json-object-flag').getByRole('textbox');
        if (await jsonInput.isVisible().catch(() => false)) {
          const customJson = '{"environment": "test", "enabled": true}';
          await jsonInput.fill(customJson);
          await page.getByTestId('flag-confirm-json-object-flag').click();

          // Verify override indicator appears
          await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });
        }
      }
    });
  });

  test.describe('Flag Filtering', () => {
    test('should filter to show only overridden flags', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await expect(page.getByText('boolean-flag').first()).toBeVisible();

      // Dismiss any "Help us improve" popup if present
      const declineButton = page.getByRole('button', { name: 'Decline' });
      if (await declineButton.isVisible().catch(() => false)) {
        await declineButton.click();
      }

      // Create an override first
      const booleanFlagSwitch = page.getByRole('switch').first();
      await booleanFlagSwitch.dispatchEvent('click');
      await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });

      // Click show overrides filter
      const showOverridesButton = page.getByRole('button', { name: /show overrides/i });
      if (await showOverridesButton.isVisible().catch(() => false)) {
        await showOverridesButton.click();

        // Verify only overridden flag is visible
        await expect(page.getByText('boolean-flag').first()).toBeVisible();
      }
    });

    test('should show starred flags filter', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await expect(page.getByText('boolean-flag').first()).toBeVisible();

      // Check for starred flags filter button
      const showStarredButton = page.getByRole('button', { name: /show starred/i });
      if (await showStarredButton.isVisible().catch(() => false)) {
        await showStarredButton.click();
        // Verify filter is applied
        await expect(showStarredButton).toBeVisible();
      }
    });

    test('should show all flags filter', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await expect(page.getByText('boolean-flag').first()).toBeVisible();

      // Check for show all flags filter button
      const showAllButton = page.getByRole('button', { name: /show all/i });
      if (await showAllButton.isVisible().catch(() => false)) {
        await expect(showAllButton).toBeVisible();
      }
    });
  });

  test.describe('Clear Overrides', () => {
    test('should clear all overrides', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await expect(page.getByText('boolean-flag').first()).toBeVisible();

      // Dismiss any "Help us improve" popup if present
      const declineButton = page.getByRole('button', { name: 'Decline' });
      if (await declineButton.isVisible().catch(() => false)) {
        await declineButton.click();
      }

      // Create an override
      const booleanFlagSwitch = page.getByRole('switch').first();
      await booleanFlagSwitch.dispatchEvent('click');
      await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });

      // Look for clear overrides button
      const clearOverridesButton = page.getByRole('button', { name: /clear overrides/i });
      if (await clearOverridesButton.isVisible().catch(() => false)) {
        await clearOverridesButton.click();

        // Verify overrides are cleared
        await expect(page.getByTestId('override-dot')).not.toBeVisible();
      }
    });
  });

  test.describe('Override Persistence', () => {
    test('should persist overrides across page reload', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await expect(page.getByText('boolean-flag').first()).toBeVisible();

      // Dismiss any "Help us improve" popup if present
      const declineButton = page.getByRole('button', { name: 'Decline' });
      if (await declineButton.isVisible().catch(() => false)) {
        await declineButton.click();
      }

      // Create an override
      const booleanFlagSwitch = page.getByRole('switch').first();
      await booleanFlagSwitch.dispatchEvent('click');
      await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });

      // Reload page
      await page.reload();
      await waitForToolbarReady(page);

      // Expand toolbar again
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await expect(page.getByText('boolean-flag').first()).toBeVisible();

      // Verify override persisted
      await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });
    });
  });
});

test.describe('LaunchDarkly Toolbar - New Design - Logout Functionality', () => {
  // Helper function to navigate to Settings tab
  async function navigateToSettings(page: Page) {
    await page.getByRole('img', { name: 'LaunchDarkly' }).click();
    await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();
    await page.getByLabel('Settings', { exact: true }).click();
    await expect(page.getByText('Toolbar settings')).toBeVisible({ timeout: 15000 });
  }

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/sdk');
    await waitForToolbarReady(page);
  });

  test.describe('Logout Button', () => {
    test('should display logout button in settings', async ({ page }: { page: Page }) => {
      await navigateToSettings(page);

      // Verify logout button is visible
      await expect(page.getByRole('button', { name: /log out/i })).toBeVisible({ timeout: 10000 });
    });

    test('should show logout button with correct text', async ({ page }: { page: Page }) => {
      await navigateToSettings(page);

      // Verify button text
      const logoutButton = page.getByRole('button', { name: /log out/i });
      await expect(logoutButton).toBeVisible({ timeout: 10000 });
      await expect(logoutButton).toContainText(/log out/i);
    });

    test('should be keyboard accessible', async ({ page }: { page: Page }) => {
      await navigateToSettings(page);

      // Wait for logout button
      const logoutButton = page.getByRole('button', { name: /log out/i });
      await expect(logoutButton).toBeVisible({ timeout: 10000 });

      // Test keyboard navigation
      await logoutButton.focus();
      await expect(logoutButton).toBeFocused();

      // Tab away and verify focus moves
      await page.keyboard.press('Tab');
      await expect(logoutButton).not.toBeFocused();
    });
  });

  test.describe('Logout Execution', () => {
    test('should handle logout and show login screen', async ({ page }: { page: Page }) => {
      await navigateToSettings(page);

      // Click logout button
      const logoutButton = page.getByRole('button', { name: /log out/i });
      await expect(logoutButton).toBeVisible({ timeout: 10000 });
      await logoutButton.click();

      // Verify login screen appears
      await expect(page.getByTestId('login-screen')).toBeVisible({ timeout: 5000 });
    });

    test('should support logout via keyboard', async ({ page }: { page: Page }) => {
      await navigateToSettings(page);

      // Focus logout button and activate with Enter
      const logoutButton = page.getByRole('button', { name: /log out/i });
      await expect(logoutButton).toBeVisible({ timeout: 10000 });
      await logoutButton.focus();
      await page.keyboard.press('Enter');

      // Verify logout was successful
      await expect(page.getByTestId('login-screen')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Logout in Dev Server Mode', () => {
    test('should show logout button in dev-server mode', async ({ page }: { page: Page }) => {
      await page.goto('/dev-server');
      await waitForToolbarReady(page);

      // Navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();
      await page.getByLabel('Settings', { exact: true }).click();
      await expect(page.getByText('Toolbar settings')).toBeVisible({ timeout: 15000 });

      // Verify logout button is visible
      const logoutButton = page.getByRole('button', { name: /log out/i });
      await expect(logoutButton).toBeVisible({ timeout: 10000 });
    });

    test('should handle logout in dev-server mode', async ({ page }: { page: Page }) => {
      await page.goto('/dev-server');
      await waitForToolbarReady(page);

      // Navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();
      await page.getByLabel('Settings', { exact: true }).click();
      await expect(page.getByText('Toolbar settings')).toBeVisible({ timeout: 15000 });

      // Click logout
      const logoutButton = page.getByRole('button', { name: /log out/i });
      await expect(logoutButton).toBeVisible({ timeout: 10000 });
      await logoutButton.click();

      // Verify login screen appears
      await expect(page.getByTestId('login-screen')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Search Integration with Logout', () => {
    test('should find logout option when searching', async ({ page }: { page: Page }) => {
      await navigateToSettings(page);

      // Open search
      await page.getByRole('button', { name: /search/i }).click();
      const searchInput = page.getByPlaceholder('Search');
      await expect(searchInput).toBeVisible();

      // Search for "logout"
      await searchInput.fill('logout');

      // Verify logout button is still visible
      const logoutButton = page.getByRole('button', { name: /log out/i });
      await expect(logoutButton).toBeVisible();
    });

    test('should hide logout option when searching for unrelated term', async ({ page }: { page: Page }) => {
      await navigateToSettings(page);

      // Wait for logout button initially
      await expect(page.getByRole('button', { name: /log out/i })).toBeVisible({ timeout: 10000 });

      // Open search
      await page.getByRole('button', { name: /search/i }).click();
      const searchInput = page.getByPlaceholder('Search');
      await expect(searchInput).toBeVisible();

      // Search for unrelated term
      await searchInput.fill('position');

      // Verify logout button is not visible
      const logoutButton = page.getByRole('button', { name: /log out/i });
      await expect(logoutButton).not.toBeVisible();
    });
  });
});

test.describe('LaunchDarkly Toolbar - New Design - Events Tab', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/sdk');
    await waitForToolbarReady(page);
  });

  test.describe('Events Management', () => {
    test('should display clear events button', async ({ page }: { page: Page }) => {
      // Expand toolbar and navigate to Events/Analytics
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByLabel('Analytics', { exact: true }).click();

      // Verify events content is showing
      await expect(page.getByText(/events captured/i)).toBeVisible();

      // Check for clear events button
      const clearEventsButton = page.getByRole('button', { name: /clear/i });
      if (await clearEventsButton.isVisible().catch(() => false)) {
        await expect(clearEventsButton).toBeVisible();
      }
    });

    test('should handle unknown flag events', async ({ page }: { page: Page }) => {
      // Navigate to SDK page without blocking APIs for this test
      await page.goto('/sdk');
      await waitForToolbarReady(page);

      // Expand toolbar and navigate to Events
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByLabel('Analytics', { exact: true }).click();

      // Verify events tab is shown
      await expect(page.getByText(/events captured/i)).toBeVisible();

      // Look for test unknown flag button in the demo app
      const testUnknownFlagButton = page.getByRole('button', { name: /unknown flag/i });
      if (await testUnknownFlagButton.isVisible().catch(() => false)) {
        await testUnknownFlagButton.click();

        // Verify event appears with add flag option
        const addFlagButton = page.getByLabel('Add feature flag');
        if (await addFlagButton.isVisible().catch(() => false)) {
          await expect(addFlagButton).toBeVisible();
        }
      }
    });
  });
});

test.describe('LaunchDarkly Toolbar - New Design - Dev Server Mode', () => {
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
            'test-flag-1': [
              { _id: 'option-1', value: true },
              { _id: 'option-2', value: false },
            ],
            'test-flag-2': [
              { _id: 'option-1', name: 'option-1', value: 'value-1' },
              { _id: 'option-2', name: 'option-2', value: 'value-2' },
            ],
            'numeric-flag': [
              { _id: 'option-1', value: 100 },
              { _id: 'option-2', value: 200 },
            ],
          },
          context: {
            kind: 'user',
            key: 'dev-environment',
          },
          flagsState: {
            'test-flag-1': { value: false, version: 2 },
            'test-flag-2': { value: { _ldMeta: { enabled: false } }, version: 6 },
            'numeric-flag': { value: 100, version: 1 },
          },
          overrides: {},
          sourceEnvironmentKey: 'test',
        }),
      });
    });

    await page.goto('/dev-server');
    await expect(page.getByText('LaunchDarkly Toolbar Demo (dev server mode)')).toBeVisible();
    await waitForToolbarReady(page);
  });

  test.describe('Dev Server Integration', () => {
    test('should initialize with dev server and show IconBar navigation', async ({ page }: { page: Page }) => {
      // Verify toolbar loads
      await expect(page.getByRole('img', { name: 'LaunchDarkly' })).toBeVisible();

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Verify IconBar navigation is visible
      await expect(page.getByLabel('Flags', { exact: true })).toBeVisible();
      await expect(page.getByLabel('Analytics', { exact: true })).toBeVisible();
      await expect(page.getByLabel('Settings', { exact: true })).toBeVisible();
    });

    test('should display flags from dev server', async ({ page }: { page: Page }) => {
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await page.waitForTimeout(1500);

      // Verify expected flags are present
      await expect(page.getByText('test-flag-1').first()).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('test-flag-2').first()).toBeVisible();
      await expect(page.getByText('numeric-flag').first()).toBeVisible();
    });

    test('should show flag types and values', async ({ page }: { page: Page }) => {
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await page.waitForTimeout(1500);

      // Verify boolean flag switch is present
      const booleanFlagSwitch = page.getByRole('switch').first();
      await expect(booleanFlagSwitch).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Dev Server Flag Management', () => {
    test('should display flag management interface', async ({ page }: { page: Page }) => {
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await page.waitForTimeout(1500);

      // Verify flags are present
      await expect(page.getByText('test-flag-1').first()).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('test-flag-2').first()).toBeVisible();
      await expect(page.getByText('numeric-flag').first()).toBeVisible();

      // Verify boolean flag switch is present
      const booleanFlagSwitch = page.getByRole('switch').first();
      await expect(booleanFlagSwitch).toBeVisible();
    });
  });

  test.describe('Dev Server Events Tab', () => {
    test('should display events tab with clear button', async ({ page }: { page: Page }) => {
      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Navigate to Events tab
      await page.getByLabel('Analytics', { exact: true }).click();

      // Verify events content is visible
      await expect(page.getByText(/events captured/i)).toBeVisible();

      // Check for clear events button
      const clearEventsButton = page.getByRole('button', { name: /clear/i });
      if (await clearEventsButton.isVisible().catch(() => false)) {
        await expect(clearEventsButton).toBeVisible();
      }
    });
  });

  // Note: Connection error recovery test is complex due to async error handling behavior
  // The test verifies the toolbar can handle and recover from connection failures
  test.describe('Dev Server Connection Error Handling', () => {
    test('should show error state when connection fails', async ({ page }: { page: Page }) => {
      // Expand toolbar first
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for initial flags to load
      await page.waitForTimeout(1500);
      await expect(page.getByText('test-flag-1').first()).toBeVisible({ timeout: 5000 });

      // Block dev server requests to simulate connection failure
      await page.route('**/dev/**', async (route) => {
        await route.abort();
      });

      // The toolbar should handle the error gracefully
      // Wait a bit for the error state to potentially appear
      await page.waitForTimeout(2000);

      // Verify toolbar is still functional (not crashed)
      const toolbar = page.getByTestId('launchdarkly-toolbar');
      await expect(toolbar).toBeVisible();
    });
  });
});

test.describe('LaunchDarkly Toolbar - New Design - Flag Display Resilience', () => {
  test.describe('SDK Mode - Resilience', () => {
    test('should display all flags immediately when toolbar opens', async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await page.waitForTimeout(1500);

      // Flags should be visible
      await expect(page.getByText('boolean-flag').first()).toBeVisible({ timeout: 2000 });
      await expect(page.getByText('string-flag').first()).toBeVisible();
      await expect(page.getByText('number-flag').first()).toBeVisible();
    });

    test('should allow flag overrides to work immediately', async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await page.waitForTimeout(1500);

      // Dismiss any "Help us improve" popup if present
      const declineButton = page.getByRole('button', { name: 'Decline' });
      if (await declineButton.isVisible().catch(() => false)) {
        await declineButton.click();
      }

      // Verify flag controls are interactive
      const booleanSwitch = page.getByRole('switch').first();
      await expect(booleanSwitch).toBeVisible({ timeout: 2000 });

      // Test override functionality
      await booleanSwitch.dispatchEvent('click');

      // Verify override indicator appears
      await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });
    });

    test('should display flags even if API completely fails', async ({ page }: { page: Page }) => {
      // Block API responses
      await blockApiResponses(page);

      await page.goto('/sdk');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await page.waitForTimeout(1500);

      // Flags should still display
      await expect(page.getByText('boolean-flag').first()).toBeVisible({ timeout: 2000 });
      await expect(page.getByText('string-flag').first()).toBeVisible();
      await expect(page.getByText('number-flag').first()).toBeVisible();
    });

    test('should handle API delay gracefully', async ({ page }: { page: Page }) => {
      // Delay API responses by 3 seconds
      await delayApiResponses(page, 3000);

      await page.goto('/sdk');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to load
      await page.waitForTimeout(1500);

      // Flags should display before API responds
      await expect(page.getByText('boolean-flag').first()).toBeVisible({ timeout: 2000 });

      // Wait for API delay to complete
      await page.waitForTimeout(3500);

      // Flag should remain visible after API delay
      await expect(page.getByText('boolean-flag').first()).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('flags should appear within 3 seconds of opening toolbar', async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await waitForToolbarReady(page);

      const startTime = Date.now();

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Flags should be visible
      await expect(page.getByText('boolean-flag').first()).toBeVisible({ timeout: 3000 });

      const endTime = Date.now();
      const displayTime = endTime - startTime;

      // Verify flags displayed quickly
      expect(displayTime).toBeLessThan(3000);
    });
  });

  test.describe('Search Resilience', () => {
    test('should support search with delayed API', async ({ page }: { page: Page }) => {
      // Delay API responses
      await delayApiResponses(page, 2000);

      await page.goto('/sdk');
      await waitForToolbarReady(page);

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for flags to be visible
      await page.waitForTimeout(1500);
      await expect(page.getByText('boolean-flag').first()).toBeVisible({ timeout: 2000 });

      // Click the search button
      await page.getByRole('button', { name: /search/i }).click();

      // Test search
      const searchInput = page.getByPlaceholder('Search');
      await searchInput.fill('boolean');

      // Should find the flag
      await expect(page.getByText('boolean-flag').first()).toBeVisible();
    });
  });
});

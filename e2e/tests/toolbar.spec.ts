import { test, expect, type Page } from '@playwright/test';

test.describe('LaunchDarkly Toolbar', () => {
  test.describe('Dev Server Mode', () => {
    const TEST_PROJECT_KEY = 'test-project';

    test.beforeEach(async ({ page }: { page: Page }) => {
      await page.goto('/dev-server');
      await page.waitForSelector('[data-testid="launchdarkly-toolbar"]');
      await expect(page.getByText('LaunchDarkly Toolbar Demo (dev server mode)')).toBeVisible();

      await page.route(`**/dev/projects`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([TEST_PROJECT_KEY]),
        });
      });

      await page.route(`**/dev/projects/test-project*`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            _lastSyncedFromSource: Date.now(),
            availableVariations: {
              'test-flag-1': [
                {
                  _id: 'option-1',
                  value: true,
                },
                {
                  _id: 'option-2',
                  value: false,
                },
              ],
              'test-flag-2': [
                {
                  _id: 'option-1',
                  name: 'option-1',
                  value: 'value-1',
                },
                {
                  _id: 'option-2',
                  name: 'option-2',
                  value: 'value-2',
                },
              ],
            },
            context: {
              kind: 'user',
              key: 'dev-environment',
            },
            flagsState: {
              'test-flag-1': {
                value: false,
                version: 2,
              },
              'test-flag-2': {
                value: {
                  _ldMeta: {
                    enabled: false,
                  },
                },
                version: 6,
              },
            },
            overrides: {},
            sourceEnvironmentKey: 'test',
          }),
        });
      });
    });

    test('should load toolbar in dev-server mode', async ({ page }: { page: Page }) => {
      // Verify the toolbar loads successfully
      await expect(page.getByRole('img', { name: 'LaunchDarkly' })).toBeVisible();

      // Verify the configuration panel is present
      await expect(page.getByRole('heading', { name: 'Configuration' })).toBeVisible();

      // Expand toolbar to verify it works
      const toolbarContainer = page.getByTestId('launchdarkly-toolbar');
      await toolbarContainer.hover();
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();
    });

    test('should allow users to discover and expand the toolbar naturally', async ({ page }: { page: Page }) => {
      // User sees the LaunchDarkly logo initially
      await expect(page.getByRole('img', { name: 'LaunchDarkly' })).toBeVisible();

      // Toolbar starts collapsed - no navigation visible
      await expect(page.getByRole('tab')).not.toBeVisible();

      // User hovers over the toolbar to discover functionality
      const toolbarContainer = page.getByTestId('launchdarkly-toolbar');
      await toolbarContainer.hover();

      // Toolbar expands showing available tabs
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Settings' })).toBeVisible();

      // User can see the expanded toolbar interface
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();
    });

    test('should support complete flag management workflow', async ({ page }: { page: Page }) => {
      // Expand toolbar
      const toolbarContainer = page.getByTestId('launchdarkly-toolbar').first();
      await toolbarContainer.hover();

      // Navigate to Flags tab
      await page.getByRole('tab', { name: 'Flags' }).click();

      // Verify Flags tab is active and content is visible
      await expect(page.getByRole('tab', { name: 'Flags' })).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByTestId('flag-dev-server-tab-content')).toBeVisible();
      await expect(page.getByText('test-flag-1')).toBeVisible();

      // User can see and interact with flag toggles
      const flagToggle = page.getByRole('switch').first();
      await expect(flagToggle).toBeVisible();

      // Verify other flags are listed for management
      await expect(page.getByTestId('flag-dev-server-tab-content')).toBeVisible();
      await expect(page.getByText('test-flag-1')).toBeVisible();
    });

    test('should allow users to navigate between different sections', async ({ page }: { page: Page }) => {
      // Expand toolbar and start with Flags
      const toolbarContainer = page.getByTestId('launchdarkly-toolbar').first();
      await toolbarContainer.hover();
      await page.getByRole('tab', { name: 'Flags' }).click();

      // Navigate to Settings tab
      await page.getByRole('tab', { name: 'Settings' }).click();
      await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByRole('tab', { name: 'Flags' })).toHaveAttribute('aria-selected', 'false');

      // Navigate back to Flags tab
      await page.getByRole('tab', { name: 'Flags' }).click();
      await expect(page.getByRole('tab', { name: 'Flags' })).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'false');
    });

    test('should show search button and flag content', async ({ page }: { page: Page }) => {
      // Expand toolbar and go to Flags tab
      const toolbarContainer = page.getByTestId('launchdarkly-toolbar').first();
      await toolbarContainer.hover();
      await page.getByRole('tab', { name: 'Flags' }).click();

      // Verify search functionality is available
      await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();

      // Verify flag content is displayed
      await expect(page.getByTestId('flag-dev-server-tab-content')).toBeVisible();
      await expect(page.getByText('test-flag-1')).toBeVisible();

      // Verify flag toggles are functional
      const flagToggles = page.getByRole('switch');
      await expect(flagToggles.first()).toBeVisible();
    });

    test('should provide intuitive ways to close and collapse the toolbar', async ({ page }: { page: Page }) => {
      // Expand toolbar
      const toolbarContainer = page.getByTestId('launchdarkly-toolbar').first();
      await toolbarContainer.hover();
      await page.getByRole('tab', { name: 'Flags' }).click();

      // Method 1: Use the close button
      await page.getByRole('button', { name: 'Close toolbar' }).click();
      await expect(page.getByRole('tab', { name: 'Flags' })).not.toBeVisible();
      await expect(page.getByRole('img', { name: 'LaunchDarkly' })).toBeVisible();

      // We have disabled the collapse-on-blur functionality for now
      // // Method 2: Click outside to collapse (re-expand first)
      // await toolbarContainer.hover();
      // await page.getByRole('tab', { name: 'Settings' }).click();

      // // Click outside the toolbar area
      // await page.mouse.click(50, 50);
      // await expect(page.getByRole('tab', { name: 'Settings' })).not.toBeVisible();
    });

    test('should maintain proper tab states when switching', async ({ page }: { page: Page }) => {
      const toolbarContainer = page.getByTestId('launchdarkly-toolbar').first();

      // Expand and select Settings tab
      await toolbarContainer.hover();
      await page.getByRole('tab', { name: 'Settings' }).click();
      await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');

      // Switch to Flags tab and verify state change
      await page.getByRole('tab', { name: 'Flags' }).click();
      await expect(page.getByRole('tab', { name: 'Flags' })).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'false');
      await expect(page.getByTestId('flag-dev-server-tab-content')).toBeVisible();
      await expect(page.getByText('test-flag-1')).toBeVisible();
    });

    test('should be responsive to mouse movement patterns', async ({ page }: { page: Page }) => {
      const toolbarContainer = page.getByTestId('launchdarkly-toolbar').first();

      // Hover to expand
      await toolbarContainer.hover();
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();

      // Move mouse away from toolbar to a safe area
      await page.mouse.move(300, 300);

      // Wait for potential collapse (toolbar should remain expanded when tabs are visible)
      await page.waitForTimeout(500);

      // Hover again to ensure toolbar still works
      await toolbarContainer.hover();
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();
    });

    test('should automatically recover from connection failures', async ({ page }: { page: Page }) => {
      // Block all network requests except demo app (localhost:5173) to simulate offline state
      await page.route('**/*', async (route) => {
        const url = route.request().url();
        if (url.includes('localhost:5173')) {
          // Allow demo app requests to pass through
          await route.continue();
        } else {
          // Block everything else
          await route.abort();
        }
      });

      await page.waitForSelector('[data-testid="launchdarkly-toolbar"]');

      // Expand the toolbar to see the error state
      const toolbarContainer = page.getByTestId('launchdarkly-toolbar');
      await toolbarContainer.hover();
      await page.getByRole('tab', { name: 'Flags' }).click();

      // Verify we're in an error state initially
      await expect(page.getByText(/Error connecting to dev server/i)).toBeVisible();

      // Now simulate the dev server coming back online by removing the block
      await page.unroute('**/*');

      // Wait for automatic recovery to occur (polling should detect the dev server is back online)
      // Wait longer than the poll interval (5000ms) to prevent flakiness
      await expect(page.getByText(/Error connecting to dev server/i)).not.toBeVisible({ timeout: 6000 });

      // Verify flag content is displayed after recovery
      await expect(page.getByTestId('flag-dev-server-tab-content')).toBeVisible();
      await expect(page.getByText('test-flag-1')).toBeVisible();
    });
  });

  test.describe('SDK Mode', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await page.waitForSelector('[data-testid="launchdarkly-toolbar"]');
      await expect(page.getByText('LaunchDarkly Toolbar Demo (sdk mode)')).toBeVisible();
    });

    test('should allow toggling and clearing flag overrides in SDK mode', async ({ page }: { page: Page }) => {
      // Verify the toolbar loads successfully
      await expect(page.getByRole('img', { name: 'LaunchDarkly' })).toBeVisible();

      // Expand toolbar by hovering
      const toolbarContainer = page.getByTestId('launchdarkly-toolbar');
      await toolbarContainer.hover();

      // Verify tabs are visible
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Settings' })).toBeVisible();

      // Click on Flags tab
      await page.getByRole('tab', { name: 'Flags' }).click();

      // Verify Flags tab is active and content is visible
      await expect(page.getByRole('tab', { name: 'Flags' })).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByTestId('flag-sdk-tab-content')).toBeVisible();

      // Verify flag management controls are present
      await expect(page.getByText('Show overrides only')).toBeVisible();
      await expect(page.getByText(/Clear all overrides/)).toBeVisible();

      // If flags are available, verify they're displayed
      const flagContent = page.getByTestId('flag-sdk-tab-content');
      await expect(flagContent).toBeVisible();

      // Verify the expected flags are present
      await expect(page.getByText('Test Flag By Pranjal')).toBeVisible();
      await expect(page.getByText('Test Flag By Sub')).toBeVisible();
      await expect(page.getByText('Test Flag Json')).toBeVisible();
      await expect(page.getByText('Test Flag Number')).toBeVisible();
      await expect(page.getByText('Test Flag String')).toBeVisible();

      // Verify action buttons are present
      await expect(page.getByText('Show overrides only')).toBeVisible();
      await expect(page.getByText(/Clear all overrides/)).toBeVisible();

      // Initially, no overrides should exist, so "Clear all overrides" should show (0)
      await expect(page.getByText('Clear all overrides (0)')).toBeVisible();

      // Test 1: Toggle a boolean flag (Test Flag By Sub - currently Off)
      const testFlagBySubSwitch = page.getByTestId('flag-switch-test-flag-by-sub');

      // Verify initial state (should be Off/false)
      await expect(testFlagBySubSwitch).not.toBeChecked();

      // Toggle the switch to create an override
      await testFlagBySubSwitch.click();

      // Verify the switch is now checked
      await expect(testFlagBySubSwitch).toBeChecked();

      // Verify override indicator appears
      const testFlagBySubRow = page.getByTestId('flag-row-test-flag-by-sub');
      await expect(testFlagBySubRow.getByTestId('override-indicator')).toBeVisible();

      // Verify clear all overrides count updated
      await expect(page.getByText('Clear all overrides (1)')).toBeVisible();

      // Test 2: Edit a string flag (Test Flag String)
      const testFlagStringEditButton = page
        .getByTestId('flag-control-test-flag-string')
        .getByRole('button', { name: 'Edit' });

      // Click edit button to enter edit mode
      await testFlagStringEditButton.click();

      // Verify input field appears and enter new value
      const stringInput = page.getByTestId('flag-input-test-flag-string');
      await expect(stringInput).toBeVisible();
      await stringInput.fill('overridden-string-value');

      // Confirm the change
      const confirmButton = page.getByRole('button', { name: 'Confirm' });
      await confirmButton.click();

      // Verify the new value is displayed
      const testFlagStringValue = page.getByTestId('flag-value-test-flag-string');
      await expect(testFlagStringValue).toHaveText('overridden-string-value');

      // Verify override indicator appears
      const testFlagStringRow = page.getByTestId('flag-row-test-flag-string');
      await expect(testFlagStringRow.getByTestId('override-indicator')).toBeVisible();

      // Verify clear all overrides count updated
      await expect(page.getByText('Clear all overrides (2)')).toBeVisible();

      // Test 3: Edit a number flag (Test Flag Number - currently 2)
      const testFlagNumberEditButton = page
        .getByTestId('flag-control-test-flag-number')
        .getByRole('button', { name: 'Edit' });

      // Click edit button
      await testFlagNumberEditButton.click();

      // Verify number input appears and enter new value
      const numberInput = page.getByTestId('flag-input-test-flag-number');
      await expect(numberInput).toBeVisible();
      await numberInput.fill('42');

      // Confirm the change
      const numberConfirmButton = page.getByRole('button', { name: 'Confirm' });
      await numberConfirmButton.click();

      // Verify the new value is displayed
      const testFlagNumberValue = page.getByTestId('flag-value-test-flag-number');
      await expect(testFlagNumberValue).toHaveText('42');

      // Verify override indicator appears
      const testFlagNumberRow = page.getByTestId('flag-row-test-flag-number');
      await expect(testFlagNumberRow.getByTestId('override-indicator')).toBeVisible();

      // Verify clear all overrides count updated
      await expect(page.getByText('Clear all overrides (3)')).toBeVisible();

      // Test 4: Test "Show overrides only" functionality
      const showOverridesButton = page.getByTestId('show-overrides-only-button');
      await showOverridesButton.click();

      // Verify only overridden flags are visible
      await expect(page.getByTestId('flag-name-test-flag-by-sub')).toBeVisible(); // overridden
      await expect(page.getByTestId('flag-name-test-flag-string')).toBeVisible(); // overridden
      await expect(page.getByTestId('flag-name-test-flag-number')).toBeVisible(); // overridden

      // Non-overridden flags should not be visible
      await expect(page.getByTestId('flag-name-test-flag-by-pranjal')).not.toBeVisible();
      await expect(page.getByTestId('flag-name-test-flag-json')).not.toBeVisible();

      // Test 5: Clear individual override
      const overrideIndicator = testFlagBySubRow.getByTestId('override-indicator');

      // Hover to see "Remove" text
      await overrideIndicator.hover();
      await expect(testFlagBySubRow.getByText('Remove')).toBeVisible();

      // Click to remove override
      await overrideIndicator.click();

      // Verify override is removed (flag should disappear from overrides-only view)
      await expect(page.getByTestId('flag-name-test-flag-by-sub')).not.toBeVisible();

      // Verify clear all overrides count updated
      await expect(page.getByText('Clear all overrides (2)')).toBeVisible();

      // Test 6: Turn off "Show overrides only" to see all flags again
      await showOverridesButton.click();

      // Verify all flags are visible again
      await expect(page.getByTestId('flag-name-test-flag-by-pranjal')).toBeVisible();
      await expect(page.getByTestId('flag-name-test-flag-by-sub')).toBeVisible();
      await expect(page.getByTestId('flag-name-test-flag-json')).toBeVisible();
      await expect(page.getByTestId('flag-name-test-flag-number')).toBeVisible();
      await expect(page.getByTestId('flag-name-test-flag-string')).toBeVisible();

      // Verify Test Flag By Sub no longer has override indicator
      const resetTestFlagBySubRow = page.getByTestId('flag-row-test-flag-by-sub');
      await expect(resetTestFlagBySubRow.getByTestId('override-indicator')).not.toBeVisible();

      // Test 7: Clear all remaining overrides
      const clearAllButton = page.getByTestId('clear-all-overrides-button');
      await clearAllButton.click();

      // Verify all overrides are cleared
      await expect(page.getByText('Clear all overrides (0)')).toBeVisible();

      // Verify no override indicators are visible
      await expect(page.getByTestId('override-indicator')).not.toBeVisible();

      // Verify flags have returned to their original values
      const resetTestFlagStringValue = page.getByTestId('flag-value-test-flag-string');
      await expect(resetTestFlagStringValue).not.toHaveText('overridden-string-value');

      const resetTestFlagNumberValue = page.getByTestId('flag-value-test-flag-number');
      await expect(resetTestFlagNumberValue).not.toHaveText('42');
      await expect(resetTestFlagNumberValue).toHaveText('2'); // Original value

      // Test 8: Verify "Show overrides only" shows no results when no overrides exist
      await showOverridesButton.click();
      await expect(page.getByText('No overridden flags found')).toBeVisible();
      await expect(page.getByText('No overridden flags match your search')).toBeVisible();
    });
  });
});

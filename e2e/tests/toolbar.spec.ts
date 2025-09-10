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

      // Method 2: Click outside to collapse (re-expand first)
      await toolbarContainer.hover();
      await page.getByRole('tab', { name: 'Settings' }).click();

      // Click outside the toolbar area
      await page.mouse.click(50, 50);
      await expect(page.getByRole('tab', { name: 'Settings' })).not.toBeVisible();
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

  test.describe.only('SDK Mode', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
      await page.goto('/sdk');
      await page.waitForSelector('[data-testid="launchdarkly-toolbar"]');
      await expect(page.getByText('LaunchDarkly Toolbar Demo (sdk mode)')).toBeVisible();
    });

    test('should load toolbar in SDK mode and show flags', async ({ page }: { page: Page }) => {
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
      // Note: This might show "No flags available" if LaunchDarkly client isn't properly configured
      const flagContent = page.getByTestId('flag-sdk-tab-content');
      await expect(flagContent).toBeVisible();
    });

    // TODO
    test.skip('should support flag override functionality when flags are available', async ({
      page,
    }: {
      page: Page;
    }) => {
      // Expand toolbar and navigate to Flags tab
      const toolbarContainer = page.getByTestId('launchdarkly-toolbar');
      await toolbarContainer.hover();
      await page.getByRole('tab', { name: 'Flags' }).click();

      // Check if we have flags available (not in "No flags available" state)
      const noFlagsMessage = page.getByText('No flags available');
      const hasFlags = !(await noFlagsMessage.isVisible().catch(() => false));

      if (hasFlags) {
        // Test flag override controls are functional
        const flagToggles = page.getByRole('switch');
        if ((await flagToggles.count()) > 0) {
          // Verify we can see flag toggles/controls
          await expect(flagToggles.first()).toBeVisible();
        }

        // Test "Show overrides only" functionality
        const showOverridesButton = page.getByText('Show overrides only');

        // Get initial button state (should not be active initially)
        const initialClasses = await showOverridesButton.getAttribute('class');

        // Click to activate
        await showOverridesButton.click();
        const activeClasses = await showOverridesButton.getAttribute('class');

        // Verify the classes changed (active state should add more classes)
        expect(activeClasses).not.toBe(initialClasses);
        expect(activeClasses?.split(' ').length).toBeGreaterThan(initialClasses?.split(' ').length || 0);

        // Click again to toggle off
        await showOverridesButton.click();
        const inactiveClasses = await showOverridesButton.getAttribute('class');

        // Verify we're back to the initial state
        expect(inactiveClasses).toBe(initialClasses);

        // Verify "Clear all overrides" button is present and functional
        const clearAllButton = page.getByText(/Clear all overrides/);
        await expect(clearAllButton).toBeVisible();
      } else {
        // If no flags are available, verify the help message is shown
        await expect(page.getByText('No flags available')).toBeVisible();
        await expect(page.getByText(/Make sure your LaunchDarkly client is properly initialized/)).toBeVisible();
      }
    });
  });
});

import { test, expect, type Page } from '@playwright/test';

test.describe('LaunchDarkly Toolbar', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Navigate to the Storybook story for the LaunchDarkly Toolbar
    await page.goto('http://localhost:6006/?path=/story/ui-launchdarklytoolbar--default');

    // Wait for Storybook to load
    await page.waitForSelector('iframe[title="storybook-preview-iframe"]');
  });

  test('should allow users to discover and expand the toolbar naturally', async ({ page }: { page: Page }) => {
    const iframe = page.frameLocator('iframe[title="storybook-preview-iframe"]');

    // User sees the LaunchDarkly logo initially
    await expect(iframe.getByRole('img', { name: 'LaunchDarkly' })).toBeVisible();

    // Toolbar starts collapsed - no navigation visible
    await expect(iframe.getByRole('tab')).not.toBeVisible();

    // User hovers over the toolbar to discover functionality
    const toolbarContainer = iframe.locator('[class*="toolbarContainer"]').first();
    await toolbarContainer.hover();

    // Toolbar expands showing available tabs
    await expect(iframe.getByRole('tab', { name: 'Flags' })).toBeVisible();
    // await expect(iframe.getByRole('tab', { name: 'Events' })).toBeVisible(); // Events tab temporarily disabled
    await expect(iframe.getByRole('tab', { name: 'Settings' })).toBeVisible();

    // User can see the expanded toolbar interface
    await expect(iframe.getByRole('tab', { name: 'Flags' })).toBeVisible();
  });

  test('should support complete flag management workflow', async ({ page }: { page: Page }) => {
    const iframe = page.frameLocator('iframe[title="storybook-preview-iframe"]');

    // Expand toolbar
    const toolbarContainer = iframe.locator('[class*="toolbarContainer"]').first();
    await toolbarContainer.hover();

    // Navigate to Flags tab
    await iframe.getByRole('tab', { name: 'Flags' }).click();

    // Verify Flags tab is active and content is visible
    await expect(iframe.getByRole('tab', { name: 'Flags' })).toHaveAttribute('aria-selected', 'true');
    await expect(iframe.getByTestId('flag-tab-content')).toBeVisible();

    // User can see and interact with flag toggles
    const flagToggle = iframe.getByRole('switch').first();
    await expect(flagToggle).toBeVisible();

    // Verify other flags are listed for management
    await expect(iframe.getByTestId('flag-tab-content')).toBeVisible();
  });

  test('should allow users to navigate between different sections', async ({ page }: { page: Page }) => {
    const iframe = page.frameLocator('iframe[title="storybook-preview-iframe"]');

    // Expand toolbar and start with Flags
    const toolbarContainer = iframe.locator('[class*="toolbarContainer"]').first();
    await toolbarContainer.hover();
    await iframe.getByRole('tab', { name: 'Flags' }).click();

    // Navigate to Settings tab (Events tab temporarily disabled)
    await iframe.getByRole('tab', { name: 'Settings' }).click();
    await expect(iframe.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
    await expect(iframe.getByRole('tab', { name: 'Flags' })).toHaveAttribute('aria-selected', 'false');

    // Navigate back to Flags tab
    await iframe.getByRole('tab', { name: 'Flags' }).click();
    await expect(iframe.getByRole('tab', { name: 'Flags' })).toHaveAttribute('aria-selected', 'true');
    await expect(iframe.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'false');
  });

  test('should show search button and flag content', async ({ page }: { page: Page }) => {
    const iframe = page.frameLocator('iframe[title="storybook-preview-iframe"]');

    // Expand toolbar and go to Flags tab
    const toolbarContainer = iframe.locator('[class*="toolbarContainer"]').first();
    await toolbarContainer.hover();
    await iframe.getByRole('tab', { name: 'Flags' }).click();

    // Verify search functionality is available
    await expect(iframe.getByRole('button', { name: 'Search' })).toBeVisible();

    // Verify flag content is displayed
    await expect(iframe.getByTestId('flag-tab-content')).toBeVisible();

    // Verify flag toggles are functional
    const flagToggles = iframe.getByRole('switch');
    await expect(flagToggles.first()).toBeVisible();
  });

  test('should provide intuitive ways to close and collapse the toolbar', async ({ page }: { page: Page }) => {
    const iframe = page.frameLocator('iframe[title="storybook-preview-iframe"]');

    // Expand toolbar
    const toolbarContainer = iframe.locator('[class*="toolbarContainer"]').first();
    await toolbarContainer.hover();
    await iframe.getByRole('tab', { name: 'Flags' }).click();

    // Method 1: Use the close button
    await iframe.getByRole('button', { name: 'Close toolbar' }).click();
    await expect(iframe.getByRole('tab', { name: 'Flags' })).not.toBeVisible();
    await expect(iframe.getByRole('img', { name: 'LaunchDarkly' })).toBeVisible();

    // Method 2: Click outside to collapse (re-expand first)
    await toolbarContainer.hover();
    await iframe.getByRole('tab', { name: 'Settings' }).click(); // Changed from Events to Settings

    // Click outside the toolbar area
    await page.mouse.click(50, 50);
    await expect(iframe.getByRole('tab', { name: 'Settings' })).not.toBeVisible();
  });

  test('should maintain proper tab states when switching', async ({ page }: { page: Page }) => {
    const iframe = page.frameLocator('iframe[title="storybook-preview-iframe"]');
    const toolbarContainer = iframe.locator('[class*="toolbarContainer"]').first();

    // Expand and select Settings tab (Events tab temporarily disabled)
    await toolbarContainer.hover();
    await iframe.getByRole('tab', { name: 'Settings' }).click();
    await expect(iframe.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');

    // Switch to Flags tab and verify state change
    await iframe.getByRole('tab', { name: 'Flags' }).click();
    await expect(iframe.getByRole('tab', { name: 'Flags' })).toHaveAttribute('aria-selected', 'true');
    await expect(iframe.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'false');
    await expect(iframe.getByTestId('flag-tab-content')).toBeVisible();
  });

  test('should be responsive to mouse movement patterns', async ({ page }: { page: Page }) => {
    const iframe = page.frameLocator('iframe[title="storybook-preview-iframe"]');
    const toolbarContainer = iframe.locator('[class*="toolbarContainer"]').first();

    // Hover to expand
    await toolbarContainer.hover();
    await expect(iframe.getByRole('tab', { name: 'Flags' })).toBeVisible();

    // Move mouse away from toolbar to a safe area
    await page.mouse.move(300, 300);

    // Wait for potential collapse (toolbar should remain expanded when tabs are visible)
    await page.waitForTimeout(500);

    // Hover again to ensure toolbar still works
    await toolbarContainer.hover();
    await expect(iframe.getByRole('tab', { name: 'Flags' })).toBeVisible();
  });
});

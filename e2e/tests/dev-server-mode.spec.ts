import { expect, type Page } from '@playwright/test';
import { test } from '../setup/global';

test.describe('LaunchDarkly Toolbar - Dev Server Mode', () => {
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
    await page.waitForSelector('[data-testid="launchdarkly-toolbar"]');
    await expect(page.getByText('LaunchDarkly Toolbar Demo (dev server mode)')).toBeVisible();
  });

  test.describe('Dev Server Integration', () => {
    test('should initialize with LaunchDarkly dev server', async ({ page }: { page: Page }) => {
      // Verify toolbar loads in dev server mode
      await expect(page.getByRole('img', { name: 'LaunchDarkly' })).toBeVisible();

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Verify dev server mode tabs are available (no Events tab)
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Settings' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Events' })).not.toBeVisible(); // Dev server mode specific

      // Verify Flags tab shows dev server content
      await expect(page.getByTestId('flag-dev-server-tab-content')).toBeVisible();
    });

    test('should display flags from LaunchDarkly dev server', async ({ page }: { page: Page }) => {
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for dev server to connect and flags to load
      await page.waitForSelector('[data-testid="flag-dev-server-tab-content"]', { state: 'visible' });

      // Verify expected flags are present (based on mock data)
      await expect(page.getByText('test-flag-1')).toBeVisible();
      await expect(page.getByText('test-flag-2')).toBeVisible();
      await expect(page.getByText('numeric-flag')).toBeVisible();
    });

    test('should show flag types and current values', async ({ page }: { page: Page }) => {
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-dev-server-tab-content"]', { state: 'visible' });

      // Verify boolean flag display
      const booleanFlagSwitch = page.getByRole('switch').first();
      await expect(booleanFlagSwitch).toBeVisible();
      await expect(booleanFlagSwitch).not.toBeChecked(); // Default false per mock

      // Verify numeric flag display
      await expect(page.getByText('numeric-flag')).toBeVisible();

      // Verify project and environment information
      await page.getByRole('tab', { name: 'Settings' }).click();
      await expect(page.getByRole('button', { name: `${TEST_PROJECT_KEY} Select project` })).toBeVisible();
      await expect(page.getByText('test', { exact: true })).toBeVisible(); // sourceEnvironmentKey
    });
  });

  test.describe('Flag Override Management Workflow', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-dev-server-tab-content"]', { state: 'visible' });
    });

    test('should display flag management interface with dev server flags', async ({ page }: { page: Page }) => {
      // 1. Verify all expected flags are present with correct initial values
      await expect(page.getByText('test-flag-1')).toBeVisible();
      await expect(page.getByText('test-flag-2')).toBeVisible();
      await expect(page.getByText('numeric-flag')).toBeVisible();

      // 2. Verify boolean flag switch is present and has correct initial state
      const booleanFlagSwitch = page.getByRole('switch').first();
      await expect(booleanFlagSwitch).toBeVisible();
      await expect(booleanFlagSwitch).not.toBeChecked(); // Default false per mock

      // 3. Verify flag management buttons are present
      await expect(page.getByText('Remove all overrides (0)')).toBeVisible();
    });
  });

  test.describe('Dev Server Connection and Error Handling', () => {
    test('should automatically recover from connection failures', async ({ page }: { page: Page }) => {
      // Expand toolbar first
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Block dev server requests to simulate connection failure
      await page.route('**/dev/**', async (route) => {
        await route.abort();
      });

      await expect(page.getByText(/Error connecting to dev server/i)).toBeVisible();

      // Restore connection
      await page.unroute('**/dev/**');

      // Wait for automatic recovery (polling should detect server is back)
      await expect(page.getByText(/Error connecting to dev server/i)).not.toBeVisible({ timeout: 8000 });

      // Verify full functionality is restored
      await expect(page.getByTestId('flag-dev-server-tab-content')).toBeVisible();
      await expect(page.getByText('test-flag-1')).toBeVisible();
      await expect(page.getByText('test-flag-2')).toBeVisible();
      await expect(page.getByText('numeric-flag')).toBeVisible();
    });
  });
});

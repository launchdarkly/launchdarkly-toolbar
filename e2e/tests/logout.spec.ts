import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from '../setup/global';
import { blockApiResponses, waitForToolbarReady } from '../utils/apiMocking';

test.describe('LaunchDarkly Toolbar - Logout Functionality', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Block API responses to prevent timing issues during UI interaction tests
    await blockApiResponses(page);

    await page.goto('/sdk');
    await waitForToolbarReady(page);
  });

  test.describe('Logout Button', () => {
    test('should display logout button in settings tab', async ({ page }: { page: Page }) => {
      // 1. Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await expect(page.getByRole('tab', { name: 'Settings' })).toBeVisible();

      // 2. Navigate to Settings tab
      await page.getByRole('tab', { name: 'Settings' }).click();
      await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');

      // 3. Wait for Settings content to load and verify logout button is visible
      await expect(page.getByTestId('logout-button')).toBeVisible({ timeout: 10000 });
      await expect(page.getByTestId('logout-button')).toHaveAttribute('aria-label', 'Log out');
    });

    test('should show logout button in Account section', async ({ page }: { page: Page }) => {
      // 1. Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Settings' }).click();

      // 2. Wait for Settings content and verify Account section exists
      await expect(page.getByTestId('logout-button')).toBeVisible({ timeout: 10000 });

      // 3. Verify button text
      const logoutButton = page.getByTestId('logout-button');
      await expect(logoutButton).toContainText('Log out');
    });

    test('should be keyboard accessible', async ({ page }: { page: Page }) => {
      // 1. Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Settings' }).click();

      // 2. Wait for logout button to be visible
      const logoutButton = page.getByTestId('logout-button');
      await expect(logoutButton).toBeVisible({ timeout: 10000 });

      // 3. Test keyboard navigation
      await logoutButton.focus();
      await expect(logoutButton).toBeFocused();

      // 4. Verify button can be activated with Enter key (we'll test the actual logout separately)
      // Just verify the button is focusable and has proper keyboard support
      await page.keyboard.press('Tab');
      // Button should no longer be focused after tab
      await expect(logoutButton).not.toBeFocused();
    });
  });

  test.describe('Logout Functionality', () => {
    test('should handle logout successfully and show login screen', async ({ page }: { page: Page }) => {
      // 1. Setup message listener to verify logout message is sent
      const messages: any[] = [];
      await page.evaluate(() => {
        window.addEventListener('message', (event) => {
          if (event.data.type === 'logout') {
            (window as any).__logoutMessageReceived = true;
          }
        });
      });

      // 2. Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Settings' }).click();

      // 3. Wait for logout button and click it
      const logoutButton = page.getByTestId('logout-button');
      await expect(logoutButton).toBeVisible({ timeout: 10000 });

      // 4. Click logout button
      await logoutButton.click();

      await page.waitForTimeout(500);

      // 5. Verify authentication state changed - should show login screen
      // The toolbar should show the login/authentication UI after logout
      await expect(page.getByTestId('login-screen')).toBeVisible({ timeout: 5000 });
    });

    test('should support logout via keyboard', async ({ page }: { page: Page }) => {
      // 1. Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Settings' }).click();

      // 2. Navigate to logout button via keyboard
      const logoutButton = page.getByTestId('logout-button');
      await expect(logoutButton).toBeVisible({ timeout: 10000 });
      await logoutButton.focus();
      await expect(logoutButton).toBeFocused();

      // 3. Activate logout with Enter key
      await page.keyboard.press('Enter');

      // 4. Verify logout was successful
      await expect(page.getByTestId('login-screen')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Logout in Different Modes', () => {
    test('should show logout button in dev-server mode', async ({ page }: { page: Page }) => {
      // Navigate to dev-server mode
      await page.goto('/dev-server');
      await waitForToolbarReady(page);

      // Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Settings' }).click();

      // Verify logout button is visible in dev-server mode
      const logoutButton = page.getByTestId('logout-button');
      await expect(logoutButton).toBeVisible({ timeout: 10000 });
      await expect(logoutButton).toContainText('Log out');
    });

    test('should handle logout in dev-server mode', async ({ page }: { page: Page }) => {
      // Navigate to dev-server mode
      await page.goto('/dev-server');
      await waitForToolbarReady(page);

      // Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Settings' }).click();

      // Click logout button
      const logoutButton = page.getByTestId('logout-button');
      await expect(logoutButton).toBeVisible({ timeout: 10000 });

      await logoutButton.click();

      // Verify logout was successful
      await expect(page.getByTestId('login-screen')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Search Integration', () => {
    test('should find logout option when searching', async ({ page }: { page: Page }) => {
      // 1. Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Settings' }).click();

      // 2. Open search
      await page.getByRole('button', { name: /search/i }).click();
      const searchInput = page.getByPlaceholder('Search');
      await expect(searchInput).toBeVisible();

      // 3. Search for "logout"
      await searchInput.fill('logout');

      // 4. Verify logout button is still visible after search
      const logoutButton = page.getByTestId('logout-button');
      await expect(logoutButton).toBeVisible();
    });

    test('should find logout option when searching for "log out"', async ({ page }: { page: Page }) => {
      // 1. Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Settings' }).click();

      // 2. Open search
      await page.getByRole('button', { name: /search/i }).click();
      const searchInput = page.getByPlaceholder('Search');
      await expect(searchInput).toBeVisible();

      // 3. Search for "log out"
      await searchInput.fill('log out');

      // 4. Verify logout button is still visible after search
      const logoutButton = page.getByTestId('logout-button');
      await expect(logoutButton).toBeVisible();
    });

    test('should hide logout option when searching for unrelated term', async ({ page }: { page: Page }) => {
      // 1. Expand toolbar and navigate to Settings
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Settings' }).click();

      // 2. Wait for logout button to be visible initially
      await expect(page.getByTestId('logout-button')).toBeVisible({ timeout: 10000 });

      // 3. Open search
      await page.getByRole('button', { name: /search/i }).click();
      const searchInput = page.getByPlaceholder('Search');
      await expect(searchInput).toBeVisible();

      // 4. Search for unrelated term
      await searchInput.fill('position');

      // 5. Verify logout button is not visible after filtering
      // (or the Account section is hidden if no items match)
      const logoutButton = page.getByTestId('logout-button');
      await expect(logoutButton).not.toBeVisible();
    });
  });
});

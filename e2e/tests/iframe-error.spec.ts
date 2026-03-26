import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from '../setup/global';

/**
 * Block all postMessage communication from the iframe so the toolbar
 * never receives an auth response and eventually shows the error screen.
 */
async function blockAllIframeMessages(page: Page) {
  await page.addInitScript(() => {
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function (this: any, type: any, listener: any, options: any) {
      if (type === 'message') {
        const wrappedListener = function (this: any, event: any) {
          const data = event.data;
          if (data && data.type && typeof data.type === 'string') {
            console.log('[Test] Blocked iframe message:', data.type);
            return;
          }
          (listener as any).call(this, event);
        };
        return originalAddEventListener.call(this, type, wrappedListener as any, options);
      }
      return originalAddEventListener.call(this, type, listener, options);
    } as any;
  });
}

test.describe('LaunchDarkly Toolbar - Iframe Error Screen', () => {
  test('should show error screen when iframe communication is blocked', async ({ page }: { page: Page }) => {
    await blockAllIframeMessages(page);

    await page.goto('/sdk');

    await page.getByTestId('launchdarkly-toolbar').waitFor({ state: 'visible' });

    await page.getByRole('img', { name: 'LaunchDarkly' }).click();

    const errorScreen = page.getByTestId('iframe-error-screen');
    await expect(errorScreen).toBeVisible({ timeout: 15000 });

    await expect(page.getByText('Unable to connect to LaunchDarkly')).toBeVisible();
    await expect(page.getByText(/domain that is not whitelisted/)).toBeVisible();
  });

  test('should display a link to the integration settings page', async ({ page }: { page: Page }) => {
    await blockAllIframeMessages(page);

    await page.goto('/sdk');
    await page.getByTestId('launchdarkly-toolbar').waitFor({ state: 'visible' });
    await page.getByRole('img', { name: 'LaunchDarkly' }).click();

    const errorScreen = page.getByTestId('iframe-error-screen');
    await expect(errorScreen).toBeVisible({ timeout: 15000 });

    const whitelistLink = page.getByRole('link', { name: /here to whitelist your domain/i });
    await expect(whitelistLink).toBeVisible();
    await expect(whitelistLink).toHaveAttribute('target', '_blank');

    const href = await whitelistLink.getAttribute('href');
    expect(href).toContain('/settings/integrations/launchdarkly-developer-toolbar/new');
  });

  test('should not show normal toolbar content when in error state', async ({ page }: { page: Page }) => {
    await blockAllIframeMessages(page);

    await page.goto('/sdk');
    await page.getByTestId('launchdarkly-toolbar').waitFor({ state: 'visible' });
    await page.getByRole('img', { name: 'LaunchDarkly' }).click();

    const errorScreen = page.getByTestId('iframe-error-screen');
    await expect(errorScreen).toBeVisible({ timeout: 15000 });

    await expect(page.getByLabel('Flags', { exact: true })).not.toBeVisible();
    await expect(page.getByLabel('Analytics', { exact: true })).not.toBeVisible();
    await expect(page.getByLabel('Settings', { exact: true })).not.toBeVisible();
  });
});

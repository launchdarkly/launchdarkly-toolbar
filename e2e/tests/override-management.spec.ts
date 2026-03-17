import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from '../setup/global';
import { waitForToolbarReady } from '../utils/apiMocking';
import { ToolbarPage } from '../pages/ToolbarPage';

test.describe('LaunchDarkly Toolbar - Override Management', () => {
  let toolbarPage: ToolbarPage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/sdk');
    await waitForToolbarReady(page);
    toolbarPage = new ToolbarPage(page);
    await toolbarPage.expandAndWaitForFlags();
  });

  test.describe('Individual Override Removal', () => {
    test('should remove a boolean flag override via override dot', async ({ page }: { page: Page }) => {
      await toolbarPage.toggleBooleanFlag();

      const overrideDot = page.getByTestId('override-dot').first();
      await expect(overrideDot).toBeVisible();

      await overrideDot.click();
      await expect(page.getByTestId('override-dot')).not.toBeVisible({ timeout: 5000 });
    });

    test('should show remove flag override label on override dot', async ({ page }: { page: Page }) => {
      await toolbarPage.toggleBooleanFlag();

      const overrideDot = page.getByLabel('Remove flag override').first();
      await expect(overrideDot).toBeVisible();
    });
  });

  test.describe('String Flag Override', () => {
    test('should override a string flag via edit dialog', async ({ page }: { page: Page }) => {
      const stringFlagItem = page.getByTestId('flag-item-string-flag');
      const editButton = stringFlagItem.getByRole('button', { name: 'Edit' });
      await expect(editButton).toBeVisible();
      await editButton.click();

      // The input appears with placeholder matching the flag type
      const input = stringFlagItem.getByRole('textbox');
      await expect(input).toBeVisible();
      await input.fill('e2e-override-value');

      await stringFlagItem.getByRole('button', { name: 'Confirm' }).click();
      await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });
    });

    test('should remove string flag override individually', async ({ page }: { page: Page }) => {
      const stringFlagItem = page.getByTestId('flag-item-string-flag');
      await stringFlagItem.getByRole('button', { name: 'Edit' }).click();

      const input = stringFlagItem.getByRole('textbox');
      await expect(input).toBeVisible();
      await input.fill('e2e-override-value');
      await stringFlagItem.getByRole('button', { name: 'Confirm' }).click();
      await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });

      const overrideDot = page.getByLabel('Remove flag override').first();
      await overrideDot.click();
      await expect(page.getByTestId('override-dot')).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Number Flag Override', () => {
    test('should override a number flag via edit dialog', async ({ page }: { page: Page }) => {
      const numberFlagItem = page.getByTestId('flag-item-number-flag');
      const editButton = numberFlagItem.getByRole('button', { name: 'Edit' });
      await expect(editButton).toBeVisible();
      await editButton.click();

      const input = numberFlagItem.getByRole('spinbutton');
      await expect(input).toBeVisible();
      await input.fill('999');

      await numberFlagItem.getByRole('button', { name: 'Confirm' }).click();
      await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('JSON Flag Override', () => {
    test('should override a JSON flag via editor', async ({ page }: { page: Page }) => {
      const jsonFlagItem = page.getByTestId('flag-item-json-object-flag');
      const editButton = jsonFlagItem.getByRole('button', { name: 'Edit JSON' });
      await expect(editButton).toBeVisible();
      await editButton.click();

      const jsonEditor = page.getByTestId('json-editor-json-object-flag').locator('.cm-content');
      await expect(jsonEditor).toBeVisible();

      const customJson = '{"environment": "e2e-test", "enabled": true}';
      await jsonEditor.click();
      await page.keyboard.press('ControlOrMeta+a');
      await page.keyboard.type(customJson);
      await jsonFlagItem.getByRole('button', { name: 'Save' }).click();

      await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Multi-Flag Override Lifecycle', () => {
    test('should manage overrides across multiple flag types', async ({ page }: { page: Page }) => {
      // 1. Override boolean flag
      await toolbarPage.toggleBooleanFlag();
      await expect(page.getByTestId('override-dot').first()).toBeVisible();

      // 2. Override string flag
      const stringFlagItem = page.getByTestId('flag-item-string-flag');
      await stringFlagItem.getByRole('button', { name: 'Edit' }).click();
      const stringInput = stringFlagItem.getByRole('textbox');
      await expect(stringInput).toBeVisible();
      await stringInput.fill('multi-override-test');
      await stringFlagItem.getByRole('button', { name: 'Confirm' }).click();
      await page.waitForTimeout(500);

      // 3. Filter to show only overrides via filter overlay
      await page.getByRole('button', { name: 'Filter', exact: true }).click();
      await expect(page.getByRole('dialog', { name: 'Filter options' })).toBeVisible();
      await page.getByRole('checkbox', { name: 'Show overridden flags' }).click();
      await page.keyboard.press('Escape');

      // Only overridden flags should be visible
      const toolbar = toolbarPage.toolbarRoot();
      await expect(toolbar.getByText('boolean-flag').first()).toBeVisible();
      await expect(toolbar.getByText('string-flag').first()).toBeVisible();

      // 4. Remove one override individually
      const booleanOverrideDot = page.getByLabel('Remove flag override').first();
      await booleanOverrideDot.click();
      await page.waitForTimeout(500);

      // 5. Clear all remaining overrides
      const clearOverridesBtn = page.getByLabel(/clear overrides/i);
      if (
        await clearOverridesBtn
          .first()
          .isVisible()
          .catch(() => false)
      ) {
        await clearOverridesBtn.first().click();
      }

      // 6. Show all flags via filter overlay
      await page.getByRole('button', { name: 'Filter', exact: true }).click();
      await expect(page.getByRole('dialog', { name: 'Filter options' })).toBeVisible();
      await page.getByRole('checkbox', { name: 'Show all flags' }).click();
      await page.keyboard.press('Escape');

      // All flags should be visible and overrides should be cleared
      await expect(toolbar.getByText('boolean-flag').first()).toBeVisible();
      await expect(toolbar.getByText('string-flag').first()).toBeVisible();
    });
  });

  test.describe('Override Persistence', () => {
    test('should persist boolean override across page reload', async ({ page }: { page: Page }) => {
      await toolbarPage.toggleBooleanFlag();
      await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });

      // Reload the page
      await page.reload();
      await waitForToolbarReady(page);

      // Re-expand toolbar
      await toolbarPage.expand();
      await toolbarPage.expectExpanded();
      await expect(page.getByText('boolean-flag').first()).toBeVisible({ timeout: 5000 });

      // Override should still be present
      await expect(page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });
    });
  });
});

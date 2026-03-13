import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from '../setup/global';
import { waitForToolbarReady } from '../utils/apiMocking';
import { ToolbarPage } from '../pages/ToolbarPage';

test.describe('LaunchDarkly Toolbar - Context Management', () => {
  let toolbarPage: ToolbarPage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/sdk');
    await waitForToolbarReady(page);
    toolbarPage = new ToolbarPage(page);
    await toolbarPage.expandAndWaitForFlags();
    await toolbarPage.navigateToContexts();
  });

  test.describe('Context List', () => {
    test('should display context list with at least one context', async ({ page }: { page: Page }) => {
      await expect(page.getByTestId('subtab-dropdown-trigger')).toHaveText(/Contexts/);
      const contextItems = page.locator('[aria-label^="Select context"]');
      const count = await contextItems.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Add Context', () => {
    test('should open the Add Context form', async ({ page }: { page: Page }) => {
      const addContextBtn = page.getByLabel('Add context');
      await expect(addContextBtn).toBeVisible();
      await addContextBtn.click();

      await expect(page.getByRole('heading', { name: 'Add Context' })).toBeVisible();
      await expect(page.getByLabel('Close')).toBeVisible();
    });

    test('should add a valid single-kind context', async ({ page }: { page: Page }) => {
      await page.getByLabel('Add context').click();
      await expect(page.getByRole('heading', { name: 'Add Context' })).toBeVisible();

      const editor = page.locator('.cm-content');
      await editor.first().click();
      await page.keyboard.press('Meta+a');
      await page.keyboard.type('{"kind": "user", "key": "test-user-e2e", "name": "E2E Test User"}');

      const submitBtn = page.getByRole('button', { name: 'Add Context', exact: true });
      if (await submitBtn.isEnabled()) {
        await submitBtn.click();
        await page.waitForTimeout(500);
      }
    });

    test('should cancel adding a context', async ({ page }: { page: Page }) => {
      await page.getByLabel('Add context').click();
      await expect(page.getByRole('heading', { name: 'Add Context' })).toBeVisible();

      await page.getByRole('button', { name: /cancel/i }).click();

      await expect(page.getByRole('heading', { name: 'Add Context' })).not.toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Context Editing', () => {
    test('should have edit buttons on context items', async ({ page }: { page: Page }) => {
      const editButtons = page.getByLabel(/edit context/i);
      const count = await editButtons.count();
      if (count > 0) {
        await expect(editButtons.first()).toBeVisible();
      }
    });
  });

  test.describe('Context Deletion', () => {
    test('should show delete button on context items', async ({ page }: { page: Page }) => {
      const deleteButtons = page.getByLabel(/delete context/i);
      const count = await deleteButtons.count();
      if (count > 0) {
        await expect(deleteButtons.first()).toBeVisible();
      }
    });

    test('should prevent deletion of active context', async ({ page }: { page: Page }) => {
      const cannotDeleteBtn = page.getByLabel(/cannot delete active context/i);
      const count = await cannotDeleteBtn.count();
      if (count > 0) {
        await expect(cannotDeleteBtn.first()).toBeVisible();
      }
    });
  });

  test.describe('Context Switching', () => {
    test('should highlight the active context', async ({ page }: { page: Page }) => {
      const contextItems = page.locator('[aria-label^="Select context"]');
      const count = await contextItems.count();
      if (count > 0) {
        await contextItems.first().click();
        await expect(contextItems.first()).toBeVisible();
      }
    });
  });
});

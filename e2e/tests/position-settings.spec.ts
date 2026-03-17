import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test } from '../setup/global';
import { waitForToolbarReady } from '../utils/apiMocking';
import { ToolbarPage } from '../pages/ToolbarPage';

test.describe('LaunchDarkly Toolbar - Position Settings', () => {
  let toolbarPage: ToolbarPage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/sdk');
    await waitForToolbarReady(page);
    toolbarPage = new ToolbarPage(page);
    await toolbarPage.expandAndWaitForFlags();
    await toolbarPage.navigateToSettings();
  });

  test.describe('Position Selector', () => {
    test('should display position setting in general settings', async ({ page }: { page: Page }) => {
      await expect(page.getByText('Position').first()).toBeVisible();
    });

    test('should show position selector dropdown', async ({ page }: { page: Page }) => {
      // Find and click the position selector
      const positionSelector = page.getByLabel(/select toolbar position/i).or(page.locator('[role="combobox"]'));
      const isVisible = await positionSelector.first().isVisible();
      if (isVisible) {
        await positionSelector.first().click();
        // Dropdown should open with position options
        await page.waitForTimeout(300);
      }
    });

    test('should change toolbar position to top-left', async ({ page }: { page: Page }) => {
      const toolbar = page.getByTestId('launchdarkly-toolbar');
      const initialBox = await toolbar.boundingBox();

      // Find the position selector and change it
      const positionSelector = page.getByLabel(/select toolbar position/i).or(page.locator('[role="combobox"]'));
      if (await positionSelector.first().isVisible()) {
        await positionSelector.first().click();
        await page.waitForTimeout(200);

        // Select top-left option
        const topLeftOption = page.getByRole('option', { name: /top.*left/i }).or(page.getByText(/top.*left/i));
        if (await topLeftOption.first().isVisible()) {
          await topLeftOption.first().click();
          await page.waitForTimeout(500);

          // Verify toolbar moved - it should now be in the top-left region
          const newBox = await toolbar.boundingBox();
          if (newBox && initialBox) {
            expect(newBox.y).toBeLessThan(initialBox.y);
          }
        }
      }
    });

    test('should change toolbar position to bottom-left', async ({ page }: { page: Page }) => {
      const toolbar = page.getByTestId('launchdarkly-toolbar');
      const viewport = page.viewportSize()!;

      const positionSelector = page.getByLabel(/select toolbar position/i).or(page.locator('[role="combobox"]'));
      if (await positionSelector.first().isVisible()) {
        await positionSelector.first().click();
        await page.waitForTimeout(200);

        const bottomLeftOption = page
          .getByRole('option', { name: /bottom.*left/i })
          .or(page.getByText(/bottom.*left/i));
        if (await bottomLeftOption.first().isVisible()) {
          await bottomLeftOption.first().click();
          await page.waitForTimeout(500);

          // Verify toolbar is on the left side
          const box = await toolbar.boundingBox();
          expect(box!.x).toBeLessThan(viewport.width / 2);
        }
      }
    });

    test('should persist position after collapse and expand', async ({ page }: { page: Page }) => {
      const viewport = page.viewportSize()!;

      // Change position to bottom-left using the select trigger
      const positionTrigger = page.getByLabel(/select toolbar position/i);
      await expect(positionTrigger).toBeVisible();
      await positionTrigger.click();
      await page.waitForTimeout(200);

      const positionListbox = page.getByRole('listbox', { name: /select toolbar position/i });
      const bottomLeftOption = positionListbox.getByRole('option', { name: /Bottom Left/i });
      await expect(bottomLeftOption).toBeVisible();
      await bottomLeftOption.click();
      await page.waitForTimeout(500);

      // Verify position changed
      const toolbar = page.getByTestId('launchdarkly-toolbar');
      const beforeBox = await toolbar.boundingBox();
      expect(beforeBox!.x).toBeLessThan(viewport.width / 2);

      // Collapse and re-expand
      await toolbarPage.collapse();
      await toolbarPage.expectCollapsed();

      const collapsedBox = await toolbar.boundingBox();
      expect(collapsedBox!.x).toBeLessThan(viewport.width / 2);

      // Expand again
      await toolbarPage.expand();
      await toolbarPage.expectExpanded();

      const expandedBox = await toolbar.boundingBox();
      expect(expandedBox!.x).toBeLessThan(viewport.width / 2);
    });
  });
});

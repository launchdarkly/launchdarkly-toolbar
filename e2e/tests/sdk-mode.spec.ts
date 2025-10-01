import { expect, type Page } from '@playwright/test';
import { test } from '../setup/global';

test.describe('LaunchDarkly Toolbar - SDK Mode', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/sdk');
    await page.waitForSelector('[data-testid="launchdarkly-toolbar"]');
    await expect(page.getByText('LaunchDarkly Toolbar Demo (sdk mode)')).toBeVisible();
  });

  test.describe('SDK Integration', () => {
    test('should initialize with LaunchDarkly SDK', async ({ page }: { page: Page }) => {
      // Verify toolbar loads in SDK mode
      await expect(page.getByRole('img', { name: 'LaunchDarkly' })).toBeVisible();

      // Expand toolbar
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Verify SDK mode tabs are available
      await expect(page.getByRole('tab', { name: 'Flags' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Events' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'Settings' })).toBeVisible();

      // Verify Flags tab shows SDK content
      await expect(page.getByTestId('flag-sdk-tab-content')).toBeVisible();
    });

    test('should display flags from LaunchDarkly SDK', async ({ page }: { page: Page }) => {
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();

      // Wait for SDK to initialize and flags to load
      await page.waitForSelector('[data-testid="flag-sdk-tab-content"]', { state: 'visible' });

      // Verify expected flags are present (based on mock data)
      await expect(page.getByText('Boolean Flag')).toBeVisible();
      await expect(page.getByText('Json Object Flag')).toBeVisible();
      await expect(page.getByText('Number Flag')).toBeVisible();
      await expect(page.getByText('String Flag')).toBeVisible();
    });

    test('should show flag types and current values', async ({ page }: { page: Page }) => {
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-sdk-tab-content"]', { state: 'visible' });

      // Verify boolean flag display
      const booleanFlagSwitch = page.getByTestId('flag-switch-boolean-flag');
      await expect(booleanFlagSwitch).toBeVisible();
      await expect(booleanFlagSwitch).not.toBeChecked(); // Default false

      // Verify string flag display
      const stringFlagValue = page.getByTestId('flag-value-string-flag');
      await expect(stringFlagValue).toBeVisible();
      await expect(stringFlagValue).toHaveText('default-string-value');

      // Verify number flag display
      const numberFlagValue = page.getByTestId('flag-value-number-flag');
      await expect(numberFlagValue).toBeVisible();
      await expect(numberFlagValue).toHaveText('42');
    });
  });

  test.describe('Flag Override Management Workflow', () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
    });

    test('should support end-to-end flag override lifecycle with all flag types', async ({ page }: { page: Page }) => {
      // 1. Verify initial clean state
      await expect(page.getByText('Clear all overrides (0)')).toBeVisible();
      await expect(page.getByTestId('override-indicator')).not.toBeVisible();

      // Verify all expected flags are present with correct initial values
      await expect(page.getByText('Boolean Flag')).toBeVisible();
      await expect(page.getByText('String Flag')).toBeVisible();
      await expect(page.getByText('Number Flag')).toBeVisible();
      await expect(page.getByText('Json Object Flag')).toBeVisible();

      const booleanFlagSwitch = page.getByTestId('flag-switch-boolean-flag');
      const stringFlagValue = page.getByTestId('flag-value-string-flag');
      const numberFlagValue = page.getByTestId('flag-value-number-flag');

      await expect(booleanFlagSwitch).not.toBeChecked();
      await expect(stringFlagValue).toHaveText('default-string-value');
      await expect(numberFlagValue).toHaveText('42');

      // 2. Create overrides for all flag types
      // Boolean flag override
      await booleanFlagSwitch.click();
      await expect(booleanFlagSwitch).toBeChecked();
      await expect(page.getByTestId('flag-row-boolean-flag').getByTestId('override-indicator')).toBeVisible();
      await expect(page.getByText('Clear all overrides (1)')).toBeVisible();

      // String flag override
      await page.getByTestId('flag-control-string-flag').getByRole('button', { name: 'Edit' }).click();
      const stringInput = page.getByTestId('flag-input-string-flag');
      await stringInput.fill('test-override-string');
      await page.getByRole('button', { name: 'Confirm' }).click();
      await expect(stringFlagValue).toHaveText('test-override-string');
      await expect(page.getByTestId('flag-row-string-flag').getByTestId('override-indicator')).toBeVisible();
      await expect(page.getByText('Clear all overrides (2)')).toBeVisible();

      // Number flag override
      await page.getByTestId('flag-control-number-flag').getByRole('button', { name: 'Edit' }).click();
      const numberInput = page.getByTestId('flag-input-number-flag');
      await numberInput.fill('777');
      await page.getByRole('button', { name: 'Confirm' }).click();
      await expect(numberFlagValue).toHaveText('777');
      await expect(page.getByTestId('flag-row-number-flag').getByTestId('override-indicator')).toBeVisible();
      await expect(page.getByText('Clear all overrides (3)')).toBeVisible();

      // JSON flag override
      await page.getByTestId('flag-control-json-object-flag').getByRole('button', { name: 'Edit' }).click();
      const jsonInput = page.getByTestId('flag-input-json-object-flag');
      const customJson = '{"environment": "test", "feature": "enabled", "count": 42}';
      await jsonInput.fill(customJson);
      await page.getByRole('button', { name: 'Confirm' }).click();
      await expect(page.getByTestId('flag-row-json-object-flag').getByTestId('override-indicator')).toBeVisible();
      await expect(page.getByText('Clear all overrides (4)')).toBeVisible();

      // 3. Test "Show overrides only" filtering
      const showOverridesButton = page.getByTestId('show-overrides-only-button');
      await showOverridesButton.click();

      // Only overridden flags should be visible
      await expect(page.getByTestId('flag-name-boolean-flag')).toBeVisible();
      await expect(page.getByTestId('flag-name-string-flag')).toBeVisible();
      await expect(page.getByTestId('flag-name-number-flag')).toBeVisible();
      await expect(page.getByTestId('flag-name-json-object-flag')).toBeVisible();

      // 4. Test individual override removal
      const booleanOverrideIndicator = page.getByTestId('flag-row-boolean-flag').getByTestId('override-indicator');
      await booleanOverrideIndicator.hover();
      await expect(page.getByTestId('flag-row-boolean-flag').getByText('Remove')).toBeVisible();
      await booleanOverrideIndicator.click();

      // Verify removal
      await expect(page.getByTestId('flag-row-boolean-flag').getByTestId('override-indicator')).not.toBeVisible();
      await expect(page.getByText('Clear all overrides (3)')).toBeVisible();

      // In overrides-only view, boolean flag should disappear
      await expect(page.getByTestId('flag-name-boolean-flag')).not.toBeVisible();

      // 5. Turn off filter and verify all flags visible again
      await showOverridesButton.click();
      await expect(page.getByTestId('flag-name-boolean-flag')).toBeVisible();
      await expect(page.getByTestId('flag-name-string-flag')).toBeVisible();
      await expect(page.getByTestId('flag-name-number-flag')).toBeVisible();
      await expect(page.getByTestId('flag-name-json-object-flag')).toBeVisible();

      // 6. Test override persistence across page reload
      await page.reload();
      await page.waitForSelector('[data-testid="launchdarkly-toolbar"]');
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.waitForSelector('[data-testid="flag-sdk-tab-content"]', { state: 'visible' });

      // Verify overrides persisted
      await expect(page.getByText('Clear all overrides (3)')).toBeVisible();
      const reloadedStringValue = page.getByTestId('flag-value-string-flag');
      const reloadedNumberValue = page.getByTestId('flag-value-number-flag');
      await expect(reloadedStringValue).toHaveText('test-override-string');
      await expect(reloadedNumberValue).toHaveText('777');
      // Boolean flag override was removed, so it should not have an override indicator
      await expect(page.getByTestId('flag-row-boolean-flag').getByTestId('override-indicator')).not.toBeVisible();

      // 7. Test clear all overrides
      const clearAllButton = page.getByTestId('clear-all-overrides-button');
      await clearAllButton.click();

      // Verify all overrides cleared
      await expect(page.getByText('Clear all overrides (0)')).toBeVisible();
      await expect(page.getByTestId('override-indicator')).not.toBeVisible();
      const clearedStringValue = page.getByTestId('flag-value-string-flag');
      const clearedNumberValue = page.getByTestId('flag-value-number-flag');
      await expect(clearedStringValue).toHaveText('default-string-value');
      await expect(clearedNumberValue).toHaveText('42');

      // 8. Test "Show overrides only" with no overrides
      await showOverridesButton.click();
      await expect(page.getByText('No overridden flags found')).toBeVisible();
      await expect(page.getByText('No overridden flags match your search')).toBeVisible();
    });

    test('should handle basic JSON flag functionality', async ({ page }: { page: Page }) => {
      // 1. Verify JSON flag is present and visible
      const jsonFlagRow = page.getByTestId('flag-row-json-object-flag');
      await expect(jsonFlagRow).toBeVisible();
      await expect(page.getByText('Json Object Flag')).toBeVisible();

      // 2. Test basic JSON override creation
      const jsonFlagEditButton = page
        .getByTestId('flag-control-json-object-flag')
        .getByRole('button', { name: 'Edit' });

      await jsonFlagEditButton.click();
      const jsonInput = page.getByTestId('flag-input-json-object-flag');

      const validJson = '{"environment": "test", "enabled": true}';
      await jsonInput.fill(validJson);

      const confirmButton = page.getByRole('button', { name: 'Confirm' });
      await confirmButton.click();

      // Verify override was created
      await expect(jsonFlagRow.getByTestId('override-indicator')).toBeVisible();
      await expect(page.getByText('Clear all overrides (1)')).toBeVisible();

      // 3. Verify JSON flag appears in flag list
      await expect(page.getByTestId('flag-name-json-object-flag')).toBeVisible();
    });
  });

  test.describe('Event Interception and Management Workflow', () => {
    test('should render Add Feature Flag button for unknown flags', async ({ page }: { page: Page }) => {
      await page.getByRole('img', { name: 'LaunchDarkly' }).click();
      await page.getByRole('tab', { name: 'Events' }).click();

      // Click the "Test Unknown Flag Event" button to generate an unknown flag event
      const testUnknownFlagButton = page.getByRole('button', { name: '❓ Test Unknown Flag Event' });
      await testUnknownFlagButton.click();

      // Newest event should appear at the top of the list
      const eventItems = page.getByTestId('event-item');

      // Get flag evaluation event - should be first in the list
      const firstEvent = eventItems.nth(0);
      await expect(firstEvent).toBeVisible();
      await expect(firstEvent.getByText('test-not-found-flag')).toBeVisible();

      // Verify the event appears in the Events tab with an "Add Feature Flag" button
      const addFlagButton = firstEvent.getByLabel('Add Feature Flag');
      await expect(addFlagButton).toBeVisible();
    });
  });
});

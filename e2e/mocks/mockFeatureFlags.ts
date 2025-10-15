import type { Page } from '@playwright/test';

// Match LaunchDarkly SDK endpoints regardless of base URL
const LD_BASE_URL = '**/sdk/evalx/**';
const LD_EVENT_STREAM_URL = '**/eval/**';

// Static fixture flags
export const FIXTURE_FLAGS = {
  'boolean-flag': { value: false, version: 1 },
  'json-object-flag': { value: { key: 'value', nested: { prop: 123 } }, version: 2 },
  'number-flag': { value: 42, version: 3 },
  'string-flag': { value: 'default-string-value', version: 4 },
};

/**
 * Mock LaunchDarkly feature flags for testing
 * @param page - Playwright page instance
 * @param flagsToOverride - Optional flags to override the fixture defaults
 */
export async function mockFeatureFlags(page: Page, flagsToOverride: Record<string, any> = {}) {
  // Clear any existing routes
  await page.unroute(LD_BASE_URL);
  await page.unroute(LD_EVENT_STREAM_URL);

  // Clone FIXTURE_FLAGS and merge with any overrides
  const flags = { ...structuredClone(FIXTURE_FLAGS), ...flagsToOverride };

  // Mock base URL for flag polling
  await page.route(LD_BASE_URL, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(flags),
    });
  });

  // Mock event stream URL - return with appropriate content type but undefined body to prevent updates
  await page.route(LD_EVENT_STREAM_URL, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      headers: {
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
      body: undefined,
    });
  });
}

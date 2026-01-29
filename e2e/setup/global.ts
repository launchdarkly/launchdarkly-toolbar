import { test as base } from '@playwright/test';
import { mockFeatureFlags, FIXTURE_FLAGS_LEGACY } from '../mocks/mockFeatureFlags';

// Default test fixture - uses new toolbar design
export const test = base.extend({
  page: async ({ page }, use) => {
    await mockFeatureFlags(page);
    await use(page);
  },
});

// Legacy test fixture - uses old toolbar design for existing tests
export const testLegacy = base.extend({
  page: async ({ page }, use) => {
    await mockFeatureFlags(page, FIXTURE_FLAGS_LEGACY);
    await use(page);
  },
});

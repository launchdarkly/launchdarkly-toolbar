import { test as base } from '@playwright/test';
import { mockFeatureFlags } from '../mocks/mockFeatureFlags';

export const test = base.extend({
  page: async ({ page }, use) => {
    await mockFeatureFlags(page);
    await use(page);
  },
});

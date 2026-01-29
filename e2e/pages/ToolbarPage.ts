import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class ToolbarPage {
  constructor(private readonly page: Page) {}

  toolbarRoot(): Locator {
    return this.page.getByTestId('launchdarkly-toolbar');
  }

  async gotoSdkAndWaitReady(): Promise<void> {
    await this.page.goto('/sdk');
    await this.toolbarRoot().waitFor({ state: 'visible' });
    await this.page.getByTestId('login-screen').waitFor({ state: 'hidden', timeout: 10000 });
  }

  async expectCollapsed(): Promise<void> {
    await expect(this.toolbarRoot()).toHaveAttribute('role', 'button');
    await expect(this.toolbarRoot()).toHaveAttribute('aria-label', 'Open LaunchDarkly toolbar');
  }

  async expand(): Promise<void> {
    await this.toolbarRoot().click();
  }

  async expectExpanded(): Promise<void> {
    await expect(this.toolbarRoot()).toHaveAttribute('role', 'toolbar');
    await expect(this.toolbarRoot()).toHaveAttribute('aria-label', 'LaunchDarkly toolbar');
  }

  async selectIcon(label: string): Promise<void> {
    await this.page.getByRole('button', { name: label, exact: true }).click();
  }

  async openSubtabDropdown(): Promise<void> {
    await this.page.getByTestId('subtab-dropdown-trigger').click();
    await this.page.getByTestId('subtab-dropdown-listbox').waitFor({ state: 'visible' });
  }

  async selectSubtab(label: string): Promise<void> {
    await this.page.getByRole('option', { name: label, exact: true }).click();
    await this.page.getByTestId('subtab-dropdown-listbox').waitFor({ state: 'hidden' });
  }

  flagItem(flagKey: string): Locator {
    return this.page.getByTestId(`flag-item-${flagKey}`);
  }
}

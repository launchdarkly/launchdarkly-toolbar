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

  async collapse(): Promise<void> {
    await this.page.getByRole('button', { name: 'Collapse toolbar' }).click();
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

  async dismissAnalyticsPopup(): Promise<void> {
    const declineButton = this.page.getByRole('button', { name: 'Decline' });
    if (await declineButton.isVisible().catch(() => false)) {
      await declineButton.click();
    }
  }

  async navigateToSettings(): Promise<void> {
    await this.selectIcon('Settings');
    await expect(this.page.getByText('Toolbar settings')).toBeVisible({ timeout: 15000 });
  }

  async navigateToAnalytics(): Promise<void> {
    await this.selectIcon('Analytics');
    await expect(this.page.getByText(/events captured/i)).toBeVisible();
  }

  async navigateToFlags(): Promise<void> {
    await this.selectIcon('Flags');
    await expect(this.page.getByText('boolean-flag').first()).toBeVisible({ timeout: 5000 });
  }

  async navigateToContexts(): Promise<void> {
    await this.selectIcon('Flags');
    await this.openSubtabDropdown();
    await this.selectSubtab('Contexts');
    await expect(this.page.getByTestId('subtab-dropdown-trigger')).toHaveText(/Contexts/);
  }

  async navigateToPrivacy(): Promise<void> {
    await this.selectIcon('Settings');
    await expect(this.page.getByText('Toolbar settings')).toBeVisible({ timeout: 15000 });
    await this.openSubtabDropdown();
    await this.selectSubtab('Privacy');
    await expect(this.page.getByTestId('subtab-dropdown-trigger')).toHaveText(/Privacy/);
  }

  async expandAndWaitForFlags(): Promise<void> {
    await this.expand();
    await this.expectExpanded();
    await expect(this.page.getByText('boolean-flag').first()).toBeVisible({ timeout: 5000 });
    await this.dismissAnalyticsPopup();
  }

  async toggleBooleanFlag(): Promise<void> {
    const booleanFlagSwitch = this.page.getByRole('switch').first();
    await booleanFlagSwitch.dispatchEvent('click');
    await expect(this.page.getByTestId('override-dot').first()).toBeVisible({ timeout: 10000 });
  }

  async openSearch(): Promise<void> {
    await this.page.getByRole('button', { name: /search/i }).click();
    await expect(this.page.getByPlaceholder('Search')).toBeVisible();
  }

  async search(term: string): Promise<void> {
    await this.openSearch();
    await this.page.getByPlaceholder('Search').fill(term);
  }
}

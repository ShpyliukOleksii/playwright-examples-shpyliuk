import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export interface SwagLabsCredentials {
  username: string;
  password: string;
}

export class LoginPage extends BasePage {
  protected readonly path = '/';

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorHeading: Locator;

  constructor(page: Page, baseURL?: string) {
    super(page, baseURL);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: /^login$/i });
    this.errorHeading = page.getByRole('heading', { name: /epic sadface/i });
  }

  async submitLoginForm(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAs(credentials: SwagLabsCredentials): Promise<void> {
    await this.submitLoginForm(credentials.username, credentials.password);
  }

  async expectLoginErrorVisible(message?: RegExp | string): Promise<void> {
    await expect(this.errorHeading).toBeVisible();
    if (message) {
      await expect(this.errorHeading).toHaveText(message);
    }
  }
}

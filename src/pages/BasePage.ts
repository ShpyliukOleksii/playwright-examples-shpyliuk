import { expect, type Page } from '@playwright/test';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseURL: string;

  protected abstract readonly path: string;

  protected constructor(
    page: Page,
    baseURL = process.env.SWAG_LABS_BASE_URL ?? 'https://www.saucedemo.com',
  ) {
    this.page = page;
    this.baseURL = baseURL;
  }

  protected buildUrl(path: string): string {
    return new URL(path, this.baseURL).toString();
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(this.buildUrl(path));
  }

  async open(): Promise<void> {
    await this.goto(this.path);
  }

  async expectOnPage(): Promise<void> {
    const pathRegex = new RegExp(`${escapeRegExp(this.path)}(?:\\?.*)?$`);
    await expect(this.page).toHaveURL(pathRegex);
  }
}

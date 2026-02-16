import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';

  readonly menuButton: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page, baseURL?: string) {
    super(page, baseURL);
    this.menuButton = page.getByRole('button', { name: /open menu/i });
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async expectLoaded(): Promise<void> {
    await this.expectOnPage();
    await expect(this.menuButton).toBeVisible();
  }

  private itemCard(itemName: string): Locator {
    return this.page.locator('.inventory_item').filter({
      has: this.page.getByRole('link', { name: itemName }),
    });
  }

  async addItemToCart(itemName: string): Promise<void> {
    const card = this.itemCard(itemName);
    await card.getByRole('button', { name: /add to cart/i }).click();
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    const card = this.itemCard(itemName);
    await card.getByRole('button', { name: /remove/i }).click();
  }

  async openItemDetails(itemName: string): Promise<void> {
    await this.page.getByRole('link', { name: itemName }).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) return 0;
    const text = (await this.cartBadge.innerText()).trim();
    const count = Number(text);
    return Number.isFinite(count) ? count : 0;
  }
}

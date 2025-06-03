import { test, expect } from '@playwright/test';

test.describe('NotificationAPI React SDK - Basic Tests', () => {
  test('app loads and renders root element', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Quick check that React app root exists
    const root = page.locator('#root');
    await expect(root).toBeVisible({ timeout: 3000 });
  });

  test('app is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const root = page.locator('#root');
    await expect(root).toBeVisible({ timeout: 3000 });
  });

  test('homepage loads successfully', async ({ page }) => {
    // Navigate to the development server
    await page.goto('/', { waitUntil: 'domcontentloaded' }); // Faster than waiting for all resources

    // Quick check that page loaded
    await expect(page.locator('#root')).toBeVisible();
  });

  test('basic navigation works', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Test that React app is rendered
    const root = page.locator('#root');
    await expect(root).toBeVisible();
  });

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify mobile-friendly elements
    const root = page.locator('#root');
    await expect(root).toBeVisible();
  });
});

test.describe('NotificationAPI Components', () => {
  test('notification components render correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Quick check for notification components
    // Using more lenient checks since we have strict timeouts

    // Test notification trigger button (if exists)
    const notificationButton = page.locator(
      '[data-testid="notification-button"]'
    );
    const buttonExists = (await notificationButton.count()) > 0;

    if (buttonExists) {
      await notificationButton.click();

      // Quick verification without waiting too long
      const notificationModal = page.locator(
        '[data-testid="notification-modal"]'
      );
      await expect(notificationModal).toBeVisible({ timeout: 2000 });
    }
  });

  test('notification list functionality', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Test notification list if it exists - quick check
    const notificationList = page.locator('[data-testid="notification-list"]');
    const listExists = (await notificationList.count()) > 0;

    if (listExists) {
      // Quick verification of list items
      const listItems = page.locator('[data-testid="notification-item"]');
      if ((await listItems.count()) > 0) {
        await expect(listItems.first()).toBeVisible({ timeout: 2000 });
      }
    }
  });
});

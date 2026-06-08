import { test, expect } from '@playwright/test';

test.describe('Theme Toggle Flow (Dark/Light Mode)', () => {
  test('should login, toggle theme, persist on reload, and toggle back', async ({ page }) => {
    // 1. Navigate to login page
    await page.goto('/login');

    // 2. Perform Quick Demo Login
    await page.click('button#demoLoginBtn');

    // 3. Wait for redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 8000 });
    expect(page.url()).toContain('/dashboard');

    // 4. Capture reference to HTML element
    const htmlElement = page.locator('html');

    // Get the initial theme (could be light or system, but we toggle to observe change)
    const initialClass = await htmlElement.getAttribute('class');
    const isInitiallyDark = initialClass?.includes('dark') ?? false;

    // 5. Click the toggle theme button
    // It's located in the TopNavBar with aria-label "toggle theme"
    const toggleButton = page.locator('button[aria-label="toggle theme"]');
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();

    // 6. Verify the theme has flipped
    if (isInitiallyDark) {
      await expect(htmlElement).not.toHaveClass(/dark/);
    } else {
      await expect(htmlElement).toHaveClass(/dark/);
    }

    // Capture the state after the first toggle
    const toggledClass = await htmlElement.getAttribute('class');
    const isDarkAfterToggle = toggledClass?.includes('dark') ?? false;

    // 7. Reload the page to test local storage persistence
    await page.reload();
    await page.waitForURL('**/dashboard');

    // 8. Assert theme state remains persisted
    const reloadedClass = await htmlElement.getAttribute('class');
    if (isDarkAfterToggle) {
      expect(reloadedClass).toContain('dark');
    } else {
      expect(reloadedClass).not.toContain('dark');
    }

    // 9. Toggle the theme once more to return to the opposite state
    await page.locator('button[aria-label="toggle theme"]').click();

    // 10. Verify it flips back
    const finalClass = await htmlElement.getAttribute('class');
    if (isDarkAfterToggle) {
      expect(finalClass).not.toContain('dark');
    } else {
      expect(finalClass).toContain('dark');
    }

    // 11. Reload page one final time to verify second state persistence
    await page.reload();
    await page.waitForURL('**/dashboard');
    const finalReloadedClass = await htmlElement.getAttribute('class');
    if (isDarkAfterToggle) {
      expect(finalReloadedClass).not.toContain('dark');
    } else {
      expect(finalReloadedClass).toContain('dark');
    }
  });
});

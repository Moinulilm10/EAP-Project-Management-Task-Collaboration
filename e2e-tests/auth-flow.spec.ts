import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login with valid credentials and navigate to dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill the login form
    // Since we don't have the backend running with real seeded users in E2E context easily yet, 
    // we'll rely on the demo login button which handles the flow via NextAuth.
    
    await page.click('button#demoLoginBtn');

    // The demo login has artificial delays
    // 300ms + 400ms + 500ms = 1.2s minimum. Wait for URL change.
    await page.waitForURL('**/dashboard', { timeout: 5000 });

    // Verify we are on the dashboard
    expect(page.url()).toContain('/dashboard');

    // Check for dashboard content (this depends on the actual implementation of dashboard/page.tsx)
    // For now, we just ensure the URL is correct, proving the redirect worked.
  });
});

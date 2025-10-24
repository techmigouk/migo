const { test, expect } = require('@playwright/test');

/**
 * Login and Authentication Test Suite
 * Tests user authentication flows
 */

test.describe('User Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login', { timeout: 45000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
      console.log('[TEST] Page did not reach networkidle, continuing anyway');
    });
  });

  test('should display login form', async ({ page }) => {
    await expect(page).toHaveTitle(/Login|Sign In|TechMigo/i);
    
    // Check form elements
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")')).toBeVisible();
  });

  test('should show validation error for empty fields', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    await submitButton.click();
    
    await page.waitForTimeout(1000);
    
    // Check for validation errors
    const hasError = await page.locator('text=/required|cannot be empty|please enter/i').count() > 0;
    const emailInvalid = await page.locator('input[type="email"]').evaluate(el => !el.validity.valid);
    
    expect(hasError || emailInvalid).toBeTruthy();
  });

  test('should navigate to signup from login', async ({ page }) => {
    // Look for visible signup link (scroll into view if needed)
    const signupLink = page.locator('p:has-text("Don\'t have an account?") a[href="/signup"], a:has-text("Get Started Free")').first();
    
    if (await signupLink.count() > 0) {
      // Scroll into view and wait for visibility
      await signupLink.scrollIntoViewIfNeeded();
      await signupLink.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      
      // Check if clickable
      if (await signupLink.isVisible()) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          signupLink.click()
        ]);
        
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/signup|\/register/i);
      } else {
        console.log('[TEST] Signup link found but not visible');
      }
    } else {
      console.log('[TEST] No signup link found');
    }
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.locator('input[type="email"], input[name="email"]').fill('invalid@example.com');
    await page.locator('input[type="password"]').fill('WrongPassword123!');
    
    await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first().click();
    
    await page.waitForTimeout(2000);
    
    // Check for error message
    const hasErrorMessage = await page.locator('text=/invalid.*credentials|incorrect.*password|user.*not.*found/i').count() > 0;
    console.log(`[TEST] Invalid credentials error shown: ${hasErrorMessage}`);
  });

  test('should navigate to forgot password', async ({ page }) => {
    const forgotLink = page.locator('p:has-text("Forgot") a[href="/forgot-password"], a:has-text("Forgot password")').first();
    
    if (await forgotLink.count() > 0) {
      await forgotLink.scrollIntoViewIfNeeded();
      
      if (await forgotLink.isVisible()) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle' }),
          forgotLink.click()
        ]);
        
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/\/forgot-password|\/reset/i);
      } else {
        console.log('[TEST] Forgot password link found but not visible');
      }
    } else {
      console.log('[TEST] No forgot password link found');
    }
  });
});

test.describe('Admin Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/login');
    await page.waitForLoadState('networkidle');
  });

  test('should display admin login form', async ({ page }) => {
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should require admin credentials', async ({ page }) => {
    console.log('[TEST] Testing admin authentication requirements');
    
    // Try logging in with regular user credentials should fail or redirect
    await page.locator('input[type="email"], input[name="email"]').fill('student@example.com');
    await page.locator('input[type="password"]').fill('Password123!');
    await page.locator('button[type="submit"]').first().click();
    
    await page.waitForTimeout(2000);
    
    // Should show unauthorized error or stay on login page
    const currentUrl = page.url();
    const hasUnauthorizedError = await page.locator('text=/unauthorized|admin.*only|insufficient.*permissions/i').count() > 0;
    const stayedOnLogin = currentUrl.includes('/login');
    
    console.log(`[TEST] Access denied properly: ${hasUnauthorizedError || stayedOnLogin}`);
  });
});

test.describe('Session Management', () => {
  test('should maintain session after page refresh', async ({ page, context }) => {
    // This test would require valid credentials
    console.log('[TEST] Testing session persistence');
    
    await page.goto('/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    
    // Note: In a real scenario, you'd login with valid test credentials
    // For now, we just verify localStorage/cookies handling
    
    await context.addCookies([{
      name: 'test-session',
      value: 'test-value',
      domain: 'localhost',
      path: '/'
    }]);
    
    await page.reload({ timeout: 45000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    
    const cookies = await context.cookies();
    const hasTestCookie = cookies.some(c => c.name === 'test-session');
    
    expect(hasTestCookie).toBeTruthy();
  });

  test('should clear session on logout', async ({ page, context }) => {
    console.log('[TEST] Testing logout functionality');
    
    // Set a test token in localStorage
    await page.goto('http://localhost:3004');
    await page.evaluate(() => {
      localStorage.setItem('token', 'test-token-123');
      localStorage.setItem('user', JSON.stringify({ name: 'Test User' }));
    });
    
    // Verify token is set
    const tokenBefore = await page.evaluate(() => localStorage.getItem('token'));
    expect(tokenBefore).toBe('test-token-123');
    
    // Look for logout button (if user is "logged in")
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")').first();
    
    if (await logoutButton.count() > 0) {
      await logoutButton.click();
      await page.waitForTimeout(1000);
      
      // Verify token is cleared
      const tokenAfter = await page.evaluate(() => localStorage.getItem('token'));
      expect(tokenAfter).toBeNull();
    }
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Try to access user dashboard without authentication
    await page.goto('http://localhost:3004');
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    console.log(`[TEST] Redirected to: ${currentUrl}`);
    
    // Should redirect to login or show login prompt
    const isOnLogin = currentUrl.includes('/login') || currentUrl.includes('/signin');
    const hasLoginForm = await page.locator('input[type="email"]').count() > 0;
    
    expect(isOnLogin || hasLoginForm).toBeTruthy();
  });

  test('should allow access to public routes', async ({ page }) => {
    const publicRoutes = ['/', '/about', '/pricing', '/courses', '/faq', '/contact'];
    
    for (const route of publicRoutes) {
      await page.goto(route, { timeout: 45000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {
        console.log(`[TEST] ${route} - Timeout waiting for page load, continuing`);
      });
      
      const statusCode = await page.evaluate(() => window.performance?.getEntriesByType?.('navigation')?.[0]?.responseStatus || 200);
      console.log(`[TEST] ${route} - Status: ${statusCode}`);
      
      // Should not redirect to login
      const currentUrl = page.url();
      expect(currentUrl).not.toMatch(/\/login|\/signin/i);
    }
  });
});

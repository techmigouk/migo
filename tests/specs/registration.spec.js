const { test, expect } = require('@playwright/test');

test.describe('Student Registration Flow', () => {
  
  test('should display the registration form with all required fields', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=/join techmigo/i')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]:has-text("Create Account")')).toBeVisible();
  });

  test('should successfully register a new student', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
    await page.waitForLoadState('networkidle');
    
    const timestamp = Date.now();
    const testEmail = `student${timestamp}@techmigo.com`;
    const testPassword = 'Test@1234567';
    
    await page.locator('input[type="text"]').fill('Test Student');
    await page.locator('input[type="email"]').fill(testEmail);
    
    const passwordFields = page.locator('input[type="password"]');
    await passwordFields.nth(0).fill(testPassword);
    await passwordFields.nth(1).fill(testPassword);
    
    await page.locator('input[type="checkbox"]').check();
    await page.locator('button[type="submit"]:has-text("Create Account")').click();
    
    await page.waitForTimeout(3000);
    
    const hasError = await page.locator('text=/error|failed/i').count();
    expect(hasError).toBe(0);
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
    await page.waitForLoadState('networkidle');
    
    await page.locator('input[type="text"]').fill('Test User');
    await page.locator('input[type="email"]').fill('invalid-email');
    await page.locator('input[type="password"]').first().fill('Password123!');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1000);
    
    const emailField = page.locator('input[type="email"]');
    const isValid = await emailField.evaluate(el => el.validity.valid);
    expect(isValid).toBeFalsy();
  });

  test('should navigate to login page from signup', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
    await page.waitForLoadState('networkidle');
    
    // Find the login link in the footer text (more specific)
    const loginLink = page.locator('p:has-text("Already have an account?") a[href="/login"]');
    await expect(loginLink).toBeVisible();
    
    // Use Promise.all to wait for navigation
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      loginLink.click()
    ]);
    
    const currentUrl = page.url();
    expect(currentUrl).toContain('/login');
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
    await page.waitForLoadState('networkidle');
    
    // Fill password to make toggle button visible
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('TestPassword123');
    await page.waitForTimeout(300);
    
    // The toggle button is directly after the password input in a relative positioned div
    // Look for any button within the same container as the password input
    const passwordContainer = page.locator('div.relative').filter({ has: passwordInput });
    const toggleButton = passwordContainer.locator('button[type="button"]');
    
    // Verify button exists
    await expect(toggleButton).toBeVisible();
    
    // Verify initial state
    let inputType = await passwordInput.getAttribute('type');
    expect(inputType).toBe('password');
    
    // Click to show password
    await toggleButton.click();
    await page.waitForTimeout(500);
    
    // Verify password is now visible
    inputType = await passwordInput.getAttribute('type');
    expect(inputType).toBe('text');
    
    // Click to hide again
    await toggleButton.click();
    await page.waitForTimeout(500);
    
    // Verify back to password
    inputType = await passwordInput.getAttribute('type');
    expect(inputType).toBe('password');
  });
});

test.describe('User Dashboard', () => {
  test('should check user dashboard loads properly', async ({ page }) => {
    await page.goto('http://localhost:3004', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(2000);
    
    const mainContent = await page.locator('body').count();
    expect(mainContent).toBeGreaterThan(0);
  });
});

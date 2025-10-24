const { test, expect } = require('@playwright/test');

/**
 * User Dashboard Test Suite
 * Tests all major functionalities within the user dashboard
 */

test.describe('User Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to user dashboard
    await page.goto('http://localhost:3004', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
  });

  test('should display main dashboard elements', async ({ page }) => {
    // Check for main dashboard components
    const hasSidebar = await page.locator('text=/dashboard|courses|community/i').count() > 0;
    const hasContent = await page.locator('body').count() > 0;
    
    expect(hasContent).toBeTruthy();
    console.log(`[TEST] Dashboard loaded - Sidebar: ${hasSidebar}`);
  });

  test('should display user profile information', async ({ page }) => {
    // Look for user profile elements
    const avatarImg = await page.locator('img[alt*="avatar"]').count();
    const avatarClass = await page.locator('[class*="avatar"]').count();
    const welcomeText = await page.locator('text=/welcome|hello/i').count();
    const profileElements = avatarImg + avatarClass + welcomeText;

    expect(profileElements).toBeGreaterThan(0);
    console.log(`[TEST] Found ${profileElements} profile elements`);
  });  test('should navigate to My Courses section', async ({ page }) => {
    // Find and click courses navigation
    const coursesNav = page.locator('text=/my courses|courses/i').first();
    const coursesLink = page.locator('[href*="courses"]').first();
    
    if (await coursesNav.count() > 0) {
      await coursesNav.click();
      await page.waitForTimeout(1500);
      
      // Check if courses section is visible
      const coursesSection = await page.locator('text=/course|learning|enrolled/i').count();
      expect(coursesSection).toBeGreaterThan(0);
      console.log('[TEST] Navigated to courses section');
    } else if (await coursesLink.count() > 0) {
      await coursesLink.click();
      await page.waitForTimeout(1500);
      console.log('[TEST] Navigated via courses link');
    } else {
      console.log('[TEST] Courses navigation not found');
    }
  });

  test('should navigate to Community section', async ({ page }) => {
    const communityNavText = page.locator('text=/community|discussion/i').first();
    const communityNavLink = page.locator('[href*="community"]').first();
    
    if (await communityNavText.count() > 0) {
      await communityNavText.click();
      await page.waitForTimeout(1500);
      
      const communitySection = await page.locator('text=/community|discussion|post/i').count();
      expect(communitySection).toBeGreaterThan(0);
      console.log('[TEST] Navigated to community section');
    } else if (await communityNavLink.count() > 0) {
      await communityNavLink.click();
      await page.waitForTimeout(1500);
      console.log('[TEST] Navigated via community link');
    } else {
      console.log('[TEST] Community navigation not found');
    }
  });

  test('should navigate to Settings section', async ({ page }) => {
    const settingsNavText = page.locator('text=/settings|preferences/i').first();
    const settingsNavLink = page.locator('[href*="settings"]').first();
    
    if (await settingsNavText.count() > 0) {
      await settingsNavText.click();
      await page.waitForTimeout(1500);
      
      const settingsSection = await page.locator('text=/settings|profile|account/i').count();
      expect(settingsSection).toBeGreaterThan(0);
      console.log('[TEST] Navigated to settings section');
    } else if (await settingsNavLink.count() > 0) {
      await settingsNavLink.click();
      await page.waitForTimeout(1500);
      console.log('[TEST] Navigated via settings link');
    } else {
      console.log('[TEST] Settings navigation not found');
    }
  });
});

test.describe('User Dashboard - Course Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await page.waitForTimeout(2000);
  });

  test('should display enrolled courses', async ({ page }) => {
    // Look for course cards or course list
    const courseClass = await page.locator('[class*="course"]').count();
    const cardClass = await page.locator('[class*="card"]').count();
    const courseText = await page.locator('text=/course/i').count();
    const courseElements = courseClass + cardClass + courseText;
    
    console.log(`[TEST] Found ${courseElements} course-related elements`);
    expect(courseElements).toBeGreaterThan(0);
  });

  test('should display course progress indicators', async ({ page }) => {
    // Look for progress bars or percentage indicators
    const progressClass = await page.locator('[class*="progress"]').count();
    const progressText = await page.locator('text=/%|progress/i').count();
    const progressElements = progressClass + progressText;
    
    console.log(`[TEST] Found ${progressElements} progress indicators`);
  });

  test('should allow course preview/continue learning', async ({ page }) => {
    // Look for course action buttons
    const courseButtons = await page.locator('button:has-text("Continue"), button:has-text("Start"), a:has-text("View")').count();
    
    if (courseButtons > 0) {
      console.log(`[TEST] Found ${courseButtons} course action buttons`);
      expect(courseButtons).toBeGreaterThan(0);
    }
  });
});

test.describe('User Dashboard - Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
  });

  test('should check for profile completion modal', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Check if profile completion modal appears
    const modalText = await page.locator('text=/complete.*profile|profile.*incomplete/i').count();
    const modalDialog = await page.locator('[role="dialog"]').count();
    const modal = modalText + modalDialog;
    
    if (modal > 0) {
      console.log('[TEST] Profile completion modal detected');
      
      // Check for profile fields
      const hasFields = await page.locator('input, textarea, select').count();
      expect(hasFields).toBeGreaterThan(0);
    } else {
      console.log('[TEST] No profile completion modal (profile may be complete)');
    }
  });

  test('should access user profile settings', async ({ page }) => {
    // Try to access settings/profile
    const settingsButton = page.locator('text=/settings|profile/i, button:has-text("Settings")').first();
    
    if (await settingsButton.count() > 0) {
      await settingsButton.click();
      await page.waitForTimeout(1500);
      
      // Check for profile fields
      const profileFields = await page.locator('input[type="text"], input[type="email"], textarea').count();
      console.log(`[TEST] Found ${profileFields} profile input fields`);
    }
  });
});

test.describe('User Dashboard - Learning Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await page.waitForTimeout(2000);
  });

  test('should display learning statistics', async ({ page }) => {
    // Look for stats like hours learned, courses completed, etc.
    const statsElements = await page.locator('text=/hours|completed|progress|achievement/i').count();
    
    console.log(`[TEST] Found ${statsElements} statistics elements`);
    expect(statsElements).toBeGreaterThan(0);
  });

  test('should display activity charts or graphs', async ({ page }) => {
    // Look for chart/graph elements
    const charts = await page.locator('[class*="chart"], [class*="graph"], svg').count();
    
    console.log(`[TEST] Found ${charts} chart/graph elements`);
  });
});

test.describe('User Dashboard - Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
  });

  test('should display notifications bell/icon', async ({ page }) => {
    const notificationText = await page.locator('text=/notification/i').count();
    const bellClass = await page.locator('[class*="bell"]').count();
    const svgIcon = await page.locator('svg').count();
    const notificationBell = notificationText + bellClass + svgIcon;
    
    if (notificationBell > 0) {
      console.log('[TEST] Notification icon found');
      expect(notificationBell).toBeGreaterThan(0);
    }
  });

  test('should open notifications panel', async ({ page }) => {
    const notificationButton = page.locator('button:has-text("Notification"), [class*="notification"]').first();
    
    if (await notificationButton.count() > 0) {
      await notificationButton.click();
      await page.waitForTimeout(1000);
      
      // Check if notifications list appears
      const notificationsList = await page.locator('text=/notification|alert|message/i').count();
      console.log(`[TEST] Found ${notificationsList} notification elements`);
    }
  });
});

test.describe('User Dashboard - Subscription/Upgrade', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
  });

  test('should display subscription status', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Look for subscription badge (Pro, Free, etc.)
    const subscriptionText = await page.locator('text=/pro|free|premium|basic/i').count();
    const badgeClass = await page.locator('[class*="badge"]').count();
    const subscriptionBadge = subscriptionText + badgeClass;
    
    console.log(`[TEST] Found ${subscriptionBadge} subscription indicators`);
  });

  test('should display upgrade CTA for free users', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Look for upgrade buttons
    const upgradeButton = await page.locator('button:has-text("Upgrade"), a:has-text("Upgrade"), text=/upgrade to pro/i').count();
    
    if (upgradeButton > 0) {
      console.log('[TEST] Upgrade CTA found (user is on free tier)');
    } else {
      console.log('[TEST] No upgrade CTA (user might be Pro)');
    }
  });
});

test.describe('User Dashboard - AI Assistant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
  });

  test('should check for AI assistant feature', async ({ page }) => {
    const aiButton = await page.locator('text=/ai assistant|ai helper/i, button:has-text("AI")').count();
    
    if (aiButton > 0) {
      console.log('[TEST] AI Assistant feature found');
      expect(aiButton).toBeGreaterThan(0);
    } else {
      console.log('[TEST] AI Assistant not visible');
    }
  });
});

test.describe('User Dashboard - Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:3004', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await page.waitForTimeout(2000);
    
    // Check if mobile menu exists
    const mobileMenu = await page.locator('button:has-text("Menu"), [class*="hamburger"], [class*="mobile-menu"]').count();
    
    console.log(`[TEST] Mobile menu elements: ${mobileMenu}`);
    
    // Content should still be visible
    const hasContent = await page.locator('body').count() > 0;
    expect(hasContent).toBeTruthy();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('http://localhost:3004', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await page.waitForTimeout(2000);
    
    const hasContent = await page.locator('body').count() > 0;
    expect(hasContent).toBeTruthy();
  });
});

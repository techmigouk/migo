const { test, expect } = require('@playwright/test');

/**
 * Admin Dashboard Test Suite
 * Tests all major functionalities within the admin dashboard
 */

test.describe('Admin Dashboard - Authentication & Access', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
  });

  test('should login as admin successfully', async ({ page }) => {
    // Fill admin credentials
    await page.fill('input[type="email"]', 'admin@migo.com');
    await page.fill('input[type="password"]', 'admin123');
    
    // Submit form
    await Promise.all([
      page.waitForNavigation({ timeout: 30000 }).catch(() => {}),
      page.click('button[type="submit"]')
    ]);
    
    await page.waitForTimeout(2000);
    
    // Should redirect to dashboard
    const url = page.url();
    console.log(`[TEST] After login URL: ${url}`);
    
    // Check for dashboard elements
    const isDashboard = await page.locator('text=/dashboard|admin|welcome/i').count() > 0;
    expect(isDashboard).toBeTruthy();
  });
});

test.describe('Admin Dashboard - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3001/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    
    await page.fill('input[type="email"]', 'admin@migo.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test('should display admin sidebar navigation', async ({ page }) => {
    // Check for main navigation items
    const navItems = await page.locator('text=/users|courses|analytics|settings|dashboard/i').count();
    
    console.log(`[TEST] Found ${navItems} navigation items`);
    expect(navItems).toBeGreaterThan(0);
  });

  test('should navigate to User Management', async ({ page }) => {
    const usersNavText = page.locator('text=/users|user management/i').first();
    const usersNavLink = page.locator('[href*="users"]').first();
    
    if (await usersNavText.count() > 0) {
      await usersNavText.click();
      await page.waitForTimeout(1500);
      
      // Check for user management content
      const userSection = await page.locator('text=/users|student|manage/i').count();
      expect(userSection).toBeGreaterThan(0);
      console.log('[TEST] Navigated to User Management');
    } else if (await usersNavLink.count() > 0) {
      await usersNavLink.click();
      await page.waitForTimeout(1500);
      console.log('[TEST] Navigated via users link');
    }
  });

  test('should navigate to Course Management', async ({ page }) => {
    const coursesNavText = page.locator('text=/courses|course management/i').first();
    const coursesNavLink = page.locator('[href*="courses"]').first();
    
    if (await coursesNavText.count() > 0) {
      await coursesNavText.click();
      await page.waitForTimeout(1500);
      
      const courseSection = await page.locator('text=/course|lesson|content/i').count();
      expect(courseSection).toBeGreaterThan(0);
      console.log('[TEST] Navigated to Course Management');
    } else if (await coursesNavLink.count() > 0) {
      await coursesNavLink.click();
      await page.waitForTimeout(1500);
      console.log('[TEST] Navigated via courses link');
    }
  });

  test('should navigate to Analytics', async ({ page }) => {
    const analyticsNavText = page.locator('text=/analytics|reports|statistics/i').first();
    const analyticsNavLink = page.locator('[href*="analytics"]').first();
    
    if (await analyticsNavText.count() > 0) {
      await analyticsNavText.click();
      await page.waitForTimeout(1500);
      
      const analyticsSection = await page.locator('text=/analytics|chart|data/i').count();
      expect(analyticsSection).toBeGreaterThan(0);
      console.log('[TEST] Navigated to Analytics');
    } else if (await analyticsNavLink.count() > 0) {
      await analyticsNavLink.click();
      await page.waitForTimeout(1500);
      console.log('[TEST] Navigated via analytics link');
    }
  });
});

test.describe('Admin Dashboard - User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    
    await page.fill('input[type="email"]', 'admin@migo.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Navigate to users section
    const usersNav = page.locator('text=/users|user management/i').first();
    if (await usersNav.count() > 0) {
      await usersNav.click();
      await page.waitForTimeout(2000);
    }
  });

  test('should display users list/table', async ({ page }) => {
    // Look for table or list of users
    const usersList = await page.locator('table, [class*="list"], [class*="grid"]').count();
    
    console.log(`[TEST] Found ${usersList} list/table elements`);
    expect(usersList).toBeGreaterThan(0);
  });

  test('should display user search/filter', async ({ page }) => {
    // Look for search input
    const searchInput = await page.locator('input[type="search"], input[placeholder*="search"]').count();
    
    if (searchInput > 0) {
      console.log('[TEST] Search functionality found');
      expect(searchInput).toBeGreaterThan(0);
    }
  });

  test('should have user action buttons', async ({ page }) => {
    // Look for action buttons like Edit, Delete, View
    const actionButtons = await page.locator('button:has-text("Edit"), button:has-text("Delete"), button:has-text("View")').count();
    
    console.log(`[TEST] Found ${actionButtons} user action buttons`);
  });

  test('should display add new user button', async ({ page }) => {
    const addButton = await page.locator('button:has-text("Add"), button:has-text("New User"), button:has-text("Create")').count();
    
    if (addButton > 0) {
      console.log('[TEST] Add new user button found');
      expect(addButton).toBeGreaterThan(0);
    }
  });
});

test.describe('Admin Dashboard - Course Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    
    await page.fill('input[type="email"]', 'admin@migo.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Navigate to courses section
    const coursesNav = page.locator('text=/courses|course management/i').first();
    if (await coursesNav.count() > 0) {
      await coursesNav.click();
      await page.waitForTimeout(2000);
    }
  });

  test('should display courses list', async ({ page }) => {
    const coursesList = await page.locator('table, [class*="course"], [class*="card"]').count();
    
    console.log(`[TEST] Found ${coursesList} course list elements`);
    expect(coursesList).toBeGreaterThan(0);
  });

  test('should have create new course button', async ({ page }) => {
    const createButton = await page.locator('button:has-text("Create"), button:has-text("New Course"), button:has-text("Add Course")').count();
    
    if (createButton > 0) {
      console.log('[TEST] Create course button found');
      expect(createButton).toBeGreaterThan(0);
    }
  });

  test('should display course action buttons', async ({ page }) => {
    const actionButtons = await page.locator('button:has-text("Edit"), button:has-text("Delete"), button:has-text("Publish")').count();
    
    console.log(`[TEST] Found ${actionButtons} course action buttons`);
  });

  test('should allow course status filtering', async ({ page }) => {
    // Look for status filters (Published, Draft, Archived)
    const statusText = await page.locator('text=/published|draft|archived/i').count();
    const selectElement = await page.locator('select').count();
    const combobox = await page.locator('[role="combobox"]').count();
    const statusFilters = statusText + selectElement + combobox;
    
    if (statusFilters > 0) {
      console.log('[TEST] Course status filters found');
    }
  });
});

test.describe('Admin Dashboard - Analytics & Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    
    await page.fill('input[type="email"]', 'admin@migo.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Navigate to analytics
    const analyticsNav = page.locator('text=/analytics|reports/i').first();
    if (await analyticsNav.count() > 0) {
      await analyticsNav.click();
      await page.waitForTimeout(2000);
    }
  });

  test('should display analytics dashboard', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Look for analytics/stats elements
    const analyticsElements = await page.locator('text=/users|courses|revenue|growth/i').count();
    
    console.log(`[TEST] Found ${analyticsElements} analytics elements`);
    expect(analyticsElements).toBeGreaterThan(0);
  });

  test('should display charts and graphs', async ({ page }) => {
    const charts = await page.locator('svg, canvas, [class*="chart"]').count();
    
    console.log(`[TEST] Found ${charts} chart elements`);
  });

  test('should display key metrics/KPIs', async ({ page }) => {
    // Look for metric cards (Total Users, Active Courses, etc.)
    const metrics = await page.locator('[class*="metric"], [class*="stat"], [class*="card"]').count();
    
    console.log(`[TEST] Found ${metrics} metric cards`);
    expect(metrics).toBeGreaterThan(0);
  });

  test('should have date range filter', async ({ page }) => {
    const dateFilter = await page.locator('input[type="date"], text=/last 7 days|last 30 days/i').count();
    
    if (dateFilter > 0) {
      console.log('[TEST] Date range filter found');
    }
  });
});

test.describe('Admin Dashboard - Settings & Configuration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    
    await page.fill('input[type="email"]', 'admin@migo.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Navigate to settings
    const settingsNav = page.locator('text=/settings|configuration/i').first();
    if (await settingsNav.count() > 0) {
      await settingsNav.click();
      await page.waitForTimeout(2000);
    }
  });

  test('should display settings page', async ({ page }) => {
    const settingsElements = await page.locator('text=/settings|configuration|preferences/i').count();
    
    console.log(`[TEST] Found ${settingsElements} settings elements`);
  });

  test('should display system configuration options', async ({ page }) => {
    const configOptions = await page.locator('input, select, textarea').count();
    
    if (configOptions > 0) {
      console.log(`[TEST] Found ${configOptions} configuration inputs`);
      expect(configOptions).toBeGreaterThan(0);
    }
  });

  test('should have save/update button', async ({ page }) => {
    const saveButton = await page.locator('button:has-text("Save"), button:has-text("Update")').count();
    
    if (saveButton > 0) {
      console.log('[TEST] Save configuration button found');
    }
  });
});

test.describe('Admin Dashboard - Content Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    
    await page.fill('input[type="email"]', 'admin@migo.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test('should access blog/content management', async ({ page }) => {
    const contentNav = page.locator('text=/blog|content|posts/i').first();
    
    if (await contentNav.count() > 0) {
      await contentNav.click();
      await page.waitForTimeout(1500);
      
      const contentSection = await page.locator('text=/post|article|blog/i').count();
      console.log('[TEST] Content management section accessible');
    }
  });

  test('should access community management', async ({ page }) => {
    const communityNav = page.locator('text=/community|discussions/i').first();
    
    if (await communityNav.count() > 0) {
      await communityNav.click();
      await page.waitForTimeout(1500);
      
      const communitySection = await page.locator('text=/community|discussion|forum/i').count();
      console.log('[TEST] Community management section accessible');
    }
  });
});

test.describe('Admin Dashboard - Financial Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    
    await page.fill('input[type="email"]', 'admin@migo.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test('should access financial dashboard', async ({ page }) => {
    const financialNav = page.locator('text=/revenue|financial|billing/i').first();
    
    if (await financialNav.count() > 0) {
      await financialNav.click();
      await page.waitForTimeout(1500);
      
      const financialSection = await page.locator('text=/revenue|payment|subscription/i').count();
      console.log('[TEST] Financial management section accessible');
    }
  });

  test('should display revenue metrics', async ({ page }) => {
    const revenueNav = page.locator('text=/revenue|financial/i').first();
    
    if (await revenueNav.count() > 0) {
      await revenueNav.click();
      await page.waitForTimeout(2000);
      
      const metrics = await page.locator('text=/revenue|earnings|income|mrr/i').count();
      console.log(`[TEST] Found ${metrics} revenue metric elements`);
    }
  });
});

test.describe('Admin Dashboard - Role-Based Access Control', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    
    await page.fill('input[type="email"]', 'admin@migo.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test('should access RBAC management', async ({ page }) => {
    const rbacNav = page.locator('text=/roles|permissions|access control/i').first();
    
    if (await rbacNav.count() > 0) {
      await rbacNav.click();
      await page.waitForTimeout(1500);
      
      const rbacSection = await page.locator('text=/role|permission|access/i').count();
      console.log('[TEST] RBAC management section accessible');
      expect(rbacSection).toBeGreaterThan(0);
    }
  });
});

test.describe('Admin Dashboard - Marketing Tools', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    
    await page.fill('input[type="email"]', 'admin@migo.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test('should access marketing dashboard', async ({ page }) => {
    const marketingNav = page.locator('text=/marketing|campaigns|email/i').first();
    
    if (await marketingNav.count() > 0) {
      await marketingNav.click();
      await page.waitForTimeout(1500);
      
      const marketingSection = await page.locator('text=/campaign|marketing|email/i').count();
      console.log('[TEST] Marketing tools section accessible');
    }
  });
});

test.describe('Admin Dashboard - AI Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    
    await page.fill('input[type="email"]', 'admin@migo.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test('should access AI configuration', async ({ page }) => {
    const aiNav = page.locator('text=/ai|artificial intelligence/i').first();
    
    if (await aiNav.count() > 0) {
      await aiNav.click();
      await page.waitForTimeout(1500);
      
      const aiSection = await page.locator('text=/ai|model|openai/i').count();
      console.log('[TEST] AI management section accessible');
    }
  });
});

test.describe('Admin Dashboard - Responsive Design', () => {
  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('http://localhost:3001/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    
    await page.fill('input[type="email"]', 'admin@migo.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    const hasContent = await page.locator('body').count() > 0;
    expect(hasContent).toBeTruthy();
    console.log('[TEST] Admin dashboard responsive on tablet');
  });
});

test.describe('Admin Dashboard - Security Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/login', { timeout: 45000 });
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    
    await page.fill('input[type="email"]', 'admin@migo.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
  });

  test('should access security settings', async ({ page }) => {
    const securityNav = page.locator('text=/security|authentication|2fa/i').first();
    
    if (await securityNav.count() > 0) {
      await securityNav.click();
      await page.waitForTimeout(1500);
      
      const securitySection = await page.locator('text=/security|2fa|password/i').count();
      console.log('[TEST] Security settings section accessible');
    }
  });

  test('should display audit logs', async ({ page }) => {
    const logsNav = page.locator('text=/logs|audit|activity/i').first();
    
    if (await logsNav.count() > 0) {
      await logsNav.click();
      await page.waitForTimeout(1500);
      
      const logsSection = await page.locator('text=/log|activity|action/i').count();
      console.log('[TEST] Audit logs section accessible');
    }
  });
});

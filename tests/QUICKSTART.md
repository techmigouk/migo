# Quick Reference Guide - AI Testing Suite

## 🚀 Installation

```powershell
# Navigate to tests directory
cd tests

# Run setup script (interactive)
node setup.js

# Or manual installation
npm install
npx playwright install
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

## ⚡ Common Commands

### Running Tests

```powershell
# Run all tests
npm test

# Run specific test file
npm test specs/registration.spec.js
npm test specs/authentication.spec.js

# Run with AI analysis
npm run test:ai

# Run in headed mode (see browser)
npm run test:headed

# Run in debug mode
npm run test:debug

# Run UI mode (interactive)
npm run test:ui
```

### Viewing Reports

```powershell
# Show HTML report
npm run report

# View AI analysis reports
ls test-results/ai-analysis/
```

## 🤖 AI Features

### Enable AI Analysis for All Tests
```powershell
# In .env file
AI_ALWAYS_ANALYZE=true

# Then run
npm run test:ai
```

### Get AI Test Suggestions
```powershell
# In .env file
AI_SUGGEST_TESTS=true

# Then run
npm run test:ai
```

## 📝 Test File Structure

```javascript
// Basic test template
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-route');
  });

  test('should do something', async ({ page }) => {
    // Your test code
    await page.click('button');
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

## 🎯 Selector Strategies

```javascript
// By text
page.locator('text=Submit')
page.locator('button:has-text("Login")')

// By role
page.locator('role=button[name="Submit"]')

// By test ID (recommended)
page.locator('[data-testid="submit-button"]')

// CSS selectors
page.locator('button.primary')
page.locator('input[type="email"]')

// XPath
page.locator('xpath=//button[contains(text(), "Submit")]')
```

## 🔍 Common Assertions

```javascript
// Visibility
await expect(page.locator('h1')).toBeVisible()
await expect(page.locator('.spinner')).toBeHidden()

// Text content
await expect(page.locator('h1')).toHaveText('Welcome')
await expect(page.locator('p')).toContainText('success')

// Attributes
await expect(page.locator('input')).toHaveAttribute('type', 'email')
await expect(page.locator('button')).toBeDisabled()

// URL
await expect(page).toHaveURL('/dashboard')
await expect(page).toHaveTitle(/TechMigo/)

// Count
await expect(page.locator('.item')).toHaveCount(5)
```

## 🛠️ Useful Snippets

### Wait for navigation
```javascript
await page.click('button');
await page.waitForURL('/success');
```

### Handle dialogs
```javascript
page.on('dialog', dialog => dialog.accept());
await page.click('button');
```

### Upload file
```javascript
await page.setInputFiles('input[type="file"]', 'path/to/file.jpg');
```

### Take screenshot
```javascript
await page.screenshot({ path: 'screenshot.png' });
```

### Get element text
```javascript
const text = await page.locator('h1').textContent();
```

### Check if element exists
```javascript
const count = await page.locator('.element').count();
if (count > 0) {
  // Element exists
}
```

## 🐛 Debugging Tips

### See what's happening
```powershell
npm run test:headed
```

### Pause execution
```javascript
await page.pause();
```

### Console logs
```javascript
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
```

### Debug specific test
```powershell
npx playwright test --debug -g "test name"
```

### Slow down execution
```javascript
test.use({ 
  launchOptions: { 
    slowMo: 1000 
  } 
});
```

## 📊 Test Results Location

```
tests/
├── test-results/           # Test artifacts
│   ├── results.json       # JSON results
│   ├── screenshots/       # Failure screenshots
│   ├── videos/           # Failure videos
│   └── ai-analysis/      # AI analysis reports
└── playwright-report/     # HTML report
```

## 🔑 Environment Variables Quick Reference

```env
# Required for AI features
OPENAI_API_KEY=sk-...

# App URLs
BASE_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
USER_URL=http://localhost:3004

# AI Configuration
AI_MODEL=gpt-4-turbo-preview
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2000
AI_ALWAYS_ANALYZE=false
AI_SUGGEST_TESTS=false

# Test Credentials
TEST_USER_EMAIL=test@techmigo.com
TEST_USER_PASSWORD=TestPassword123!
```

## 📱 Test Multiple Devices

```javascript
// In playwright.config.js, already configured:
// - Desktop Chrome, Firefox, Safari, Edge
// - Mobile Chrome (Pixel 5)
// - Mobile Safari (iPhone 12)

// Run specific device
npx playwright test --project="Mobile Chrome"
npx playwright test --project="iPhone 12"
```

## 🚨 Common Issues

### Port already in use
```powershell
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | 
  Select-Object -ExpandProperty OwningProcess | 
  ForEach-Object { Stop-Process -Id $_ -Force }
```

### Browsers not found
```powershell
npx playwright install
```

### Tests timing out
- Increase timeout in `playwright.config.js`
- Check if dev servers are running
- Use `await page.waitForLoadState('networkidle')`

### AI not working
- Check `OPENAI_API_KEY` in `.env`
- Verify API credits
- Check internet connection

## 💡 Pro Tips

1. **Use data-testid** for stable selectors
2. **Add meaningful test names** - AI analyzes them
3. **Log important steps** - Helps with debugging and AI analysis
4. **Test edge cases** - Empty states, errors, validations
5. **Keep tests independent** - Don't rely on test order
6. **Clean up test data** - Prevent test pollution
7. **Use AI suggestions** - They often find edge cases you missed

## 📚 Learn More

- [Playwright Docs](https://playwright.dev/)
- [OpenAI API](https://platform.openai.com/)
- [Full README](./README.md)

---

**Need help? Check the AI analysis reports for insights!** 🤖

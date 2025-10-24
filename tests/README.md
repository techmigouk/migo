# TechMigo AI-Powered Testing Suite

Automated testing infrastructure using Playwright and OpenAI GPT for intelligent test analysis and suggestions.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd tests
npm install
```

### 2. Install Playwright Browsers

```bash
npm run install-browsers
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and add your OpenAI API key:

```bash
cp .env.example .env
```

Edit `.env` and add your keys:
```env
OPENAI_API_KEY=sk-your-key-here
BASE_URL=http://localhost:3000
```

### 4. Run Tests

**Standard Playwright tests:**
```bash
npm test
```

**AI-powered test analysis:**
```bash
npm run test:ai
```

**Specific test file:**
```bash
npm run test:registration
```

**Debug mode:**
```bash
npm run test:debug
```

**UI mode (interactive):**
```bash
npm run test:ui
```

## 📁 Structure

```
tests/
├── package.json              # Dependencies and scripts
├── playwright.config.js      # Playwright configuration
├── aiHelper.js              # OpenAI integration helper
├── aiTester.js              # AI-powered test runner
├── .env.example             # Environment variables template
├── specs/                   # Test specifications
│   └── registration.spec.js # Student registration tests
└── test-results/            # Test results and reports
    └── ai-analysis/         # AI-generated analysis reports
```

## 🧪 Test Files

### registration.spec.js

Comprehensive tests for student registration flow:
- ✅ Form validation
- ✅ Successful registration
- ✅ Email validation
- ✅ Password strength checks
- ✅ Duplicate email prevention
- ✅ Navigation between signup/login
- ✅ Password visibility toggle
- ✅ Profile completion modal

## 🤖 AI Features

### Automatic Analysis

When tests fail, the AI analyzes:
1. **Root cause** of failures
2. **Bug identification** (test vs. application bugs)
3. **Recommended fixes** with code examples
4. **Additional test cases** to consider
5. **Severity rating** (Critical/High/Medium/Low)

### AI Commands

**Analyze all test results:**
```bash
AI_ALWAYS_ANALYZE=true npm run test:ai
```

**Generate additional test suggestions:**
```bash
AI_SUGGEST_TESTS=true npm run test:ai
```

## 📊 Reports

### HTML Report
```bash
npm run report
```

### AI Analysis Reports

Saved in `test-results/ai-analysis/` with timestamps:
- Markdown format
- Full AI analysis
- Test statistics
- Recommendations

## ⚙️ Configuration

### playwright.config.js

Configure:
- **Base URLs** for different apps (front, admin, user)
- **Browsers** to test (Chrome, Firefox, Safari, Edge)
- **Mobile devices** (Pixel 5, iPhone 12)
- **Timeouts** and **retries**
- **Screenshots** and **videos** on failure
- **Parallel execution**

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key (required for AI features) | - |
| `BASE_URL` | Main app URL | `http://localhost:3000` |
| `ADMIN_URL` | Admin dashboard URL | `http://localhost:3001` |
| `USER_URL` | User dashboard URL | `http://localhost:3004` |
| `AI_MODEL` | OpenAI model to use | `gpt-4-turbo-preview` |
| `AI_TEMPERATURE` | Response creativity (0-1) | `0.7` |
| `AI_MAX_TOKENS` | Max response length | `2000` |
| `AI_ALWAYS_ANALYZE` | Analyze even passing tests | `false` |
| `AI_SUGGEST_TESTS` | Generate test suggestions | `false` |

## 🎯 Writing Tests

### Basic Test Structure

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');
    await page.click('button');
    await expect(page.locator('h1')).toHaveText('Expected Text');
  });
});
```

### Best Practices

1. **Use descriptive test names** - AI can understand them better
2. **Add console.log** for important steps - AI analyzes logs
3. **Test edge cases** - validation, errors, empty states
4. **Clean up test data** - avoid test pollution
5. **Use data-testid** - more reliable than text selectors

## 🔍 Common Commands

```bash
# Run specific browser
npm test -- --project=chromium

# Run headed (visible browser)
npm run test:headed

# Run with debug tools
npm run test:debug

# Run specific test by name
npm test -- -g "should successfully register"

# Update snapshots
npm test -- --update-snapshots

# Show test report
npm run report
```

## 🐛 Troubleshooting

### Browsers not installed
```bash
npm run install-browsers
```

### OpenAI API errors
- Check your API key in `.env`
- Verify you have credits in your OpenAI account
- Check rate limits

### Tests hanging
- Increase timeouts in `playwright.config.js`
- Check if dev servers are running
- Use `--headed` to see what's happening

### Port conflicts
```bash
# Kill processes on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [TechMigo Platform Documentation](../README.md)

## 🤝 Contributing

When adding new tests:
1. Place them in `specs/` directory
2. Follow naming convention: `feature-name.spec.js`
3. Add descriptive test names
4. Include test documentation
5. Run AI analysis to get suggestions

## 📝 Example AI Output

```
🤖 AI ANALYSIS RESULTS
================================================================================

Root Cause Analysis:
The test failure appears to be caused by...

Bug Assessment:
This is likely an APPLICATION BUG because...

Recommended Fixes:
1. Update the email validation on the backend...
2. Add client-side validation for...

Additional Test Cases:
1. Test password reset flow
2. Test social login integration
3. Test registration with promo codes

Priority Level: HIGH
================================================================================
```

## 🎓 Learning Resources

- Review AI analysis reports for testing insights
- Use `AI_SUGGEST_TESTS=true` to learn new test patterns
- Check generated test cases for best practices

---

**Happy Testing! 🎭🤖**

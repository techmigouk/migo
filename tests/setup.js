#!/usr/bin/env node

/**
 * Quick setup script for AI-powered testing suite
 * Run with: node setup.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🎭 TechMigo AI-Powered Testing Suite Setup\n');
  console.log('This script will help you set up the testing environment.\n');

  try {
    // Step 1: Install dependencies
    console.log('📦 Step 1: Installing dependencies...\n');
    execSync('npm install', { stdio: 'inherit', cwd: __dirname });
    console.log('\n✅ Dependencies installed!\n');

    // Step 2: Install Playwright browsers
    const installBrowsers = await question('Install Playwright browsers? (y/n): ');
    if (installBrowsers.toLowerCase() === 'y') {
      console.log('\n🌐 Installing browsers (this may take a few minutes)...\n');
      execSync('npx playwright install', { stdio: 'inherit', cwd: __dirname });
      console.log('\n✅ Browsers installed!\n');
    }

    // Step 3: Configure environment variables
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
      console.log('\n⚙️  Step 3: Configure environment variables\n');
      
      const apiKey = await question('Enter your OpenAI API key (or press Enter to skip): ');
      const baseUrl = await question('Base URL [http://localhost:3000]: ') || 'http://localhost:3000';
      const adminUrl = await question('Admin URL [http://localhost:3001]: ') || 'http://localhost:3001';
      const userUrl = await question('User URL [http://localhost:3004]: ') || 'http://localhost:3004';

      const envContent = `# OpenAI Configuration
OPENAI_API_KEY=${apiKey}

# Test Configuration
BASE_URL=${baseUrl}
ADMIN_URL=${adminUrl}
USER_URL=${userUrl}

# Test Credentials (for testing purposes only)
TEST_USER_EMAIL=test@techmigo.com
TEST_USER_PASSWORD=TestPassword123!
TEST_ADMIN_EMAIL=admin@techmigo.com
TEST_ADMIN_PASSWORD=AdminPassword123!

# AI Testing Configuration
AI_MODEL=gpt-4-turbo-preview
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2000
AI_ALWAYS_ANALYZE=false
AI_SUGGEST_TESTS=false
`;

      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ Environment variables configured!\n');
    } else {
      console.log('\n✅ .env file already exists\n');
    }

    // Step 4: Summary
    console.log('═'.repeat(60));
    console.log('✨ Setup Complete! ✨');
    console.log('═'.repeat(60));
    console.log('\n📚 Next steps:\n');
    console.log('  1. Make sure your dev servers are running:');
    console.log('     cd .. && pnpm dev\n');
    console.log('  2. Run your first test:');
    console.log('     npm test\n');
    console.log('  3. Run AI-powered analysis:');
    console.log('     npm run test:ai\n');
    console.log('  4. Read the documentation:');
    console.log('     README.md\n');
    console.log('═'.repeat(60));
    console.log('\n🎉 Happy Testing!\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run setup
setup();

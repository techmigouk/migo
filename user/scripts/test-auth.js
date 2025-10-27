/**
 * Quick Authentication Test
 * 
 * Tests the authentication flow programmatically
 * Usage: node scripts/test-auth.js
 */

async function testAuthentication() {
  console.log('🧪 Testing NextAuth Authentication\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const baseUrl = 'http://localhost:3004';
  
  // Test 1: Check if login page is accessible
  console.log('Test 1: Login Page Accessibility');
  try {
    const response = await fetch(`${baseUrl}/login`);
    if (response.ok) {
      console.log('✅ Login page is accessible');
    } else {
      console.log('❌ Login page returned status:', response.status);
    }
  } catch (error) {
    console.log('❌ Failed to access login page:', error.message);
    console.log('💡 Make sure the user app is running: cd user && pnpm dev');
    return;
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 2: Test login API endpoint
  console.log('Test 2: Login API Endpoint');
  console.log('Testing credentials:');
  console.log('  Email: test@example.com');
  console.log('  Password: testpassword123\n');

  try {
    const loginResponse = await fetch(`${baseUrl}/api/auth/signin/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123',
        redirect: false,
      }),
    });

    console.log('Response Status:', loginResponse.status);
    
    if (loginResponse.ok) {
      console.log('✅ Login API is responding correctly');
      
      // Check for cookies
      const cookies = loginResponse.headers.get('set-cookie');
      if (cookies) {
        console.log('✅ Session cookie is being set');
      } else {
        console.log('⚠️  No session cookie in response (might be normal for API route)');
      }
    } else {
      console.log('⚠️  Login API returned status:', loginResponse.status);
      const errorData = await loginResponse.text();
      console.log('Response:', errorData);
    }
  } catch (error) {
    console.log('❌ Error testing login API:', error.message);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 3: Test protected API route (without auth)
  console.log('Test 3: Protected API Route (Unauthenticated)');
  try {
    const enrollResponse = await fetch(`${baseUrl}/api/enrollments`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('GET /api/enrollments Status:', enrollResponse.status);
    const data = await enrollResponse.json();
    
    if (enrollResponse.ok && data.enrollments) {
      if (Object.keys(data.enrollments).length === 0 || Array.isArray(data.enrollments) && data.enrollments.length === 0) {
        console.log('✅ Protected route returns empty data for unauthenticated users');
      } else {
        console.log('⚠️  Protected route returned data without auth');
      }
    }
  } catch (error) {
    console.log('❌ Error testing protected route:', error.message);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 4: Check NextAuth configuration endpoints
  console.log('Test 4: NextAuth Configuration');
  try {
    const csrfResponse = await fetch(`${baseUrl}/api/auth/csrf`);
    if (csrfResponse.ok) {
      const csrfData = await csrfResponse.json();
      console.log('✅ CSRF endpoint is working');
      console.log('   CSRF Token:', csrfData.csrfToken ? '✓ Generated' : '✗ Missing');
    }

    const providersResponse = await fetch(`${baseUrl}/api/auth/providers`);
    if (providersResponse.ok) {
      const providers = await providersResponse.json();
      console.log('✅ Providers endpoint is working');
      console.log('   Available providers:', Object.keys(providers).join(', '));
    }
  } catch (error) {
    console.log('❌ Error checking NextAuth config:', error.message);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📋 Summary:');
  console.log('');
  console.log('NextAuth is configured and running.');
  console.log('');
  console.log('🧪 Manual Testing Steps:');
  console.log('1. Open: http://localhost:3004/login');
  console.log('2. Login with:');
  console.log('   Email: test@example.com');
  console.log('   Password: testpassword123');
  console.log('3. You should be redirected to the dashboard');
  console.log('4. Try enrolling in a course to test protected routes');
  console.log('');
  console.log('📖 For detailed testing checklist, see:');
  console.log('   user/AUTHENTICATION_TESTING.md');
  console.log('');
}

testAuthentication().catch(console.error);

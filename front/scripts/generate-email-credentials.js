/**
 * Script to generate Ethereal Email test credentials
 * Run this to get test SMTP credentials for development
 * 
 * Usage: node scripts/generate-email-credentials.js
 */

const nodemailer = require('nodemailer');

async function generateTestCredentials() {
  try {
    console.log('Generating test email credentials...\n');

    // Generate test SMTP service account from ethereal.email
    const testAccount = await nodemailer.createTestAccount();

    console.log('✅ Test Email Credentials Generated!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('Add these to your .env file:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`EMAIL_HOST=smtp.ethereal.email`);
    console.log(`EMAIL_PORT=587`);
    console.log(`EMAIL_SECURE=false`);
    console.log(`EMAIL_USER=${testAccount.user}`);
    console.log(`EMAIL_PASSWORD=${testAccount.pass}`);
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📧 These credentials are for DEVELOPMENT/TESTING only!');
    console.log('📬 Preview sent emails at: https://ethereal.email\n');
    console.log('For production, use a real email service like:');
    console.log('  - SendGrid (https://sendgrid.com)');
    console.log('  - AWS SES (https://aws.amazon.com/ses)');
    console.log('  - Mailgun (https://www.mailgun.com)');
    console.log('  - Postmark (https://postmarkapp.com)');

  } catch (error) {
    console.error('Error generating credentials:', error);
  }
}

generateTestCredentials();
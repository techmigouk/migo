# Email System Documentation

## Overview

The email system provides automated notifications for various user actions including registration, course enrollment, payments, password resets, and subscription management.

## Features

- ✅ Welcome emails for new users
- ✅ Password reset emails
- ✅ Course enrollment confirmations
- ✅ Payment receipts
- ✅ Live event reminders
- ✅ Subscription confirmations
- ✅ Subscription cancellation notifications
- ✅ Beautiful HTML templates
- ✅ Plain text fallbacks
- ✅ Development and production modes

## Setup

### Development Setup (Ethereal Email)

For development and testing, we use Ethereal Email - a fake SMTP service that captures emails without sending them.

1. **Generate test credentials:**
   ```bash
   cd front
   pnpm generate-email
   ```

2. **Copy the generated credentials** to your `.env` file:
   ```env
   EMAIL_HOST=smtp.ethereal.email
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-ethereal-username
   EMAIL_PASSWORD=your-ethereal-password
   EMAIL_FROM=Amigo Learning <noreply@amigo.com>
   ```

3. **Preview emails:** When an email is sent in development, check the console for a preview URL like:
   ```
   Preview URL: https://ethereal.email/message/xxxxx
   ```

### Production Setup

For production, use a real email service provider:

#### Option 1: SendGrid

1. Sign up at [SendGrid](https://sendgrid.com)
2. Create an API key
3. Configure environment variables:
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_SECURE=true
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your-sendgrid-api-key
   EMAIL_FROM=noreply@yourdomain.com
   ```

#### Option 2: AWS SES

1. Set up AWS SES in your AWS account
2. Verify your domain
3. Get SMTP credentials
4. Configure environment variables:
   ```env
   EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
   EMAIL_PORT=587
   EMAIL_SECURE=true
   EMAIL_USER=your-ses-username
   EMAIL_PASSWORD=your-ses-password
   EMAIL_FROM=noreply@yourdomain.com
   ```

#### Option 3: Gmail (Not recommended for production)

1. Enable 2-factor authentication
2. Create an app password
3. Configure environment variables:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=true
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=Your Name <your-gmail@gmail.com>
   ```

## Email Templates

### 1. Welcome Email

**Trigger:** User registration  
**Template:** `sendWelcomeEmail(to, name)`  
**Example:**

```typescript
import { emailService } from '@amigo/shared';

await emailService.sendWelcomeEmail(
  'user@example.com',
  'John Doe'
);
```

### 2. Password Reset

**Trigger:** Forgot password request  
**Template:** `sendPasswordResetEmail(to, name, resetToken)`  
**Example:**

```typescript
const resetToken = authUtils.generateResetToken();
await emailService.sendPasswordResetEmail(
  'user@example.com',
  'John Doe',
  resetToken
);
```

### 3. Enrollment Confirmation

**Trigger:** Course purchase/enrollment  
**Template:** `sendEnrollmentConfirmation(to, name, courseName, courseId)`  
**Example:**

```typescript
await emailService.sendEnrollmentConfirmation(
  'user@example.com',
  'John Doe',
  'JavaScript Fundamentals',
  '507f1f77bcf86cd799439011'
);
```

### 4. Payment Receipt

**Trigger:** Successful payment  
**Template:** `sendPaymentReceipt(to, name, amount, currency, itemName, paymentId)`  
**Example:**

```typescript
await emailService.sendPaymentReceipt(
  'user@example.com',
  'John Doe',
  49.99,
  'usd',
  'JavaScript Fundamentals',
  'pi_1234567890'
);
```

### 5. Live Event Reminder

**Trigger:** 24 hours before event (scheduled job)  
**Template:** `sendLiveEventReminder(to, name, eventTitle, eventDate, meetingLink)`  
**Example:**

```typescript
await emailService.sendLiveEventReminder(
  'user@example.com',
  'John Doe',
  'JavaScript Q&A Session',
  new Date('2025-10-25T15:00:00Z'),
  'https://zoom.us/j/123456789'
);
```

### 6. Subscription Confirmation

**Trigger:** New subscription activation  
**Template:** `sendSubscriptionConfirmation(to, name, plan, amount, currency)`  
**Example:**

```typescript
await emailService.sendSubscriptionConfirmation(
  'user@example.com',
  'John Doe',
  'Premium',
  50.00,
  'usd'
);
```

### 7. Subscription Cancellation

**Trigger:** Subscription cancelled  
**Template:** `sendSubscriptionCancellation(to, name, plan, endDate)`  
**Example:**

```typescript
await emailService.sendSubscriptionCancellation(
  'user@example.com',
  'John Doe',
  'Premium',
  new Date('2025-11-01')
);
```

## API Integration

Emails are automatically sent from these endpoints:

| Endpoint | Email Type |
|----------|-----------|
| `POST /api/auth/register` | Welcome Email |
| `POST /api/auth/forgot-password` | Password Reset |
| Stripe Webhook (course purchase) | Enrollment Confirmation + Payment Receipt |
| Stripe Webhook (subscription created) | Subscription Confirmation |
| Stripe Webhook (subscription deleted) | Subscription Cancellation |

## Testing Emails

### Test During Development

1. **Register a new user:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

2. **Check console output** for preview URL
3. **Open the preview URL** in your browser to see the email

### Test Live Event Reminders

Create a script to test event reminders:

```typescript
import { emailService } from '@amigo/shared';

await emailService.sendLiveEventReminder(
  'test@example.com',
  'Test User',
  'React Workshop',
  new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  'https://zoom.us/j/123456789'
);
```

## Error Handling

Emails are sent asynchronously and errors are logged but don't block the response:

```typescript
emailService.sendWelcomeEmail(user.email, user.name).catch((error: Error) => {
  console.error('Failed to send welcome email:', error);
});
```

This ensures that:
- User operations complete successfully even if email fails
- Email failures are logged for monitoring
- System remains responsive

## Best Practices

### 1. Non-Blocking Email Sending

✅ **Good:**
```typescript
// Send email without blocking response
emailService.sendWelcomeEmail(email, name).catch(console.error);
return NextResponse.json({ success: true });
```

❌ **Bad:**
```typescript
// Blocks response until email is sent
await emailService.sendWelcomeEmail(email, name);
return NextResponse.json({ success: true });
```

### 2. Email Queue (Future Enhancement)

For high-volume production systems, consider using a queue:

```typescript
// Add to queue instead of sending directly
await emailQueue.add('welcome-email', {
  to: user.email,
  name: user.name
});
```

Popular queue systems:
- **Bull** (Redis-based)
- **AWS SQS**
- **RabbitMQ**

### 3. Email Templates Management

Consider using a template engine for more complex emails:

```typescript
import { compile } from 'handlebars';

const template = compile(emailTemplateHTML);
const html = template({ name, courseName, date });
```

### 4. Unsubscribe Links

Add unsubscribe functionality for marketing emails:

```html
<p style="font-size: 12px; color: #999;">
  Don't want to receive these emails? 
  <a href="${unsubscribeUrl}">Unsubscribe</a>
</p>
```

### 5. Email Analytics

Track email opens and clicks:

```html
<!-- Open tracking pixel -->
<img src="${trackingUrl}/open/${emailId}" width="1" height="1" />

<!-- Click tracking -->
<a href="${trackingUrl}/click/${emailId}?url=${encodeURL}">
  Click here
</a>
```

## Monitoring

### Check Email Delivery

1. **Development:** Check console for preview URLs
2. **Production:** Monitor your email service dashboard:
   - SendGrid Dashboard
   - AWS SES Console
   - Email service logs

### Common Issues

**Issue: Emails not sending**
- Check SMTP credentials in `.env`
- Verify email service is running
- Check firewall/network settings

**Issue: Emails going to spam**
- Configure SPF, DKIM, and DMARC records
- Use a verified domain
- Avoid spam trigger words
- Include unsubscribe links

**Issue: Slow email sending**
- Use asynchronous sending (don't await)
- Implement email queuing
- Use batch sending for multiple recipients

## Future Enhancements

- [ ] Email templates with React Email
- [ ] Email queue with Bull/Redis
- [ ] Email analytics and tracking
- [ ] Unsubscribe management
- [ ] Email preferences per user
- [ ] Multi-language support
- [ ] A/B testing for email content
- [ ] Scheduled email campaigns

## Support

For email-related issues:

1. Check the [Nodemailer documentation](https://nodemailer.com)
2. Review email service provider docs
3. Check application logs for errors
4. Test SMTP connection with telnet

---

**Last Updated:** October 23, 2025  
**Email System Version:** 1.0.0
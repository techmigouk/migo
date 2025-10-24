import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: Transporter;
  private from: string;

  constructor() {
    // Create transporter based on environment
    if (process.env.NODE_ENV === 'production') {
      // Production: Use your email service (SendGrid, AWS SES, etc.)
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      // Development: Use Ethereal Email (fake SMTP)
      // You can also use Gmail, Mailtrap, etc.
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    this.from = process.env.EMAIL_FROM || 'Amigo Learning <noreply@amigo.com>';
  }

  /**
   * Send a generic email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log('Email sent:', info.messageId);
      
      // Preview URL for development (Ethereal)
      if (process.env.NODE_ENV !== 'production') {
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const subject = 'Welcome to Amigo Learning! 🎉';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Amigo Learning</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Amigo Learning!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name}! 👋</h2>
            
            <p>We're thrilled to have you join our learning community! Get ready to embark on an exciting educational journey.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin-top: 0; color: #667eea;">What's Next?</h3>
              <ul style="padding-left: 20px;">
                <li>Explore our course catalog</li>
                <li>Complete your profile</li>
                <li>Join live events and workshops</li>
                <li>Connect with instructors and fellow learners</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Browse Courses</a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Need help? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #667eea;">Help Center</a>.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Amigo Learning. All rights reserved.</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #999; text-decoration: none;">Privacy Policy</a> | 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #999; text-decoration: none;">Terms of Service</a>
            </p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Welcome to Amigo Learning!
      
      Hi ${name}!
      
      We're thrilled to have you join our learning community! Get ready to embark on an exciting educational journey.
      
      What's Next?
      - Explore our course catalog
      - Complete your profile
      - Join live events and workshops
      - Connect with instructors and fellow learners
      
      Browse courses: ${process.env.NEXT_PUBLIC_APP_URL}/courses
      
      Need help? Reply to this email or visit our Help Center.
    `;

    await this.sendEmail({ to, subject, html, text });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    const subject = 'Reset Your Password - Amigo Learning';
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f9f9f9; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request 🔐</h2>
            
            <p>Hi ${name},</p>
            
            <p>We received a request to reset your password for your Amigo Learning account. Click the button below to create a new password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #667eea;">${resetUrl}</p>
            
            <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Amigo Learning. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Password Reset Request
      
      Hi ${name},
      
      We received a request to reset your password for your Amigo Learning account.
      
      Click this link to reset your password: ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, please ignore this email or contact support.
    `;

    await this.sendEmail({ to, subject, html, text });
  }

  /**
   * Send course enrollment confirmation
   */
  async sendEnrollmentConfirmation(
    to: string,
    name: string,
    courseName: string,
    courseId: string
  ): Promise<void> {
    const courseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}`;
    const subject = `You're Enrolled! ${courseName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎓 Enrollment Confirmed!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Congratulations, ${name}!</h2>
            
            <p>You've successfully enrolled in:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #667eea;">
              <h3 style="color: #667eea; margin: 0 0 10px 0;">${courseName}</h3>
            </div>
            
            <p>Your learning journey starts now! Access your course materials and begin learning at your own pace.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${courseUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Learning</a>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #667eea;">Quick Tips:</h4>
              <ul style="padding-left: 20px;">
                <li>Set aside dedicated time for learning</li>
                <li>Complete lessons in order for best results</li>
                <li>Take notes and practice regularly</li>
                <li>Join discussions and ask questions</li>
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Amigo Learning. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Enrollment Confirmed!
      
      Congratulations, ${name}!
      
      You've successfully enrolled in: ${courseName}
      
      Your learning journey starts now! Access your course materials: ${courseUrl}
      
      Quick Tips:
      - Set aside dedicated time for learning
      - Complete lessons in order for best results
      - Take notes and practice regularly
      - Join discussions and ask questions
    `;

    await this.sendEmail({ to, subject, html, text });
  }

  /**
   * Send payment receipt
   */
  async sendPaymentReceipt(
    to: string,
    name: string,
    amount: number,
    currency: string,
    itemName: string,
    paymentId: string
  ): Promise<void> {
    const subject = 'Payment Receipt - Amigo Learning';
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f9f9f9; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-top: 0;">Payment Receipt 💳</h2>
            
            <p>Hi ${name},</p>
            
            <p>Thank you for your payment! Here's your receipt:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Item:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">${itemName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Amount:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">${formattedAmount}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Payment ID:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-family: monospace; font-size: 12px;">${paymentId}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;"><strong>Date:</strong></td>
                  <td style="padding: 10px 0; text-align: right;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #666; font-size: 14px;">Keep this receipt for your records. You can view all your transactions in your account dashboard.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Dashboard</a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Amigo Learning. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Payment Receipt
      
      Hi ${name},
      
      Thank you for your payment! Here's your receipt:
      
      Item: ${itemName}
      Amount: ${formattedAmount}
      Payment ID: ${paymentId}
      Date: ${new Date().toLocaleDateString()}
      
      Keep this receipt for your records.
      View your dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
    `;

    await this.sendEmail({ to, subject, html, text });
  }

  /**
   * Send live event reminder
   */
  async sendLiveEventReminder(
    to: string,
    name: string,
    eventTitle: string,
    eventDate: Date,
    meetingLink: string
  ): Promise<void> {
    const subject = `Reminder: ${eventTitle} - Starting Soon! ⏰`;
    const formattedDate = new Date(eventDate).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    });
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📅 Live Event Reminder</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Don't Miss It, ${name}!</h2>
            
            <p>Your live event is starting soon:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c;">
              <h3 style="color: #f5576c; margin: 0 0 10px 0;">${eventTitle}</h3>
              <p style="margin: 5px 0; color: #666;">🕐 ${formattedDate}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${meetingLink}" style="display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Join Event</a>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #1976d2; font-size: 14px;">
                <strong>💡 Pro Tip:</strong> Join a few minutes early to test your audio and video setup!
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Amigo Learning. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Live Event Reminder
      
      Don't Miss It, ${name}!
      
      Your live event is starting soon:
      ${eventTitle}
      
      Date: ${formattedDate}
      
      Join the event: ${meetingLink}
      
      Pro Tip: Join a few minutes early to test your audio and video setup!
    `;

    await this.sendEmail({ to, subject, html, text });
  }

  /**
   * Send subscription confirmation
   */
  async sendSubscriptionConfirmation(
    to: string,
    name: string,
    plan: string,
    amount: number,
    currency: string
  ): Promise<void> {
    const subject = `Subscription Activated - ${plan} Plan 🎉`;
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Subscription Activated!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Welcome to ${plan}, ${name}!</h2>
            
            <p>Your subscription has been successfully activated. You now have access to all ${plan} features!</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #667eea;">
              <h3 style="color: #667eea; margin: 0 0 15px 0;">Subscription Details</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Plan:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${plan}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Billing:</strong></td>
                  <td style="padding: 8px 0; text-align: right;">${formattedAmount}/month</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              You can manage your subscription anytime from your account settings.
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Amigo Learning. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Subscription Activated!
      
      Welcome to ${plan}, ${name}!
      
      Your subscription has been successfully activated.
      
      Plan: ${plan}
      Billing: ${formattedAmount}/month
      
      Go to dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
      
      You can manage your subscription anytime from your account settings.
    `;

    await this.sendEmail({ to, subject, html, text });
  }

  /**
   * Send subscription cancellation confirmation
   */
  async sendSubscriptionCancellation(
    to: string,
    name: string,
    plan: string,
    endDate: Date
  ): Promise<void> {
    const subject = 'Subscription Cancellation Confirmed';
    const formattedDate = new Date(endDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f9f9f9; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-top: 0;">Subscription Cancellation Confirmed</h2>
            
            <p>Hi ${name},</p>
            
            <p>Your ${plan} subscription has been scheduled for cancellation. You'll continue to have access until:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #666;">
              <p style="margin: 0; font-size: 18px; color: #666;"><strong>${formattedDate}</strong></p>
            </div>
            
            <p>After this date, your account will revert to the free plan. You can reactivate your subscription anytime.</p>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>Changed your mind?</strong> You can reactivate your subscription from your account settings.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Manage Subscription</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              We're sorry to see you go. If you have any feedback, we'd love to hear it!
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Amigo Learning. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Subscription Cancellation Confirmed
      
      Hi ${name},
      
      Your ${plan} subscription has been scheduled for cancellation.
      
      You'll continue to have access until: ${formattedDate}
      
      After this date, your account will revert to the free plan.
      
      You can reactivate your subscription anytime from: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
    `;

    await this.sendEmail({ to, subject, html, text });
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export types
export type { EmailOptions };
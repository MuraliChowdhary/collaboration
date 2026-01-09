// apps/auth-service/src/services/email.service.ts

import nodemailer from 'nodemailer';
import { logger } from '@repo/shared';

/**
 * Email Service Configuration
 */
const emailConfig = {
  service: process.env.EMAIL_SERVICE || 'gmail',
  user: process.env.EMAIL_USER || '',
  password: process.env.EMAIL_APP_PASSWORD || '',
  from: process.env.EMAIL_FROM || process.env.EMAIL_USER || '',
};

/**
 * Email Service
 * Handles all email operations (verification, password reset, etc.)
 */
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isEmailEnabled: boolean;

  constructor() {
    // Check if email is enabled
    this.isEmailEnabled = !!(emailConfig.user && emailConfig.password);

    if (this.isEmailEnabled) {
      // Create transporter only if credentials are provided
      this.transporter = nodemailer.createTransport({
        service: emailConfig.service,
        auth: {
          user: emailConfig.user,
          pass: emailConfig.password,
        },
      });

      logger.info('✅ Email service configured');
    } else {
      logger.warn('⚠️  Email service disabled (no credentials provided)');
    }
  }

  /**
   * Send email (generic method)
   * @param to - Recipient email
   * @param subject - Email subject
   * @param text - Plain text content
   * @param html - HTML content
   */
  private async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string
  ): Promise<void> {
    // If email is disabled, just log
    if (!this.isEmailEnabled || !this.transporter) {
      logger.info(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`);
      logger.debug(`[EMAIL MOCK] Content: ${text}`);
      return;
    }

    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: emailConfig.from,
        to,
        subject,
        text,
        html: html || text,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}`);
    } catch (error) {
      logger.error('Failed to send email', { error, to, subject });
      throw error;
    }
  }

  /**
   * Send verification email
   * @param email - User email
   * @param token - Verification token
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const subject = 'Verify Your Email - CollabHub';
    const text = `
Welcome to CollabHub!

Please verify your email address by clicking the link below:
${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.

Best regards,
CollabHub Team
    `;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background-color: #4F46E5; 
      color: white; 
      text-decoration: none; 
      border-radius: 6px; 
      margin: 20px 0;
    }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome to CollabHub! 🎉</h2>
    <p>Thank you for signing up. Please verify your email address to get started.</p>
    <a href="${verificationUrl}" class="button">Verify Email</a>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
    <p>This link will expire in 24 hours.</p>
    <div class="footer">
      <p>If you didn't create an account, please ignore this email.</p>
      <p>&copy; ${new Date().getFullYear()} CollabHub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail(email, subject, text, html);
  }

  /**
   * Send password reset email
   * @param email - User email
   * @param token - Reset token
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const subject = 'Reset Your Password - CollabHub';
    const text = `
Password Reset Request

We received a request to reset your password for your CollabHub account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email or contact support if you have concerns.

Best regards,
CollabHub Team
    `;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background-color: #DC2626; 
      color: white; 
      text-decoration: none; 
      border-radius: 6px; 
      margin: 20px 0;
    }
    .warning { background-color: #FEF3C7; padding: 15px; border-radius: 6px; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request 🔒</h2>
    <p>We received a request to reset your password for your CollabHub account.</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #666;">${resetUrl}</p>
    <div class="warning">
      <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour.
    </div>
    <div class="footer">
      <p>If you didn't request a password reset, please ignore this email or contact support.</p>
      <p>&copy; ${new Date().getFullYear()} CollabHub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail(email, subject, text, html);
  }

  /**
   * Send welcome email after verification
   * @param email - User email
   * @param firstName - User's first name
   */
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const subject = 'Welcome to CollabHub! 🎉';
    const text = `
Hi ${firstName},

Welcome to CollabHub! We're excited to have you join our community of collaborators.

Here's what you can do next:
1. Complete your profile
2. Add your skills and interests
3. Start discovering projects
4. Connect with other members

If you have any questions, feel free to reach out to our support team.

Happy collaborating!

Best regards,
CollabHub Team
    `;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background-color: #4F46E5; 
      color: white; 
      text-decoration: none; 
      border-radius: 6px; 
      margin: 20px 0;
    }
    .feature-list { background-color: #F3F4F6; padding: 20px; border-radius: 6px; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome to CollabHub, ${firstName}! 🎉</h2>
    <p>We're thrilled to have you join our community of collaborators.</p>
    <div class="feature-list">
      <h3>Get Started:</h3>
      <ul>
        <li>✅ Complete your profile</li>
        <li>🎯 Add your skills and interests</li>
        <li>🚀 Start discovering projects</li>
        <li>🤝 Connect with other members</li>
      </ul>
    </div>
    <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
    <p>If you have any questions, our support team is here to help!</p>
    <div class="footer">
      <p>Happy collaborating!</p>
      <p>&copy; ${new Date().getFullYear()} CollabHub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail(email, subject, text, html);
  }

  /**
   * Send password changed notification
   * @param email - User email
   */
  async sendPasswordChangedEmail(email: string): Promise<void> {
    const subject = 'Password Changed Successfully - CollabHub';
    const text = `
Your password has been changed successfully.

If you didn't make this change, please contact our support team immediately.

Best regards,
CollabHub Team
    `;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .alert { background-color: #D1FAE5; padding: 15px; border-radius: 6px; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Changed Successfully ✅</h2>
    <div class="alert">
      <p><strong>Your password has been changed successfully.</strong></p>
    </div>
    <p>If you didn't make this change, please contact our support team immediately at support@collabhub.com</p>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} CollabHub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail(email, subject, text, html);
  }
}
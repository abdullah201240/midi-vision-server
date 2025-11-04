import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    // Try different SMTP configurations for Gmail
    const smtpHost =
      this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
    const smtpPort = this.configService.get<number>('SMTP_PORT') || 587;
    const smtpSecure = this.configService.get<boolean>('SMTP_SECURE') || false;
    const smtpUser =
      this.configService.get<string>('SMTP_USER') || 'your-smtp-user';
    const smtpPass =
      this.configService.get<string>('SMTP_PASS') || 'your-smtp-password';

    this.transporter = createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure, // true for 465, false for other ports (587)
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
        // Add specific TLS options for Gmail compatibility
      },
      // Add connection timeout and other options for better reliability
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    // Log the SMTP configuration for debugging
    this.logger.log(`SMTP Configuration:`, {
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
    });
  }
  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const mailOptions = {
      from:
        this.configService.get<string>('SMTP_FROM') ||
        '"MediVision" <no-reply@medivision.com>',
      to,
      subject: 'MediVision - Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0D3B2E;">MediVision OTP Verification</h2>
          <p>Hello,</p>
          <p>Your OTP code for signup/login is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="margin: 0; color: #0D3B2E; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            This is an automated message from MediVision. Please do not reply to this email.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`OTP email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${to}:`, error);
      // Re-throw the error so the calling function can handle it
      throw error;
    }
  }
}

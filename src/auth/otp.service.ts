import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../users/dto/register.dto';

interface OtpRecord {
  code: string;
  expiresAt: Date;
  userData?: RegisterDto; // Store user data for signup
}

@Injectable()
export class OtpService {
  private otpStore: Map<string, OtpRecord> = new Map();
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private emailService: EmailService,
    private usersService: UsersService,
  ) {}

  generateOtp(): string {
    // Generate a 4-digit OTP
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async sendOtpForSignup(
    userData: RegisterDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Check if user already exists
      const existingUser = await this.usersService.findByEmail(userData.email);
      if (existingUser) {
        this.logger.warn(`Signup attempt for existing user: ${userData.email}`);
        return { success: false, message: 'User already exists' };
      }

      // Generate OTP
      const otp = this.generateOtp();

      // Store OTP with expiration (10 minutes) and user data
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      this.otpStore.set(userData.email, {
        code: otp,
        expiresAt,
        userData,
      });

      this.logger.log(`Generated OTP for signup ${userData.email}: ${otp}`);

      try {
        // Send OTP via email (always send in production mode)
        await this.emailService.sendOtpEmail(userData.email, otp);
        this.logger.log(`OTP sent successfully to ${userData.email}`);
        return { success: true, message: 'OTP sent successfully' };
      } catch (error) {
        this.logger.error(`Failed to send OTP to ${userData.email}:`, error);
        return {
          success: false,
          message: 'Failed to send OTP. Please try again.',
        };
      }
    } catch (error) {
      this.logger.error(
        `Error in sendOtpForSignup for ${userData.email}:`,
        error,
      );
      return {
        success: false,
        message: 'An error occurred. Please try again.',
      };
    }
  }

  async sendOtp(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if user exists
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        this.logger.warn(`OTP request for non-existent user: ${email}`);
        return { success: false, message: 'User not found' };
      }

      // Generate OTP
      const otp = this.generateOtp();

      // Store OTP with expiration (10 minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      this.otpStore.set(email, {
        code: otp,
        expiresAt,
      });

      this.logger.log(`Generated OTP for ${email}: ${otp}`);

      try {
        // Send OTP via email (always send in production mode)
        await this.emailService.sendOtpEmail(email, otp);
        this.logger.log(`OTP sent successfully to ${email}`);
        return { success: true, message: 'OTP sent successfully' };
      } catch (error) {
        this.logger.error(`Failed to send OTP to ${email}:`, error);
        return {
          success: false,
          message: 'Failed to send OTP. Please try again.',
        };
      }
    } catch (error) {
      this.logger.error(`Error in sendOtp for ${email}:`, error);
      return {
        success: false,
        message: 'An error occurred. Please try again.',
      };
    }
  }

  async verifyOtpForSignup(
    email: string,
    otp: string,
  ): Promise<{ valid: boolean; message: string; user?: any }> {
    const storedOtp = this.otpStore.get(email);

    if (!storedOtp) {
      this.logger.warn(
        `OTP verification failed for ${email}: OTP not found or expired`,
      );
      return { valid: false, message: 'OTP not found or expired' };
    }

    // Check if OTP is expired
    if (new Date() > storedOtp.expiresAt) {
      this.otpStore.delete(email);
      this.logger.warn(`OTP verification failed for ${email}: OTP expired`);
      return { valid: false, message: 'OTP has expired' };
    }

    // Check if OTP matches
    if (storedOtp.code !== otp) {
      this.logger.warn(`OTP verification failed for ${email}: Invalid OTP`);
      return { valid: false, message: 'Invalid OTP' };
    }

    // Check if this OTP was for signup
    if (!storedOtp.userData) {
      this.logger.warn(
        `OTP verification failed for ${email}: OTP not for signup`,
      );
      return { valid: false, message: 'Invalid OTP flow' };
    }

    // OTP is valid, create the user
    try {
      const user = await this.usersService.create(storedOtp.userData);
      // Remove OTP from store
      this.otpStore.delete(email);
      this.logger.log(`User created successfully for ${email}`);
      return { valid: true, message: 'User created successfully', user };
    } catch (error) {
      this.logger.error(`Error creating user for ${email}:`, error);
      return { valid: false, message: 'Failed to create user' };
    }
  }

  verifyOtp(email: string, otp: string): { valid: boolean; message: string } {
    const storedOtp = this.otpStore.get(email);

    if (!storedOtp) {
      this.logger.warn(
        `OTP verification failed for ${email}: OTP not found or expired`,
      );
      return { valid: false, message: 'OTP not found or expired' };
    }

    // Check if OTP is expired
    if (new Date() > storedOtp.expiresAt) {
      this.otpStore.delete(email);
      this.logger.warn(`OTP verification failed for ${email}: OTP expired`);
      return { valid: false, message: 'OTP has expired' };
    }

    // Check if OTP matches
    if (storedOtp.code !== otp) {
      this.logger.warn(`OTP verification failed for ${email}: Invalid OTP`);
      return { valid: false, message: 'Invalid OTP' };
    }

    // Check if this OTP was for login (not signup)
    if (storedOtp.userData) {
      this.logger.warn(
        `OTP verification failed for ${email}: OTP not for login`,
      );
      return { valid: false, message: 'Invalid OTP flow' };
    }

    // OTP is valid, remove it from store
    this.otpStore.delete(email);
    this.logger.log(`OTP verified successfully for ${email}`);
    return { valid: true, message: 'OTP verified successfully' };
  }
}

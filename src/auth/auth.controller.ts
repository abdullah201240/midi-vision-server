import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from '../users/dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { userImageMulterConfig } from '../users/config/multer.config';

interface AuthenticatedRequest {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    [key: string]: any;
  };
}

interface SendOtpDto {
  email: string;
}

interface SendOtpForSignupDto {
  name: string;
  email: string;
}

interface VerifyOtpDto {
  email: string;
  otp: string;
}

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    const result = await this.otpService.sendOtp(sendOtpDto.email);
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    return { message: result.message };
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = this.otpService.verifyOtp(
      verifyOtpDto.email,
      verifyOtpDto.otp,
    );
    if (!result.valid) {
      throw new BadRequestException(result.message);
    }

    // If OTP is valid, find the user and log them in
    const user = await this.authService.usersService.findByEmail(
      verifyOtpDto.email,
    );
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const loginResult = this.authService.login(user);

    // Set JWT token in HTTP-only cookie
    res.cookie('access_token', loginResult.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return loginResult;
  }

  @Post('send-otp-for-signup')
  @HttpCode(HttpStatus.OK)
  async sendOtpForSignup(@Body() sendOtpForSignupDto: SendOtpForSignupDto) {
    // Create a minimal RegisterDto for the user
    const registerDto: RegisterDto = {
      name: sendOtpForSignupDto.name,
      email: sendOtpForSignupDto.email,
      password: Math.random().toString(36).slice(-8), // Generate a random password
    };

    const result = await this.otpService.sendOtpForSignup(registerDto);
    if (!result.success) {
      throw new BadRequestException(result.message);
    }
    return { message: result.message };
  }

  @Post('verify-otp-for-signup')
  @HttpCode(HttpStatus.OK)
  async verifyOtpForSignup(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.otpService.verifyOtpForSignup(
      verifyOtpDto.email,
      verifyOtpDto.otp,
    );
    if (!result.valid) {
      throw new BadRequestException(result.message);
    }

    // If OTP is valid and user is created, log them in
    const loginResult = this.authService.login(result.user);

    // Set JWT token in HTTP-only cookie
    res.cookie('access_token', loginResult.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return loginResult;
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('image', userImageMulterConfig))
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    const imageName = file?.filename;
    const result = await this.authService.register(registerDto, imageName);

    // Set JWT token in HTTP-only cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Request() req: AuthenticatedRequest,
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = this.authService.login(req.user);

    // Set JWT token in HTTP-only cookie
    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return result;
  }

  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    // Clear the access_token cookie
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}

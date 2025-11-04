import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../users/dto/register.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    public usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<UserResponseDto> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.validatePassword(password))) {
      // Create a copy with only properties that exist in UserResponseDto
      const result: Partial<UserResponseDto> = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        image: user.image,
        coverPhoto: user.coverPhoto,
        role: user.role,
        location: user.location,
        bio: user.bio,
        createdAt: user.createdAt,
      };
      return result;
    }
    return null;
  }

  async register(
    registerDto: RegisterDto,
    imageName?: string,
  ): Promise<{
    user: UserResponseDto;
    access_token: string;
  }> {
    const user = await this.usersService.create(registerDto, imageName);
    const access_token = this.generateToken(user);
    return {
      user,
      access_token,
    };
  }

  login(user: Partial<UserResponseDto>): {
    user: UserResponseDto;
    access_token: string;
  } {
    const userResponse = new UserResponseDto(user);
    const access_token = this.generateToken(userResponse);
    return {
      user: userResponse,
      access_token,
    };
  }

  private generateToken(user: UserResponseDto): string {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
    };
    return this.jwtService.sign(payload);
  }
}

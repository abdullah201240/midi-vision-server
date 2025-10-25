import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from '../users/dto/register.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.validatePassword(password))) {
      const { password, ...result } = user;
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
    const access_token = await this.generateToken(user);
    return {
      user,
      access_token,
    };
  }

  async login(user: any): Promise<{
    user: UserResponseDto;
    access_token: string;
  }> {
    const userResponse = new UserResponseDto(user);
    const access_token = await this.generateToken(userResponse);
    return {
      user: userResponse,
      access_token,
    };
  }

  private async generateToken(user: UserResponseDto): Promise<string> {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
    };
    return this.jwtService.sign(payload);
  }
}

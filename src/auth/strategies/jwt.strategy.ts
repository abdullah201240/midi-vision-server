import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

interface JwtPayload {
  sub: string;
  email: string;
}

interface SanitizedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any; // Allow additional properties
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          // Try to extract from cookie first, then fallback to Authorization header
          let token: string | null = null;

          if (
            request?.cookies?.access_token &&
            typeof request.cookies.access_token === 'string'
          ) {
            token = request.cookies.access_token;
          } else {
            const authHeader = request?.headers?.authorization;
            if (
              authHeader &&
              typeof authHeader === 'string' &&
              authHeader.startsWith('Bearer ')
            ) {
              token = authHeader.substring(7);
            }
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: JwtPayload): Promise<SanitizedUser> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Return a sanitized user object without sensitive information
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}

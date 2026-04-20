import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    // @TODO: Ensure JWT_SECRET is set in your .env file
    // This should be a strong, random string (e.g., generate with: openssl rand -base64 32)
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      console.error('JWT_SECRET is not defined in environment variables');
      throw new Error('JWT_SECRET is not defined - add it to your .env file');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub) throw new UnauthorizedException();

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}

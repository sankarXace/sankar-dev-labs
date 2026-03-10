import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface ValidateTokenPayload {
  token: string;
}

export interface ValidateTokenResponse {
  sub: string;
  email: string;
}

@Controller()
export class AuthTcpController {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  @MessagePattern('validateToken')
  async validateToken(@Payload() payload: ValidateTokenPayload): Promise<ValidateTokenResponse> {
    const token = payload?.token;
    if (!token || typeof token !== 'string') {
      throw new UnauthorizedException('Token required');
    }
    try {
      const secret = this.config.get<string>('JWT_SECRET', 'change-me');
      const decoded = await this.jwt.verifyAsync<{ sub: string; email: string }>(token, { secret });
      if (!decoded.sub || !decoded.email) {
        throw new UnauthorizedException('Invalid token payload');
      }
      return { sub: decoded.sub, email: decoded.email };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

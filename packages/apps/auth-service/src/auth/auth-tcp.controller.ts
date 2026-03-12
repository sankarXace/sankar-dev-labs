import { Controller, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApiKeyService } from '../api-key/api-key.service';

export interface ValidateTokenPayload {
  token: string;
}

export interface ValidateTokenResponse {
  sub: string;
  email: string;
}

export interface ValidateApiKeyPayload {
  apiKey: string;
}

export interface ValidateApiKeyResponse {
  workspaceId: string;
  userId: string;
}

@Controller()
export class AuthTcpController {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly apiKeyService: ApiKeyService,
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

  @MessagePattern('validateApiKey')
  async validateApiKey(@Payload() payload: ValidateApiKeyPayload): Promise<ValidateApiKeyResponse | null> {
    const apiKey = payload?.apiKey;
    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('API key required');
    }
    const result = await this.apiKeyService.validateKey(apiKey);
    if (!result) {
      throw new UnauthorizedException('Invalid or expired API key');
    }
    return result;
  }
}

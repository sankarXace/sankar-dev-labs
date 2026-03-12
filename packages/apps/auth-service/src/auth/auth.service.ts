import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@sankar-dev-labs/database';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface SanitizedUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: SanitizedUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  private sanitize(user: { id: string; email: string; name: string | null; avatarUrl: string | null; createdAt: Date }): SanitizedUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }

  async register(dto: RegisterDto): Promise<SanitizedUser> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name ?? null,
      },
    });
    return this.sanitize(user);
  }

  async login(dto: LoginDto): Promise<TokenResponse> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const secret = this.config.get<string>('JWT_SECRET', 'change-me');
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email },
      { secret, expiresIn: '15m' }
    );
    const refreshToken = this.jwt.sign(
      { sub: user.id },
      { secret, expiresIn: '7d' }
    );
    return {
      accessToken,
      refreshToken,
      user: this.sanitize(user),
    };
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    const secret = this.config.get<string>('JWT_SECRET', 'change-me');
    let decoded: { sub: string };
    try {
      decoded = await this.jwt.verifyAsync<{ sub: string }>(refreshToken, { secret });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, email: user.email },
      { secret, expiresIn: '15m' }
    );
    const newRefreshToken = this.jwt.sign(
      { sub: user.id },
      { secret, expiresIn: '7d' }
    );
    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: this.sanitize(user),
    };
  }
}

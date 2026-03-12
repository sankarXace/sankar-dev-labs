import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '@sankar-dev-labs/database';

const KEY_PREFIX = 'sk_';
const RAW_KEY_BYTES = 32;

function hashKey(plain: string): string {
  return createHash('sha256').update(plain, 'utf8').digest('hex');
}

@Injectable()
export class ApiKeyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workspaceId: string,
    userId: string,
    options: { name: string; expiresInDays?: number }
  ): Promise<{ id: string; name: string; rawKey: string; workspaceId: string; createdAt?: Date }> {
    const rawKey = KEY_PREFIX + randomBytes(RAW_KEY_BYTES).toString('base64url');
    const keyHash = hashKey(rawKey);
    const expiresAt = options.expiresInDays
      ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const created = await this.prisma.apiKey.create({
      data: {
        workspaceId,
        userId,
        keyHash,
        name: options.name,
        expiresAt,
      },
    });

    return {
      id: created.id,
      name: created.name,
      rawKey,
      workspaceId: created.workspaceId,
    };
  }

  async list(workspaceId: string, userId?: string): Promise<{ id: string; name: string; workspaceId: string; userId: string; lastUsedAt: Date | null; expiresAt: Date | null }[]> {
    const keys = await this.prisma.apiKey.findMany({
      where: { workspaceId, ...(userId ? { userId } : {}) },
      select: { id: true, name: true, workspaceId: true, userId: true, lastUsedAt: true, expiresAt: true },
    });
    return keys;
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.apiKey.delete({ where: { id } });
  }

  async validateKey(plainKey: string): Promise<{ workspaceId: string; userId: string } | null> {
    const keyHash = hashKey(plainKey);
    const key = await this.prisma.apiKey.findFirst({
      where: { keyHash },
    });
    if (!key) return null;
    if (key.expiresAt && key.expiresAt < new Date()) return null;
    await this.prisma.apiKey.update({
      where: { id: key.id },
      data: { lastUsedAt: new Date() },
    }).catch(() => {});
    return { workspaceId: key.workspaceId, userId: key.userId };
  }
}

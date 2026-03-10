import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.headers['x-api-key'] ?? request.headers['authorization']?.replace(/^ApiKey\s+/i, '');
    return typeof key === 'string' && key.length > 0;
  }
}

import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class WorkspaceIdPipe implements PipeTransform<string | undefined, string> {
  transform(value: string | undefined, metadata?: { data?: string; type?: string }): string {
    const key = metadata?.data ?? 'workspaceId';
    const val = value;
    if (val === undefined || val === null || val === '') {
      throw new BadRequestException(`Missing required parameter: ${key}`);
    }
    if (typeof val !== 'string' || val.trim().length === 0) {
      throw new BadRequestException(`${key} must be a non-empty string`);
    }
    return val.trim();
  }
}

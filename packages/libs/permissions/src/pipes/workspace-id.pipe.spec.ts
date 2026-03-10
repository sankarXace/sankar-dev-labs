import { BadRequestException } from '@nestjs/common';
import { WorkspaceIdPipe } from './workspace-id.pipe';

describe('WorkspaceIdPipe', () => {
  let pipe: WorkspaceIdPipe;

  beforeEach(() => {
    pipe = new WorkspaceIdPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return workspaceId when valid string provided', () => {
    const result = pipe.transform('ws-123', { data: 'workspaceId', type: 'param' });
    expect(result).toBe('ws-123');
  });

  it('should throw BadRequestException when value is undefined', () => {
    expect(() => pipe.transform(undefined)).toThrow(BadRequestException);
    expect(() => pipe.transform(undefined)).toThrow(/Missing required parameter/);
  });

  it('should throw BadRequestException when value is empty string', () => {
    expect(() => pipe.transform('')).toThrow(BadRequestException);
  });

  it('should trim whitespace', () => {
    const result = pipe.transform('  ws-456  ');
    expect(result).toBe('ws-456');
  });
});

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateWorkspaceDto } from './workspace.dto';

describe('CreateWorkspaceDto', () => {
  it('should pass with valid name and slug', async () => {
    const dto = plainToInstance(CreateWorkspaceDto, {
      name: 'My Workspace',
      slug: 'my-workspace',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail when name is empty', async () => {
    const dto = plainToInstance(CreateWorkspaceDto, {
      name: '',
      slug: 'valid-slug',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('should fail when slug has invalid characters', async () => {
    const dto = plainToInstance(CreateWorkspaceDto, {
      name: 'Workspace',
      slug: 'Invalid Slug!',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'slug')).toBe(true);
  });
});

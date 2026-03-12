import { ROLES_KEY, Roles } from './roles.decorator';

describe('Roles decorator', () => {
  it('should set metadata with ROLES_KEY', () => {
    const roles = ['ADMIN', 'OWNER'];
    const decorator = Roles(...roles);
    expect(decorator).toBeDefined();
    class TestClass {}
    decorator(TestClass);
    const metadata = Reflect.getMetadata(ROLES_KEY, TestClass);
    expect(metadata).toEqual(roles);
  });
});

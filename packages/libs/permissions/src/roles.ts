/**
 * Role-to-permission mapping for RBAC.
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  OWNER: ['workspace:write', 'workspace:delete', 'member:write', 'member:delete', 'issue:write', 'document:write', 'audit:read', 'webhook:write'],
  ADMIN: ['workspace:write', 'member:write', 'issue:write', 'document:write', 'audit:read', 'webhook:write'],
  MEMBER: ['issue:write', 'document:write', 'audit:read'],
  VIEWER: ['audit:read'],
};

export function hasPermission(role: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

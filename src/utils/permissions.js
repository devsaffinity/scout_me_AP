export const modulePermissions = {
  super_admin: ['*'],
  user_ops_manager: [
    'dashboard',
    'users_profiles',
    'premium_nfc',
    'taxonomy',
    'verification.approve',
    'verification.reject',
    'athletes.update',
    'recruiters.update',
    'bracelets.assign',
  ],
  community_manager: [
    'dashboard',
    'discovery_engagement',
    'messaging_notifications',
    'notifications.create',
    'notifications.update',
    'messages.review',
  ],
  support_manager: [
    'dashboard',
    'users_profiles',
    'messaging_notifications',
    'premium_nfc',
    'messages.review',
    'notifications.create',
  ],
  analyst: ['dashboard', 'users_profiles', 'discovery_engagement', 'premium_nfc'],
};

export const normalizeRole = (role) =>
  String(role || '')
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_');

export const getPermissionsForRole = (role) => modulePermissions[normalizeRole(role)] || [];

export const canAccess = (role, permission) => {
  const permissions = getPermissionsForRole(role);
  return permissions.includes('*') || permissions.includes(permission);
};

export const canAccessModule = (role, moduleKey) => {
  const permissions = getPermissionsForRole(role);
  return (
    permissions.includes('*') ||
    permissions.includes(moduleKey) ||
    permissions.some((permission) => permission.startsWith(`${moduleKey}.`))
  );
};

export const canAccessAny = (role, permissionList = []) =>
  permissionList.some((permission) => canAccess(role, permission));

export const canAccessAll = (role, permissionList = []) =>
  permissionList.every((permission) => canAccess(role, permission));

export default {
  modulePermissions,
  normalizeRole,
  getPermissionsForRole,
  canAccess,
  canAccessModule,
  canAccessAny,
  canAccessAll,
};

export const PERMISSIONS = {
  PERMISSIONS_READ: {
    action: 'permissions:read',
    description: 'View the list of permissions',
  },
  PERMISSIONS_CREATE: {
    action: 'permissions:create',
    description: 'Create new permissions',
  },
  PERMISSIONS_UPDATE: {
    action: 'permissions:update',
    description: 'Edit existing permissions',
  },
  PERMISSIONS_DELETE: {
    action: 'permissions:delete',
    description: 'Delete permissions',
  },

  USERS_READ: {
    action: 'users:read',
    description: 'View user accounts',
  },
  USERS_CREATE: {
    action: 'users:create',
    description: 'Add new users',
  },
  USERS_UPDATE: {
    action: 'users:update',
    description: 'Edit user details',
  },
  USERS_DELETE: {
    action: 'users:delete',
    description: 'Remove users',
  },
} as const;
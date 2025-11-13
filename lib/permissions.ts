import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';
import { createAccessControl } from 'better-auth/plugins/access';

export const statement = {
  ...defaultStatements,
  project: ['view', 'create', 'edit', 'delete'],
  user: [
    'view',
    'create',
    'edit',
    'update',
    'delete',
    'create',
    'list',
    'set-role',
    'ban',
    'impersonate',
    'delete',
    'set-password',
  ],
  session: ['list', 'revoke', 'delete'],
  role: ['view', 'create', 'edit', 'delete'],
  apar: ['view', 'create', 'edit', 'delete'],
  hydrant: ['view', 'create', 'edit', 'delete'],
  cekpoint: ['view', 'create', 'edit', 'delete'],
  inspection: ['view', 'create', 'edit', 'delete'],
  report: ['view', 'create', 'edit', 'delete'],
} as const;

export const ac = createAccessControl(statement);

export const inspector = ac.newRole({
  apar: ['view'],
  hydrant: ['view'],
  cekpoint: ['view'],
  inspection: ['view', 'create', 'edit', 'delete'],
  report: ['view'],
});

export const manager = ac.newRole({
  report: ['view'],
  apar: ['view'],
  hydrant: ['view'],
  cekpoint: ['view'],
  inspection: ['view'],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  apar: ['view', 'create', 'edit', 'delete'],
  hydrant: ['view', 'create', 'edit', 'delete'],
  cekpoint: ['view', 'create', 'edit', 'delete'],
  inspection: ['view', 'create', 'edit', 'delete'],
  report: ['view', 'create', 'edit', 'delete'],
  user: [
    'list',
    'create',
    'edit',
    'update',
    'delete',
    'set-role',
    'ban',
    'impersonate',
    'set-password',
  ],
  role: ['view'],
  project: ['view', 'create', 'edit', 'delete'],
});

export const superadmin = ac.newRole({
  ...adminAc.statements,
  project: ['view', 'create', 'edit', 'delete'],
  user: [
    'view',
    'create',
    'edit',
    'delete',
    'set-role',
    'ban',
    'impersonate',
    'set-password',
  ],
  role: ['view', 'create', 'edit', 'delete'],
  apar: ['view', 'create', 'edit', 'delete'],
  hydrant: ['view', 'create', 'edit', 'delete'],
  cekpoint: ['view', 'create', 'edit', 'delete'],
  inspection: ['view', 'create', 'edit', 'delete'],
  report: ['view', 'create', 'edit', 'delete'],
});

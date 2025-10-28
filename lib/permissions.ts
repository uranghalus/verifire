import { createAccessControl } from 'better-auth/plugins/access';

export const statement = {
  project: ['view', 'create', 'edit', 'delete'],
} as const;

const ac = createAccessControl(statement);

export const inspector = ac.newRole({
  project: ['view', 'create'],
});

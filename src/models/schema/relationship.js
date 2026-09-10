const { relations } = require('drizzle-orm');
const { users } = require('./users');
const { organizations } = require('./organizations');
const { roles } = require('./roles');
const { permissions } = require('./permissions');
const { role_permissions } = require('./role_permissions');
const { memberships } = require('./memberships');
const { projects } = require('./projects');
const { tasks } = require('./tasks');

// users: one user -> many memberships
const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
}));

// organizations: one org -> many roles, many memberships, many projects
const organizationsRelations = relations(organizations, ({ many }) => ({
  roles: many(roles),
  memberships: many(memberships),
  projects: many(projects),
}));

// roles: belongs to one org, has many role_permissions, has many memberships
const rolesRelations = relations(roles, ({ one, many }) => ({
  fields: [roles.organizationId],
    references: [organizations.id],
  organization: one(organizations, {
  }),
  role_permissions: many(role_permissions),
  memberships: many(memberships),
}));

// permissions: one permission -> many role_permissions
const permissionsRelations = relations(permissions, ({ many }) => ({
  role_permissions: many(role_permissions),
}));

// role_permissions: belongs to one role, one permission
const rolePermissionsRelations = relations(role_permissions, ({ one }) => ({
  role: one(roles, {
    fields: [role_permissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [role_permissions.permissionId],
    references: [permissions.id],
  }),
}));

// memberships: belongs to one user, one org, one role
const membershipsRelations = relations(memberships, ({ one }) => ({
  use_p: one(users, {
    fields: [memberships.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [memberships.organizationId],
    references: [organizations.id],
  }),
  role: one(roles, {
    fields: [memberships.roleId],
    references: [roles.id],
  }),
}));

// projects: belongs to one org, has many tasks
const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id],
  }),
  tasks: many(tasks),
}));

// tasks: belongs to one project, one optional assignee (user)
const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
}));

module.exports = {
  usersRelations,
  organizationsRelations,
  rolesRelations,
  permissionsRelations,
  rolePermissionsRelations,
  membershipsRelations,
  projectsRelations,
  tasksRelations,
};
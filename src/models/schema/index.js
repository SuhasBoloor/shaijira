const { users } = require('./users');
const { organizations } = require('./organizations');
const { roles } = require('./roles');
const { permissions } = require('./permissions');
const { role_permissions  } = require('./role_permissions');
const { memberships } = require('./memberships');
const { projects } = require('./projects');
const { tasks } = require('./tasks');
const { project_members } = require('./project_members');

const {
  usersRelations,
  organizationsRelations,
  rolesRelations,
  permissionsRelations,
  rolePermissionsRelations,
  membershipsRelations,
  projectsRelations,
  tasksRelations,
} = require('./relationship');

module.exports = {
  users,
  organizations,
  roles,
  permissions,
  role_permissions,
  memberships,
  projects,
  tasks,
  project_members,
  usersRelations,
  organizationsRelations,
  rolesRelations,
  permissionsRelations,
  rolePermissionsRelations,
  membershipsRelations,
  projectsRelations,
  tasksRelations,
};

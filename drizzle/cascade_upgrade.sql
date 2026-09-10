CREATE TABLE IF NOT EXISTS project_members (
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, user_id)
);

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_project_id_fkey;
ALTER TABLE tasks ADD CONSTRAINT tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_assignee_id_fkey;
ALTER TABLE tasks ADD CONSTRAINT tasks_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE role_permissions DROP CONSTRAINT IF EXISTS role_permissions_role_id_roles_id_fk;
ALTER TABLE role_permissions ADD CONSTRAINT role_permissions_role_id_roles_id_fk FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;

ALTER TABLE role_permissions DROP CONSTRAINT IF EXISTS role_permissions_permission_id_permissions_id_fk;
ALTER TABLE role_permissions ADD CONSTRAINT role_permissions_permission_id_permissions_id_fk FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE;

ALTER TABLE memberships DROP CONSTRAINT IF EXISTS memberships_role_id_roles_id_fk;
ALTER TABLE memberships ADD CONSTRAINT memberships_role_id_roles_id_fk FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;

ALTER TABLE memberships DROP CONSTRAINT IF EXISTS memberships_organization_id_organizations_id_fk;
ALTER TABLE memberships ADD CONSTRAINT memberships_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE memberships DROP CONSTRAINT IF EXISTS memberships_user_id_users_id_fk;
ALTER TABLE memberships ADD CONSTRAINT memberships_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_organization_id_organizations_id_fk;
ALTER TABLE projects ADD CONSTRAINT projects_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE roles DROP CONSTRAINT IF EXISTS roles_organization_id_organizations_id_fk;
ALTER TABLE roles ADD CONSTRAINT roles_organization_id_organizations_id_fk FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

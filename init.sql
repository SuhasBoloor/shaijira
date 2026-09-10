-- Extensions & Types
DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username text NOT NULL UNIQUE,
    password varchar NOT NULL,
    is_superadmin boolean DEFAULT false,
    created_at timestamp DEFAULT now() NOT NULL
);

-- 2. Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL
);

-- 3. Roles
CREATE TABLE IF NOT EXISTS roles (
    id serial PRIMARY KEY,
    name text NOT NULL,
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at timestamp DEFAULT now() NOT NULL
);

-- 4. Permissions
CREATE TABLE IF NOT EXISTS permissions (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamp DEFAULT now() NOT NULL
);

-- 5. Role Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id integer NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id integer NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY(role_id, permission_id)
);

-- 6. Memberships
CREATE TABLE IF NOT EXISTS memberships (
    role_id integer NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(role_id, organization_id, user_id)
);

-- 7. Projects
CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    description text,
    created_at timestamp DEFAULT now() NOT NULL
);

-- 8. Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assignee_id uuid REFERENCES users(id) ON DELETE SET NULL,
    status task_status NOT NULL,
    created_at timestamp DEFAULT now() NOT NULL
);

-- 9. Project Members (Resource Scoping Junction Table)
CREATE TABLE IF NOT EXISTS project_members (
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(project_id, user_id)
);

-- Unique Indexes
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_org_role ON roles (name, organization_id);
CREATE UNIQUE INDEX IF NOT EXISTS unique_org_project_name ON projects (organization_id, name);
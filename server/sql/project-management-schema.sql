-- Project Management Schema for PostgreSQL / MySQL
-- PostgreSQL enum definitions
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'project_status'
) THEN CREATE TYPE project_status AS ENUM ('active', 'completed', 'on_hold');
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'project_member_role'
) THEN CREATE TYPE project_member_role AS ENUM ('admin', 'member');
END IF;
END $$;
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT NULL,
    deadline TIMESTAMPTZ NULL,
    status project_status NOT NULL DEFAULT 'active',
    progress INTEGER NOT NULL DEFAULT 0,
    owner_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,
    CONSTRAINT fk_project_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status_deadline_deleted_at ON projects(status, deadline, deleted_at);
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at);
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role project_member_role NOT NULL DEFAULT 'member',
    CONSTRAINT fk_project_member_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_project_member_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_project_member_user UNIQUE (project_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_role ON project_members(role);
-- MySQL Notes:
-- Convert enums to native MySQL enum syntax if this file is used for MySQL schema generation.
-- Example: status ENUM('active','completed','on_hold') NOT NULL DEFAULT 'active'
-- and role ENUM('admin','member') NOT NULL DEFAULT 'member'.
/*
  # User Roles and Permissions

  This migration:
  1. Creates user roles table if not exists
  2. Sets up role-based access control
  3. Creates policies for products and user roles
*/

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'EDITOR')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies first
DROP POLICY IF EXISTS "editors_and_admins_can_manage_products" ON products;
DROP POLICY IF EXISTS "Authenticated users can create products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "user_roles_self_read" ON user_roles;
DROP POLICY IF EXISTS "user_roles_admin_all" ON user_roles;
DROP POLICY IF EXISTS "admins_manage_user_roles" ON user_roles;
DROP POLICY IF EXISTS "users_read_own_role" ON user_roles;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION auth.user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND (role = required_role OR role = 'ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new policies for products
CREATE POLICY "editors_and_admins_can_manage_products"
ON products
FOR ALL
USING (auth.user_has_role('EDITOR'))
WITH CHECK (auth.user_has_role('EDITOR'));

-- Create new policies for user roles
CREATE POLICY "admins_manage_user_roles"
ON user_roles
FOR ALL
USING (auth.user_has_role('ADMIN'))
WITH CHECK (auth.user_has_role('ADMIN'));

CREATE POLICY "users_read_own_role"
ON user_roles
FOR SELECT
USING (auth.uid() = user_id);
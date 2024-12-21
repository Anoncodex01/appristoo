/*
  # Fix user roles policies

  1. Changes:
    - Drop and recreate user roles policies to fix infinite recursion
    - Add initial admin user for bootstrapping

  2. Security:
    - Simplified policy checks to avoid recursion
    - Maintain proper access control
*/

-- First, ensure we have the user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'EDITOR')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable Row-Level Security (RLS)
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

-- Create simplified policies that avoid recursion

-- Policy: Users can read their own role
CREATE POLICY "Users can read own role"
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Admins can manage all roles (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage all roles"
  ON user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 
      FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'ADMIN'
    )
  );

-- Function to safely get current admin count
CREATE OR REPLACE FUNCTION get_admin_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM user_roles WHERE role = 'ADMIN');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert initial admin user if no admins exist
DO $$
BEGIN
  IF (SELECT get_admin_count()) = 0 THEN
    INSERT INTO user_roles (user_id, role, created_by)
    SELECT id, 'ADMIN', id  -- Set `created_by` to `id`
    FROM auth.users
    WHERE email = 'admin@apristo.com'
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
END
$$;

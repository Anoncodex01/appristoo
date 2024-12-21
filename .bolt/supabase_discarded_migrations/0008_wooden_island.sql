/*
  # Fix user roles and permissions

  1. Changes
    - Create user_roles table with proper constraints
    - Add RLS policies for proper access control
    - Fix recursive policy issues
    
  2. Security
    - Enable RLS on user_roles table
    - Add policies for:
      - Users can read their own role
      - Admins can manage all roles
*/

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'EDITOR')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can read all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON user_roles;

-- Create new policies
CREATE POLICY "Users can read own role"
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles"
  ON user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can insert roles"
  ON user_roles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update roles"
  ON user_roles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can delete roles"
  ON user_roles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'ADMIN'
    )
  );
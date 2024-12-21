/*
  # Update user roles policies

  1. Changes
    - Add missing RLS policies for user_roles table
    - Ensure proper role-based access control

  2. Security
    - Users can read their own role
    - Only super admins can manage roles
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;
DROP POLICY IF EXISTS "Super admins can manage roles" ON user_roles;

-- Create new policies
CREATE POLICY "Users can read their own role"
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage roles"
  ON user_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'ADMIN'
    )
  );
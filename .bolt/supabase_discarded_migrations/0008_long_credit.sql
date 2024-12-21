/*
  # Fix Authentication and Remove User Roles
  
  This migration:
  1. Creates products table if it doesn't exist
  2. Drops user roles and updates authentication policies
*/

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  min_order INTEGER DEFAULT 1,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop the user_roles table and all related policies
DROP TABLE IF EXISTS user_roles CASCADE;

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "editors_and_admins_can_manage_products" ON products;
DROP POLICY IF EXISTS "Authenticated users can create products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;

-- Create new simplified policies
CREATE POLICY "Public can view products"
  ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage products"
  ON products
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
/*
  # Fresh Database Schema Setup
  
  This migration creates a complete fresh start with:
  1. Core product management tables
  2. User interaction tables (wishlists, views)
  3. Row Level Security policies
  4. Performance optimized indexes
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS product_views CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS product_specifications CASCADE;
DROP TABLE IF EXISTS price_ranges CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Products Table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  min_order INTEGER DEFAULT 1,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Images Table
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Price Ranges Table
CREATE TABLE price_ranges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL CHECK (min_quantity > 0),
  max_quantity INTEGER NOT NULL CHECK (max_quantity >= min_quantity),
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0)
);

-- Product Specifications Table
CREATE TABLE product_specifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  specification TEXT NOT NULL
);

-- Wishlists Table
CREATE TABLE wishlists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Product Views Table
CREATE TABLE product_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 1,
  last_viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id)
);

-- Drop existing policies if they exist
DO $$ BEGIN
  -- Products policies
  DROP POLICY IF EXISTS "Enable read access for all users" ON products;
  DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
  DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
  DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;
  
  -- Related tables policies
  DROP POLICY IF EXISTS "Enable read access for all users" ON product_images;
  DROP POLICY IF EXISTS "Enable read access for all users" ON price_ranges;
  DROP POLICY IF EXISTS "Enable read access for all users" ON product_specifications;
  DROP POLICY IF EXISTS "Enable all access for authenticated users" ON product_images;
  DROP POLICY IF EXISTS "Enable all access for authenticated users" ON price_ranges;
  DROP POLICY IF EXISTS "Enable all access for authenticated users" ON product_specifications;
  
  -- Wishlists policies
  DROP POLICY IF EXISTS "Enable access to own wishlists only" ON wishlists;
  
  -- Product views policies
  DROP POLICY IF EXISTS "Enable read for all users" ON product_views;
  DROP POLICY IF EXISTS "Enable insert/update for all users" ON product_views;
  DROP POLICY IF EXISTS "Enable update for all users" ON product_views;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

-- Products Policies
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Related Tables Policies (Images, Prices, Specs)
CREATE POLICY "Enable read access for all users" ON product_images FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON price_ranges FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON product_specifications FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users" ON product_images
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON price_ranges
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON product_specifications
  FOR ALL USING (auth.role() = 'authenticated');

-- Wishlists Policies
CREATE POLICY "Enable access to own wishlists only" ON wishlists
  FOR ALL USING (auth.uid() = user_id);

-- Product Views Policies
CREATE POLICY "Enable read for all users" ON product_views
  FOR SELECT USING (true);

CREATE POLICY "Enable insert/update for all users" ON product_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON product_views
  FOR UPDATE USING (true);

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_archived;
DROP INDEX IF EXISTS idx_product_images_product;
DROP INDEX IF EXISTS idx_price_ranges_product;
DROP INDEX IF EXISTS idx_specifications_product;
DROP INDEX IF EXISTS idx_wishlists_user;
DROP INDEX IF EXISTS idx_wishlists_product;
DROP INDEX IF EXISTS idx_product_views_product;

-- Create indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_archived ON products(is_archived);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_price_ranges_product ON price_ranges(product_id);
CREATE INDEX idx_specifications_product ON product_specifications(product_id);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_wishlists_product ON wishlists(product_id);
CREATE INDEX idx_product_views_product ON product_views(product_id);
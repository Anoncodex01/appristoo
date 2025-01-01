/*
  # Update RLS policies for product relations

  1. Changes
    - Drop all existing policies to avoid conflicts
    - Create new policies for price ranges, product images, and specifications
    - Update product views policies
    
  2. Security
    - Ensure proper public access to product-related data
    - Maintain archived product filtering
*/

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON price_ranges;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON price_ranges;
DROP POLICY IF EXISTS "Public read access for price ranges" ON price_ranges;
DROP POLICY IF EXISTS "Allow public access to price ranges with products" ON price_ranges;

DROP POLICY IF EXISTS "Enable read access for all users" ON product_images;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON product_images;
DROP POLICY IF EXISTS "Public read access for product images" ON product_images;
DROP POLICY IF EXISTS "Allow public access to product images with products" ON product_images;

DROP POLICY IF EXISTS "Enable read access for all users" ON product_specifications;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON product_specifications;
DROP POLICY IF EXISTS "Public read access for specifications" ON product_specifications;
DROP POLICY IF EXISTS "Allow public access to product specifications with products" ON product_specifications;

-- Create new policies with unique names
CREATE POLICY "price_ranges_public_access"
  ON price_ranges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = price_ranges.product_id
      AND NOT p.is_archived
    )
  );

CREATE POLICY "product_images_public_access"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_images.product_id
      AND NOT p.is_archived
    )
  );

CREATE POLICY "product_specifications_public_access"
  ON product_specifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_specifications.product_id
      AND NOT p.is_archived
    )
  );

-- Update product_views policies
DROP POLICY IF EXISTS "product_views_public_read" ON product_views;
DROP POLICY IF EXISTS "product_views_insert" ON product_views;
DROP POLICY IF EXISTS "product_views_update" ON product_views;
DROP POLICY IF EXISTS "Allow public read access to product views" ON product_views;
DROP POLICY IF EXISTS "Allow public insert to product views" ON product_views;
DROP POLICY IF EXISTS "Allow public update to product views" ON product_views;

CREATE POLICY "product_views_select"
  ON product_views FOR SELECT
  USING (true);

CREATE POLICY "product_views_insert"
  ON product_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "product_views_update"
  ON product_views FOR UPDATE
  USING (true);
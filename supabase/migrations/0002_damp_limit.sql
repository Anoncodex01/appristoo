/*
  # Add seeding policy for products

  1. Changes
    - Add policy to allow seeding data when no products exist
    - Maintain existing security policies
*/

-- Add seeding policy for products table
CREATE POLICY "Allow seeding when empty" ON products
  FOR INSERT
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM products LIMIT 1
    )
  );

-- Add seeding policies for related tables
CREATE POLICY "Allow seeding when parent empty" ON product_images
  FOR INSERT
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM products LIMIT 1
    )
  );

CREATE POLICY "Allow seeding when parent empty" ON price_ranges
  FOR INSERT
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM products LIMIT 1
    )
  );

CREATE POLICY "Allow seeding when parent empty" ON product_specifications
  FOR INSERT
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM products LIMIT 1
    )
  );
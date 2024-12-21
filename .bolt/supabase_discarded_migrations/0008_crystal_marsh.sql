/*
  # Fix product update and improve policies

  1. Changes
    - Add stored procedure for atomic product updates
    - Update policies for related tables
    - Fix policy naming conflicts

  2. Security
    - Ensure proper RLS for all tables
    - Maintain data integrity during updates
*/

-- Create function for atomic product updates
CREATE OR REPLACE FUNCTION update_product(
  p_id UUID,
  p_name TEXT,
  p_description TEXT,
  p_category TEXT,
  p_min_order INTEGER,
  p_images TEXT[],
  p_price_ranges JSON[],
  p_specifications TEXT[]
) RETURNS VOID AS $$
BEGIN
  -- Update main product
  UPDATE products 
  SET 
    name = p_name,
    description = p_description,
    category = p_category,
    min_order = p_min_order
  WHERE id = p_id;

  -- Delete existing related data
  DELETE FROM product_images WHERE product_id = p_id;
  DELETE FROM price_ranges WHERE product_id = p_id;
  DELETE FROM product_specifications WHERE product_id = p_id;

  -- Insert new images
  INSERT INTO product_images (id, product_id, image_url, display_order)
  SELECT 
    gen_random_uuid(),
    p_id,
    image_url,
    row_number() OVER () - 1
  FROM unnest(p_images) AS image_url;

  -- Insert new price ranges
  INSERT INTO price_ranges (id, product_id, min_quantity, max_quantity, price)
  SELECT
    gen_random_uuid(),
    p_id,
    (value->>'minQuantity')::integer,
    (value->>'maxQuantity')::integer,
    (value->>'price')::decimal
  FROM jsonb_array_elements(array_to_json(p_price_ranges)::jsonb);

  -- Insert new specifications
  INSERT INTO product_specifications (id, product_id, specification)
  SELECT
    gen_random_uuid(),
    p_id,
    specification
  FROM unnest(p_specifications) AS specification;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update policies with unique names
DROP POLICY IF EXISTS "price_ranges_public_access" ON price_ranges;
CREATE POLICY "price_ranges_public_access"
  ON price_ranges FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products p
    WHERE p.id = price_ranges.product_id
    AND NOT p.is_archived
  ));

DROP POLICY IF EXISTS "product_images_public_access" ON product_images;
CREATE POLICY "product_images_public_access"
  ON product_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products p
    WHERE p.id = product_images.product_id
    AND NOT p.is_archived
  ));

DROP POLICY IF EXISTS "product_specifications_public_access" ON product_specifications;
CREATE POLICY "product_specifications_public_access"
  ON product_specifications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM products p
    WHERE p.id = product_specifications.product_id
    AND NOT p.is_archived
  ));

-- Update product views policies
DROP POLICY IF EXISTS "product_views_select" ON product_views;
CREATE POLICY "product_views_select"
  ON product_views FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "product_views_insert" ON product_views;
CREATE POLICY "product_views_insert"
  ON product_views FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "product_views_update" ON product_views;
CREATE POLICY "product_views_update"
  ON product_views FOR UPDATE
  USING (true);
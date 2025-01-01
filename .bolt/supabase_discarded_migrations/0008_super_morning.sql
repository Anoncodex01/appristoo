/*
  # Update product views tracking system v5

  1. Updates
    - Drop old policies
    - Create new policies with unique names
    - Update index for view count sorting
    - Refresh view count increment function
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "product_views_select_policy_v3" ON product_views;
DROP POLICY IF EXISTS "product_views_insert_policy_v3" ON product_views;
DROP POLICY IF EXISTS "product_views_update_policy_v3" ON product_views;
DROP POLICY IF EXISTS "product_views_select_policy_v4" ON product_views;
DROP POLICY IF EXISTS "product_views_insert_policy_v4" ON product_views;
DROP POLICY IF EXISTS "product_views_update_policy_v4" ON product_views;

-- Create product views table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 1,
  last_viewed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id)
);

-- Enable RLS
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

-- Create policies with unique names for this migration
CREATE POLICY "product_views_select_policy_v5" 
  ON product_views FOR SELECT
  USING (true);

CREATE POLICY "product_views_insert_policy_v5" 
  ON product_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "product_views_update_policy_v5" 
  ON product_views FOR UPDATE
  USING (true);

-- Create index with unique name
DROP INDEX IF EXISTS idx_product_views_count_v4;
CREATE INDEX idx_product_views_count_v5 
  ON product_views(view_count DESC);

-- Update function with new version
CREATE OR REPLACE FUNCTION increment_view_count(product_id_param UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO product_views (product_id)
  VALUES (product_id_param)
  ON CONFLICT (product_id) 
  DO UPDATE SET 
    view_count = product_views.view_count + 1,
    last_viewed_at = NOW();
END;
$$ LANGUAGE plpgsql;
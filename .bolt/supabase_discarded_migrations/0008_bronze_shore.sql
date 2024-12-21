-- Drop the function if it exists
DROP FUNCTION IF EXISTS get_active_categories_count;

-- Create or replace the function to count unique active categories
CREATE OR REPLACE FUNCTION get_active_categories_count()
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(DISTINCT category)
  FROM products
  WHERE is_archived = false;
$$;

/*
  # Add category count function
  
  Adds a stored function to count active products by category
*/

CREATE OR REPLACE FUNCTION get_active_categories_count()
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT COUNT(DISTINCT category)
    FROM products
    WHERE is_archived = false
  );
END;
$$;
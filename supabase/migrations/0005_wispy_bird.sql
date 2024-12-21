/*
  # Add transaction support functions
  
  1. New Functions
    - begin_transaction
    - commit_transaction
    - rollback_transaction
  
  2. Security
    - Functions accessible only to authenticated users
*/

-- Begin transaction function
CREATE OR REPLACE FUNCTION begin_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Start transaction
  BEGIN;
END;
$$;

-- Commit transaction function
CREATE OR REPLACE FUNCTION commit_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Commit transaction
  COMMIT;
END;
$$;

-- Rollback transaction function
CREATE OR REPLACE FUNCTION rollback_transaction()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Rollback transaction
  ROLLBACK;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION begin_transaction() TO authenticated;
GRANT EXECUTE ON FUNCTION commit_transaction() TO authenticated;
GRANT EXECUTE ON FUNCTION rollback_transaction() TO authenticated;
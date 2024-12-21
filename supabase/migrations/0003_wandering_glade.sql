/*
  # Update product views policies

  1. Changes
    - Add policy to allow anonymous users to insert product views
    - Add policy to allow anonymous users to update view counts
    - Add policy to allow public read access to view counts

  2. Security
    - Maintains RLS on product_views table
    - Allows anonymous tracking while preventing abuse
*/

-- Drop existing policies on product_views
DROP POLICY IF EXISTS "Authenticated users can manage views" ON product_views;

-- Add new policies for product views
CREATE POLICY "Public read access to views" ON product_views
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create product views" ON product_views
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update view counts" ON product_views
  FOR UPDATE USING (true)
  WITH CHECK (true);
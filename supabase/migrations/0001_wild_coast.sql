/*
  # Initial Schema Setup
  
  1. Tables
    - products
    - product_images
    - price_ranges
    - product_specifications
    - product_views
    - user_roles
    - wishlists
    - health_check

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Health check table
CREATE TABLE IF NOT EXISTS health_check (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  min_order integer DEFAULT 1,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Price ranges table
CREATE TABLE IF NOT EXISTS price_ranges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  min_quantity integer NOT NULL,
  max_quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Product specifications table
CREATE TABLE IF NOT EXISTS product_specifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  specification text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Product views table
CREATE TABLE IF NOT EXISTS product_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  view_count integer DEFAULT 1,
  last_viewed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('ADMIN', 'EDITOR')),
  created_at timestamptz DEFAULT now()
);

-- Wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_check ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (
    auth.role() = 'authenticated'
  );

CREATE POLICY "Public read access" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage images" ON product_images
  FOR ALL USING (
    auth.role() = 'authenticated'
  );

CREATE POLICY "Public read access" ON price_ranges
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage prices" ON price_ranges
  FOR ALL USING (
    auth.role() = 'authenticated'
  );

CREATE POLICY "Public read access" ON product_specifications
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage specifications" ON product_specifications
  FOR ALL USING (
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can manage views" ON product_views
  FOR ALL USING (
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can manage their own roles" ON user_roles
  FOR ALL USING (
    auth.uid() = user_id
  );

CREATE POLICY "Users can manage their own wishlist" ON wishlists
  FOR ALL USING (
    auth.uid() = user_id
  );

CREATE POLICY "Health check is public" ON health_check
  FOR SELECT USING (true);
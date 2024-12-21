import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'file:local.db';

export const db = createClient({
  url: dbUrl,
});

export async function initializeDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      min_order INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS price_ranges (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      min_quantity INTEGER NOT NULL,
      max_quantity INTEGER NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS product_specifications (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      specification TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);
}
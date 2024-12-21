import { z } from 'zod';
import { db } from '../config/database';
import { generateId } from '../utils/ids';

export const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['BEAUTY', 'ELECTRONICS', 'HOME APPLIANCES']),
  minOrder: z.number().int().positive().default(1),
  images: z.array(z.string().url()).min(1),
  priceRanges: z.array(z.object({
    minQuantity: z.number().int().positive(),
    maxQuantity: z.number().int().positive(),
    price: z.number().positive()
  })).min(1),
  specifications: z.array(z.string()).optional()
});

export type ProductInput = z.infer<typeof ProductSchema>;

export async function createProduct(input: ProductInput) {
  const productId = generateId();
  
  await db.transaction(async (tx) => {
    // Insert product
    await tx.execute({
      sql: `INSERT INTO products (id, name, description, category, min_order)
            VALUES (?, ?, ?, ?, ?)`,
      args: [productId, input.name, input.description, input.category, input.minOrder]
    });

    // Insert images
    for (let i = 0; i < input.images.length; i++) {
      await tx.execute({
        sql: `INSERT INTO product_images (id, product_id, image_url, display_order)
              VALUES (?, ?, ?, ?)`,
        args: [generateId(), productId, input.images[i], i]
      });
    }

    // Insert price ranges
    for (const range of input.priceRanges) {
      await tx.execute({
        sql: `INSERT INTO price_ranges (id, product_id, min_quantity, max_quantity, price)
              VALUES (?, ?, ?, ?, ?)`,
        args: [generateId(), productId, range.minQuantity, range.maxQuantity, range.price]
      });
    }

    // Insert specifications if any
    if (input.specifications) {
      for (const spec of input.specifications) {
        await tx.execute({
          sql: `INSERT INTO product_specifications (id, product_id, specification)
                VALUES (?, ?, ?)`,
          args: [generateId(), productId, spec]
        });
      }
    }
  });

  return productId;
}

export async function getProducts() {
  const products = await db.execute(`
    SELECT 
      p.*,
      json_group_array(DISTINCT json_object(
        'minQuantity', pr.min_quantity,
        'maxQuantity', pr.max_quantity,
        'price', pr.price
      )) as price_ranges,
      json_group_array(DISTINCT pi.image_url) as images,
      json_group_array(DISTINCT ps.specification) as specifications
    FROM products p
    LEFT JOIN price_ranges pr ON pr.product_id = p.id
    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN product_specifications ps ON ps.product_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `);

  return products.rows.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    minOrder: row.min_order,
    priceRanges: JSON.parse(row.price_ranges),
    images: JSON.parse(row.images),
    specifications: JSON.parse(row.specifications).filter(Boolean)
  }));
}

export async function getProductById(id: string) {
  const result = await db.execute({
    sql: `
      SELECT 
        p.*,
        json_group_array(DISTINCT json_object(
          'minQuantity', pr.min_quantity,
          'maxQuantity', pr.max_quantity,
          'price', pr.price
        )) as price_ranges,
        json_group_array(DISTINCT pi.image_url) as images,
        json_group_array(DISTINCT ps.specification) as specifications
      FROM products p
      LEFT JOIN price_ranges pr ON pr.product_id = p.id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      LEFT JOIN product_specifications ps ON ps.product_id = p.id
      WHERE p.id = ?
      GROUP BY p.id
    `,
    args: [id]
  });

  const row = result.rows[0];
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    minOrder: row.min_order,
    priceRanges: JSON.parse(row.price_ranges),
    images: JSON.parse(row.images),
    specifications: JSON.parse(row.specifications).filter(Boolean)
  };
}
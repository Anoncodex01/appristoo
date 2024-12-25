import { supabase } from '../supabase';
import { products as sampleProducts } from '../../data/products';

// Initialize database connection
export async function initDatabase() {
  try {
    // First check if we can connect to Supabase
    const { error: healthCheckError } = await supabase
      .from('health_check')
      .select('*')
      .limit(1);

    if (healthCheckError) {
      console.log('Using fallback data provider...');
      return;
    }

    // Check products table
    const { count, error: countError } = await supabase 
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError?.message?.includes('does not exist')) {
      console.log('Tables not found, waiting for migrations to complete...');
      return;
    }
    
    // If no products exist, seed with sample data
    if (count === 0) {
      console.log('Seeding database with sample products...');
      
      // Insert all products in parallel
      const insertProducts = async () => {
        const results = await Promise.all(sampleProducts.map(async (product) => {
        const { error: productError } = await supabase
          .from('products')
          .insert({
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            min_order: product.minOrder
          });

        if (productError) throw productError;
          return product.id;
        }));
        return results;
      };

      // Wait for all products to be inserted
      const productIds = await insertProducts();
      
      // Insert related data for all products
      const relatedDataPromises = productIds.flatMap(productId => {
        const product = sampleProducts.find(p => p.id === productId)!;
        return [
          supabase
            .from('product_images')
            .insert(
              product.images.map((url, index) => ({
                product_id: product.id,
                image_url: url,
                display_order: index
              }))
            ),
          supabase
            .from('price_ranges')
            .insert(
              product.priceRanges.map(range => ({
                product_id: product.id,
                min_quantity: range.minQuantity,
                max_quantity: range.maxQuantity,
                price: range.price
              }))
            ),
          product.specifications && [
            supabase
              .from('product_specifications')
              .insert(
                product.specifications.map(spec => ({
                  product_id: product.id,
                  specification: spec
                }))
              ) 
          ]
        ].filter(Boolean);
      });

      await Promise.all(relatedDataPromises);
    }

    console.log('Database connection established');
  } catch (error) {
    console.error('Database initialization error:', error);
    console.log('Falling back to local data...');
  }
}

console.log('Database connection established');

export { supabase };
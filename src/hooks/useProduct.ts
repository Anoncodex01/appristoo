import { useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            category,
            min_order,
            is_archived,
            product_images (
              image_url,
              display_order
            ),
            price_ranges (
              min_quantity,
              max_quantity,
              price
            ),
            product_specifications (
              specification
            )
          `)
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        setProduct(data ? {
          ...data,
          images: data.product_images?.map(img => img.image_url) || [],
          price_ranges: data.price_ranges || [],
          specifications: data.product_specifications?.map(spec => spec.specification) || []
        } : null);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

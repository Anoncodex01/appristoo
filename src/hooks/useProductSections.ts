import { useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';
import { formatProducts } from '../utils/formatting';

export function useProductSections() {
  const [sections, setSections] = useState<{
    newProducts: Product[];
    popularProducts: Product[];
    recommendedProducts: Product[];
  }>({
    newProducts: [],
    popularProducts: [],
    recommendedProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSections() {
      try {
        setLoading(true);
        
        // First check if we have any products
        const { count, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('is_archived', false);

        if (countError) throw countError;
        
        if (count === 0) {
          setSections({
            newProducts: [],
            popularProducts: [],
            recommendedProducts: []
          });
          return;
        }

        // Fetch new products (last 8 added)
        const { data: newProducts, error: newProductError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            category,
            min_order,
            is_archived,
            price_ranges (min_quantity, max_quantity, price),
            product_images (image_url),
            product_specifications (specification)
          `)
          .eq('is_archived', false)
          .order('created_at', { ascending: false })
          .limit(8);

        if (newProductError) {
          throw new Error(`Error fetching new products: ${newProductError.message}`);
        }

        // Fetch popular products based on view count
        const { data: popularProducts, error: popularProductError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            category,
            min_order,
            is_archived,
            price_ranges!inner (min_quantity, max_quantity, price),
            product_images!inner (image_url),
            product_specifications (specification),
            product_views (view_count)
          `)
          .eq('is_archived', false)
          .order('created_at', { ascending: false })
          .limit(8);

        if (popularProductError) {
          throw new Error(`Error fetching popular products: ${popularProductError.message}`);
        }

        // Filter out products without views and format the response
        const productsWithViews = (popularProducts || [])
          .sort((a, b) => {
            const aViews = a.product_views?.[0]?.view_count || 0;
            const bViews = b.product_views?.[0]?.view_count || 0;
            return bViews - aViews;
          })
          .map(p => ({
            ...p,
            product_views: undefined // Remove views data from final product object
          }))
          .slice(0, 8);
        // Fetch recommended products (random selection for now)
        const { data: recommendedProducts, error: recommendedProductError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            category,
            min_order,
            is_archived,
            price_ranges (min_quantity, max_quantity, price),
            product_images (image_url),
            product_specifications (specification)
          `)
          .eq('is_archived', false)
          .order('created_at', { ascending: false })
          .limit(8);

        if (recommendedProductError) {
          throw new Error(`Error fetching recommended products: ${recommendedProductError.message}`);
        }

        setSections({
          newProducts: formatProducts(newProducts || []),
          popularProducts: formatProducts(productsWithViews),
          recommendedProducts: formatProducts(recommendedProducts || [])
        });
      } catch (error) {
        console.error('Error loading product sections:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSections();
  }, []);

  return { ...sections, loading };
}
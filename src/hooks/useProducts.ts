import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';
import { formatProducts } from '../utils/formatting';
import { fetchProductById } from '../api/products';
import { getDataProvider } from '../lib/database/connection';
import type { Category } from '../types';

const PRODUCTS_PER_PAGE = 16;

export async function getCategoryProductCounts() {
  try {
    const provider = await getDataProvider();
    if ('from' in provider) {
      const { data, error } = await provider
        .from('products')
        .select('category')
        .eq('is_archived', false);

      if (error) throw error;
      return data.reduce((acc: Record<string, number>, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});
    } 
    return provider.getCategoryProductCounts();
  } catch (error) {
    console.error('Error fetching category counts:', error);
    return {};
  }
}
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
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
        `, { count: 'exact' });

      // Apply search filter if query exists
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      } 

      // Filter by category if selected
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      
      // Filter out archived products unless explicitly included
      query = query.eq('is_archived', false);
      
      // Get paginated results
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE - 1);
      
      if (error) throw error;
      setProducts(formatProducts(data || []));
      setTotalCount(count || 0);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentPage, selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    totalPages: Math.max(1, Math.ceil(totalCount / PRODUCTS_PER_PAGE)),
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    reloadProducts: loadProducts
  };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProduct() {
    try {
      setLoading(true);
      const data = await fetchProductById(id);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError('Failed to load product');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  return { product, loading, error, reloadProduct: loadProduct };
}
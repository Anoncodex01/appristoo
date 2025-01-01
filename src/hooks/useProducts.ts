import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';
import { formatProducts } from '../utils/formatting';
import { fetchProductById } from '../api/products';
import { getDataProvider } from '../lib/database/connection';
import type { Category } from '../types';

const PRODUCTS_PER_PAGE = 12; // Reduced for smoother loading

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      setError(null);

      const startRange = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const endRange = currentPage * PRODUCTS_PER_PAGE - 1;

      let query = supabase
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
        `, { count: 'exact' })
        .eq('is_archived', false)
        .range(startRange, endRange)
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw fetchError;
      }

      if (!data) {
        console.error('No data received from Supabase');
        throw new Error('No data received');
      }

      const formattedProducts = formatProducts(data);
      
      if (currentPage === 1) {
        setProducts(formattedProducts);
      } else {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = formattedProducts.filter(p => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
      }

      if (count !== null) {
        setTotalCount(count);
        const remainingItems = count - (startRange + formattedProducts.length);
        setHasMore(remainingItems > 0);
      } else {
        setHasMore(formattedProducts.length === PRODUCTS_PER_PAGE);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchQuery]);

  // Initial load and pagination
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Reset state when category or search changes
  useEffect(() => {
    setCurrentPage(1);
    setProducts([]);
    setHasMore(true);
    setError(null);
  }, [selectedCategory, searchQuery]);

  return {
    products,
    loading,
    error,
    totalCount,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    hasMore
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
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProduct();
  }, [id]);

  return { product, loading, error };
}
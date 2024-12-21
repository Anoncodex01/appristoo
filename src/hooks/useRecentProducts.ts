import { useState, useEffect } from 'react';
import { Product } from '../types';

const MAX_RECENT_PRODUCTS = 5;

export function useRecentProducts() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  const addRecentProduct = (product: Product) => {
    setRecentProducts(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, MAX_RECENT_PRODUCTS);
    });
  };

  return {
    recentProducts,
    addRecentProduct
  };
}
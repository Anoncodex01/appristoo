import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface RecentProductsProps {
  fetchProducts: () => Promise<Product[]>; // Function to fetch products
}

export function RecentProducts({ fetchProducts }: RecentProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [fetchProducts]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  if (products.length === 0) return <p>No recently viewed products.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold mb-6">Recently Viewed Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => {
          if (!product || !product.id || !product.name || product.price === undefined) {
            console.warn('Invalid product data:', product);
            return null;
          }

          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
}

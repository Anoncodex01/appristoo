import React from 'react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';

interface RelatedProductsProps {
  currentProduct: Product;
  relatedProducts: Product[];
}

export function RelatedProducts({ currentProduct, relatedProducts }: RelatedProductsProps) {
  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16 border-t pt-16">
      <h2 className="text-2xl font-semibold mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
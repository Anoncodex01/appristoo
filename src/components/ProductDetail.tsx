import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useProduct } from '../hooks/useProducts';
import { SHIPPING_TIME } from '../config/constants';
import { PriceRangeTable } from './product/PriceRangeTable';
import { ProductActions } from './product/ProductActions';
import { ProductSpecifications } from './product/ProductSpecifications';
import { ImageSlideshow } from './ImageSlideshow';
import { RelatedProducts } from './product/RelatedProducts';
import { formatProducts } from '../utils/formatting';
import { Product } from '../types';
import { MainLayout } from '../layouts/MainLayout';

interface ProductDetailProps {
  onViewProduct: (product: Product) => void;
}

export function ProductDetail({ onViewProduct }: ProductDetailProps) {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id!);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadRelatedProducts() {
      if (!product) return;
      
      const { data } = await supabase
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
          product_specifications (specification)
        `)
        .eq('category', product.category)
        .neq('id', product.id)
        .eq('is_archived', false)
        .limit(4);

      if (data) {
        setRelatedProducts(formatProducts(data));
      }
    }

    loadRelatedProducts();
  }, [product]);

  // Track product view
  useEffect(() => {
    async function trackView() {
      if (!id) return;

      try {
        const { data, error: selectError } = await supabase
          .from('product_views')
          .select('id, view_count')
          .eq('product_id', id);

        if (selectError) throw selectError;

        if (data && data.length > 0) {
          // Update existing view count
          const { error: updateError } = await supabase
            .from('product_views')
            .update({ 
              view_count: data[0].view_count + 1,
              last_viewed_at: new Date().toISOString()
            })
            .eq('product_id', id);
            
          if (updateError) throw updateError;
        } else {
          // Create new view record
          const { error: insertError } = await supabase
            .from('product_views')
            .insert({ product_id: id });
            
          if (insertError) throw insertError;
        }
      } catch (error) {
        console.error('Error tracking product view:', error.message || error);
        // Continue execution since view tracking is not critical
      }
    }

    if (product) {
      onViewProduct(product);
      trackView();
    }
  }, [product?.id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">Failed to load product</div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">Product not found</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image Slideshow */}
          <div>
            <ImageSlideshow images={product.images} productName={product.name} />
          </div>

          {/* Right Column - Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            <PriceRangeTable priceRanges={product.priceRanges} />

            {/* Shipping Time */}
            <div className="mb-6">
              <p className="text-gray-600">Shipping Time: {SHIPPING_TIME}</p>
              <p className="text-gray-600">Minimum Order: {product.minOrder} piece(s)</p>
            </div>

            <ProductActions 
              productName={product.name}
              productId={product.id}
              productDescription={product.description}
            />

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-3">Product Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
              </div>

              {product.specifications?.length > 0 && (
                <ProductSpecifications specifications={product.specifications} />
              )}
            </div>
          </div>
        </div>
        <RelatedProducts currentProduct={product} relatedProducts={relatedProducts} />
      </div>
    </MainLayout>
  );
}
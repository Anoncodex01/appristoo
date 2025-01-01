import React, { useEffect, useRef } from 'react';
import InfiniteAjaxScroll from '@webcreate/infinite-ajax-scroll';
import { MainLayout } from '../layouts/MainLayout';
import { CategoryMenu } from '../components/CategoryMenu';
import { ProductCard } from '../components/ProductCard';
import { RecentProducts } from '../components/RecentProducts';
import { useRecentProducts } from '../hooks/useRecentProducts';
import { useProducts } from '../hooks/useProducts';
import { Category } from '../types';

export function HomePage() {
  const { recentProducts } = useRecentProducts();
  const containerRef = useRef<HTMLDivElement>(null);
  const iasRef = useRef<InfiniteAjaxScroll | null>(null);
  const {
    products,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    selectedCategory,
    setSelectedCategory
  } = useProducts();

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    if (containerRef.current) {
      iasRef.current = new InfiniteAjaxScroll(containerRef.current, {
        item: '.product-item',
        next: () => {
          if (currentPage < totalPages && !loading) {
            setCurrentPage(currentPage + 1);
            return Promise.resolve(true);
          }
          return Promise.resolve(false);
        },
        spinner: '.loader',
        delay: 600,
        bind: false
      });

      iasRef.current.on('last', () => {
        console.log('Last page reached');
      });

      return () => {
        if (iasRef.current) {
          iasRef.current.unbind();
        }
      };
    }
  }, [containerRef.current]);

  // Bind/unbind IAS when products change
  useEffect(() => {
    if (iasRef.current) {
      iasRef.current.unbind();
      iasRef.current.bind();
    }
  }, [products]);

  return (
    <MainLayout>
      <CategoryMenu 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      {/* Product Sections */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">
            {selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Products`}
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            Failed to load products
          </div>
        )}

        <div ref={containerRef}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {loading && !products.length ? (
              // Shimmer loading effect
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="animate-pulse h-[300px] sm:h-[420px] bg-white rounded-xl overflow-hidden">
                  <div className="h-[140px] sm:h-[250px] bg-gray-200" />
                  <div className="p-3 sm:p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-8 bg-gray-200 rounded flex-1" />
                      <div className="h-8 bg-gray-200 rounded flex-1" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              products.map((product) => (
                <div key={product.id} className="product-item opacity-0 animate-fade-in">
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>

          {/* Loading spinner */}
          <div className="loader h-20 flex items-center justify-center">
            {loading && products.length > 0 && (
              <img 
                src="/infinite.svg" 
                alt="Loading more products..." 
                className="w-8 h-8 sm:w-12 sm:h-12 animate-spin-slow"
              />
            )}
          </div>
        </div>

        {/* Recent Products Section */}
        {recentProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Recently Viewed</h2>
            <RecentProducts products={recentProducts} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
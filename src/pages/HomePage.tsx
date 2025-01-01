import React, { useEffect, useRef, useState } from 'react';
import InfiniteAjaxScroll from '@webcreate/infinite-ajax-scroll';
import { MainLayout } from '../layouts/MainLayout';
import { CategoryMenu } from '../components/CategoryMenu';
import { ProductCard } from '../components/ProductCard';
import { RecentProducts } from '../components/RecentProducts';
import { useRecentProducts } from '../hooks/useRecentProducts';
import { useProducts } from '../hooks/useProducts';

export function HomePage() {
  const { recentProducts } = useRecentProducts();
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const iasRef = useRef<InfiniteAjaxScroll | null>(null);
  const [isLastPage, setIsLastPage] = useState(false);

  const {
    products,
    loading,
    error,
    hasMore,
    currentPage,
    setCurrentPage,
    selectedCategory,
    setSelectedCategory,
  } = useProducts();

  // Initialize Infinite Ajax Scroll
  useEffect(() => {
    let ias: InfiniteAjaxScroll | null = null;

    const initializeIAS = () => {
      if (!containerRef.current || !loaderRef.current) return;

      // Ensure there are items before initializing
      const items = containerRef.current.querySelectorAll('.product-item');
      if (items.length === 0 && !loading) return;

      ias = new InfiniteAjaxScroll(containerRef.current, {
        item: '.product-item',
        next: () => new Promise((resolve) => {
          if (hasMore && !loading) {
            setCurrentPage((prev) => prev + 1);
            resolve(true);
          } else {
            resolve(false);
          }
        }),
        spinner: loaderRef.current,
        delay: 600,
        bind: false,
        loadOnScroll: true,
        logger: false,
        pagination: false
      });

      ias.on('last', () => setIsLastPage(true));
      iasRef.current = ias;
    };

    // Initialize after a short delay to ensure DOM is ready
    const timer = setTimeout(initializeIAS, 100);

    return () => {
      clearTimeout(timer);
      if (iasRef.current) {
        iasRef.current.unbind();
        iasRef.current = null;
      }
    };
  }, []);

  // Bind/unbind IAS when products or hasMore changes
  useEffect(() => {
    if (!products.length) return;

    const timer = setTimeout(() => {
      if (!iasRef.current && containerRef.current && loaderRef.current) {
        // Re-initialize if not exists
        const ias = new InfiniteAjaxScroll(containerRef.current, {
          item: '.product-item',
          next: () => new Promise((resolve) => {
            if (hasMore && !loading) {
              setCurrentPage((prev) => prev + 1);
              resolve(true);
            } else {
              resolve(false);
            }
          }),
          spinner: loaderRef.current,
          delay: 600,
          bind: false,
          loadOnScroll: true,
          logger: false,
          pagination: false
        });

        ias.on('last', () => setIsLastPage(true));
        iasRef.current = ias;
      }

      if (iasRef.current) {
        iasRef.current.unbind();
        if (hasMore) {
          iasRef.current.bind();
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [products, hasMore]);

  // Handle category changes
  const handleCategoryChange = (category: string) => {
    if (iasRef.current) {
      iasRef.current.unbind();
    }
    setSelectedCategory(category);
    setIsLastPage(false);
  };

  return (
    <MainLayout>
      <CategoryMenu
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">
          {selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Products`}
        </h2>
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">Failed to load products</div>}
        
        <div className="min-h-screen">
          <div ref={containerRef} className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
              {loading && !products.length ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="animate-pulse h-[300px] sm:h-[420px] bg-white rounded-xl overflow-hidden">
                    <div className="h-[140px] sm:h-[250px] bg-gray-200" />
                    <div className="p-3 sm:p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))
              ) : (
                products.map((product) => (
                  <div key={product.id} className="product-item">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
            
            <div ref={loaderRef} className="loader h-20 flex items-center justify-center">
              {loading && products.length > 0 && !isLastPage && (
                <img
                  src="/infinite.svg"
                  alt="Loading more products..."
                  className="w-8 h-8 animate-spin"
                />
              )}
            </div>
          </div>
        </div>

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

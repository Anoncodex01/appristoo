import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { CategoryMenu } from '../components/CategoryMenu';
import { ProductCard } from '../components/ProductCard';
import { RecentProducts } from '../components/RecentProducts';
import { useRecentProducts } from '../hooks/useRecentProducts';
import { useProducts } from '../hooks/useProducts';

export function HomePage() {
  const { recentProducts } = useRecentProducts();
  const loaderRef = useRef<HTMLDivElement>(null);
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

  // Handle intersection observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, loading, setCurrentPage]);

  // Set up intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [handleObserver]);

  // Update last page status
  useEffect(() => {
    if (!hasMore && !loading) {
      setIsLastPage(true);
    } else if (hasMore) {
      setIsLastPage(false);
    }
  }, [hasMore, loading]);

  // Handle category changes
  const handleCategoryChange = (category: string) => {
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
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            Failed to load products. Please try refreshing the page.
          </div>
        )}
        
        <div className="min-h-screen">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {loading && !products.length ? (
              Array.from({ length: 8 }).map((_, index) => (
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
          
          <div 
            ref={loaderRef} 
            className={`loader h-20 flex items-center justify-center ${!hasMore && 'hidden'}`}
          >
            {loading && !isLastPage && (
              <div className="loading-spinner" />
            )}
          </div>

          {isLastPage && products.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              No more products to load
            </div>
          )}
        </div>

        {recentProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Recently Viewed</h2>
            <RecentProducts products={recentProducts} />
          </div>
        )}
      </div>

      <style jsx>{`
        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #631D63;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </MainLayout>
  );
}

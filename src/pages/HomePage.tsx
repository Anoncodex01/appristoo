import React, { useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { CategoryMenu } from '../components/CategoryMenu';
import { ProductCard } from '../components/ProductCard';
import { RecentProducts } from '../components/RecentProducts';
import { useRecentProducts } from '../hooks/useRecentProducts';
import { useProducts } from '../hooks/useProducts';
import { Category } from '../types';
import { Pagination } from '../components/Pagination';

export function HomePage() {
  const { recentProducts } = useRecentProducts();
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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="mt-12">
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>
      
      {recentProducts.length > 0 && (
        <RecentProducts products={recentProducts} />
      )}
    </MainLayout>
  );
}
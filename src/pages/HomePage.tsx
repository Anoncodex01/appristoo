import React, { useEffect } from 'react';
import { CategoryGrid } from '../components/CategoryGrid';
import { MainLayout } from '../layouts/MainLayout';
import { CategoryMenu } from '../components/CategoryMenu';
import { ProductCard } from '../components/ProductCard';
import { RecentProducts } from '../components/RecentProducts';
import { useRecentProducts } from '../hooks/useRecentProducts';
import { useProductSections } from '../hooks/useProductSections';
import { useProducts } from '../hooks/useProducts';
import { ProductFilterButtons } from '../components/product-sections/ProductFilterButtons';
import { Category } from '../types';
import { ProductSection } from '../components/product-sections/ProductSection';
import { Pagination } from '../components/Pagination';

export function HomePage() {
  const [selectedFilter, setSelectedFilter] = React.useState('all');
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
  const { newProducts, popularProducts, recommendedProducts, loading: sectionsLoading } = useProductSections();

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const getFilteredProducts = () => {
    const filteredProducts = selectedFilter === 'all' ? products : [];
    
    switch (selectedFilter) {
      case 'popular':
        return popularProducts;
      case 'new':
        return newProducts;
      case 'recommended':
        return recommendedProducts;
      default:
        return filteredProducts;
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedFilter('all');
  };

  return (
    <MainLayout>
      <CategoryMenu 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <CategoryGrid onSelectCategory={handleCategorySelect} />
      
      {/* Product Sections */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">
            {selectedFilter === 'all' ? 'Available Products' : 
             selectedFilter === 'popular' ? 'Most Popular Products' :
             selectedFilter === 'new' ? 'New Arrivals' : 'Recommended Products'}
          </h2>
          <ProductFilterButtons
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            Failed to load products
          </div>
        )}
        {(loading || sectionsLoading) ? (
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
            {getFilteredProducts().map(product => (
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
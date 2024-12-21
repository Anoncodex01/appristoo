import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { getCategoryProductCounts } from '../hooks/useProducts';
import { ShoppingBag, Smartphone, Home } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  count: number;
  icon: React.ReactNode;
  onClick: () => void;
}

function CategoryCard({ category, count, icon, onClick }: CategoryCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-purple-50 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 rounded-bl-2xl font-medium">
          {count} Items
        </div>
        
        <div className="flex flex-col items-center">
          <div className="mb-4 p-4 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
            {icon}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 text-center group-hover:text-purple-600 transition-colors">
            {category.split('_').join(' ')}
          </h3>
          
          <div className="mt-4 inline-flex items-center text-sm text-purple-600 font-medium">
            <span>Browse Category</span>
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategoryGridProps {
  onSelectCategory: (category: Category) => void;
}

export function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadCounts() {
      try {
        const counts = await getCategoryProductCounts();
        setCategoryCounts(counts);
      } catch (error) {
        console.error('Error loading category counts:', error);
      } finally {
        setLoading(false);
      }
    }
    loadCounts();
  }, []);

  const categoryIcons = {
    'BEAUTY': <ShoppingBag className="w-8 h-8 text-purple-600" />,
    'ELECTRONICS': <Smartphone className="w-8 h-8 text-purple-600" />,
    'HOME APPLIANCES': <Home className="w-8 h-8 text-purple-600" />
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Explore Categories</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our wide range of products across different categories. 
          From electronics to home appliances, we've got everything you need.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Loading skeleton
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-2xl bg-gray-200 p-6">
                <div className="h-20 w-20 bg-gray-300 rounded-xl mx-auto mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ))
        ) : (
          Object.entries(categoryIcons).map(([category, icon]) => (
            <CategoryCard
              key={category}
              category={category as Category}
              count={categoryCounts[category] || 0}
              icon={icon}
              onClick={() => onSelectCategory(category as Category)}
            />
          ))
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category | 'all';
  onSelectCategory: (category: Category | 'all') => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const categories = ['all', 'Groceries', 'beauty', 'Electronics'];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category as Category | 'all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${selectedCategory === category 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}
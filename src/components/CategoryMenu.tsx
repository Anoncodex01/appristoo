import React from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../config/constants';

interface CategoryMenuProps {
  selectedCategory: Category | 'all';
  onSelectCategory: (category: Category | 'all') => void;
}

export function CategoryMenu({ selectedCategory, onSelectCategory }: CategoryMenuProps) {
  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`p-4 text-center hover:bg-purple-50 transition-colors
              ${selectedCategory === 'all' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
          >
            All Categories
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`p-4 text-center hover:bg-purple-50 transition-colors
                ${selectedCategory === category ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
import React from 'react';

interface ProductFilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export function ProductFilterButtons({ selectedFilter, onFilterChange }: ProductFilterButtonsProps) {
  const filters = [
    { id: 'all', label: 'All Products' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'new', label: 'New Arrivals' },
    { id: 'recommended', label: 'Recommended' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${selectedFilter === filter.id
              ? 'bg-purple-600 text-white shadow-md transform scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-purple-600 border border-gray-200'
            }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
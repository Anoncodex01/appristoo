import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';

interface SearchDropdownProps {
  onClose: () => void;
}

export function SearchDropdown({ onClose }: SearchDropdownProps) {
  const [query, setQuery] = useState('');
  const { products } = useProducts();
  const [isSearching, setIsSearching] = useState(false);

  const filteredProducts = products
    .filter(p => !p.isArchived)
    .filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
      onClose();
    }, 300);
  };

  return (
    <div className="flex-1">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          autoFocus
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600 animate-spin" />
        )}
      </form>

      {query && (
        <div className="mt-4 space-y-2">
          {filteredProducts.map(product => (
            <a
              key={product.id}
              href={`/product/${product.id}`}
              className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg"
              onClick={onClose}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {product.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Search, MapPin, X } from 'lucide-react';

export function SearchHeader() {
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const { searchQuery, setSearchQuery } = useProducts();

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        // Navigate back if we're on the search page
        if (window.location.pathname === '/search') {
          navigate(-1);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      navigate('/search');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (window.location.pathname === '/search') {
      navigate(-1);
    }
  };

  return (
    <div className="bg-black text-white py-4">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">apristo</h1>
          <p className="text-sm text-purple-300">Tanzania's lowest prices - we won't be beaten on your weekly shop</p>
        </div>
        <div ref={searchRef} className="relative w-full max-w-xl mx-auto">
          <form className="relative flex items-center">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="I'm looking for ..."
                className="w-full pl-12 pr-32 py-3 border border-purple-600 bg-white text-black rounded-lg focus:outline-none focus:border-purple-400"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Clear search"
                >
                  <X size={20} />
                </button>
              )}
              <div className="absolute right-0 top-0 h-full flex items-center pr-4 border-l border-gray-200">
                <div className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-purple-600">
                  <MapPin className="w-5 h-5" />
                  <span>Location</span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="ml-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}